import { KeyValue } from "./KeyValue.model";
import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { CField } from "./CField.model";
import { MFieldOption } from "./MFieldOption.model";
import { FField } from "./FField.model";
import { IKeysCFields } from "../interfaces/IKeyValue.model";
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";
import { v1 } from "uuid";

PouchDB.plugin(plugin);

export class MField {
  _id: string = "";

  MFieldsOptions: MFieldOption[] = [];
  CFields: IKeysCFields = {
    values: {},
    keys: []
  };

  _processing: boolean = false;
  _action_result: boolean = false;

  // #region System
  MStatus: IModelStatus = {
    ms_processing: false,
    ms_action_result: false
  };

  MFilter: IModelFilter = {
    mf_search: "",
    mf_tag: ""
  };

  MDatabase: IModelDatabase = {
    md_database: "mfields"
  };
  // #endregion

  constructor() {
    this.seedInstance();
  }

  seedInstance() {
    let SeedCFields: KeyValue = {};

    SeedCFields["field_label"] = new CField({
      field_name: "field_label",
      field_label: "Label",
      field_value: "",
      field_type: {
        value: 'string'
      },
      field_required: true
    });

    SeedCFields["field_name"] = new CField({
      field_name: "field_name",
      field_label: "Name",
      field_value: "",
      field_type: {
        value: 'string'
      },
      field_required: true
    });

    SeedCFields["field_tags"] = new CField({
      field_name: "field_tags",
      field_label: "Tags",
      field_value: "",
      field_type: {
        value: 'string'
      },
      field_required: false
    });

    SeedCFields["field_type"] = new CField({
      field_name: "field_type",
      field_label: "Type",
      field_value: "",
      field_type: {
        value: 'single_select'
      },
      field_required: true,
      field_options: [
        {
          label: 'String',
          value: 'string',
          selected: false
        }, {
          label: 'Number',
          value: 'number',
          selected: false
        }, {
          label: 'Date',
          value: 'date',
          selected: false
        }, {
          label: 'Single Select',
          value: 'single_select',
          selected: false
        }, {
          label: 'Multiple Select',
          value: 'multiple_select',
          selected: false
        }
      ]
    });

    Object.keys(SeedCFields).forEach((seed_key: string) => {
      let seed_found = false;

      if (this.CFields.values[seed_key]) {
        seed_found = true;
      }

      if (!seed_found) {
        this.CFields.values[seed_key] = SeedCFields[seed_key];
      }
    });

    this.CFields.keys = Object.keys(this.CFields.values);
  }

  parseInstance(doc: any) {
    // Prerequisites
    let TempCField: CField = new CField();

    this._id = doc['_id'];
    this.CFields = TempCField.parseComposite(doc['cfields']);

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: MField[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new MField();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    // Prerequisites
    let TempCField = new CField();
    let doc: KeyValue = {};

    doc['_id'] = this._id;
    doc['cfields'] = TempCField.mapComposite(this.CFields);
    doc['_rev'] = _rev;

    return doc;
  }

  putInstance() {
    // Prerequisites
    this._processing = true;
    let _rev: string = "";

    // Create ident
    if (this._id == "") this._id = v1();
    
    // Connect to remote 
    let db = new PouchDB(this.MDatabase.md_database);

    // Acquire instance
    this.acquireInstance(((doc: any) => {
      _rev = doc["_rev"];
    }), null, () => {
      db.put(this.mapInstance(_rev))
        .then(res => {
          this._action_result = true;

          // Sync to remote
          this.syncToRemote((res: boolean) => {
            // TODO! Handle success
          });
        }).catch((err: any) => {
          // TODO! Handle errors
          console.log("Error", err);
        }).finally(() => {
          this._processing = false;
        });
    });
  }

  removeInstance(success: any, error: any) {
    // Prerequisites
    this._processing = true;
    let _rev: string = "";

    // Connect to remote 
    let db = new PouchDB(this.MDatabase.md_database);

    // Acquire instance
    this.acquireInstance(((doc: any) => {
      _rev = doc["_rev"];
    }), null, () => {
      db.remove(this._id, _rev)
        .then(res => {
          this._action_result = true;

          // Sync to remote
          this.syncToRemote((response: boolean) => {
            // TODO! Handle success
          });

          success(res);
        }).catch((err) => {
          error(err);
        }).finally(() => {
          this._processing = false;
        });
    });
  }

  // #region Acquire

  async acquireInstance(success: any = null, error: any = null, finished: any = null) {
    let db = new PouchDB(this.MDatabase.md_database);

    await db.get(this._id)
      .then(function (doc) {
        if (success) success(doc);
      }).catch(function (err) {
        if (error) error(err)
      }).finally(() => {
        if (finished) finished();
      });
  }

  async acquireComposite(success: any, error: any) {
    let local_db = new PouchDB(this.MDatabase.md_database);
    let instance = this;

    local_db.find({
      selector: {
        'cfields.field_name.field_value': { $regex: ".*" + this.MFilter.mf_search + ".*" }
      }
    }).then(res => {
      success(instance.parseComposite(res.docs));
    }).catch(err => {
      error(err);
    });
  }

  async acquireMFieldOptions(mfield_id: string) {
    let FilterFieldOption = new MFieldOption();
    FilterFieldOption.fo_field_id = mfield_id;

    this.MFieldsOptions = [];

    FilterFieldOption.acquireComposite((CompositeFieldOptions: MFieldOption[]) => {
      this.MFieldsOptions = CompositeFieldOptions;
    }, () => { });
  }
  // #endregion

  // #region Synchronize

  async syncToRemote(on: any) {
    let local_db = new PouchDB(this.MDatabase.md_database);
    let remote_db = new PouchDB(config.COUCHDB_ALCHEMY + "/" + this.MDatabase.md_database);

    await local_db.replicate.to(remote_db)
      .on('complete', function () {
        on(true);
      })
      .on('error', function (error) {
        on(false);
      });
  }

  async syncFromRemote(on: any) {
    let local_db = new PouchDB(this.MDatabase.md_database);
    let remote_db = new PouchDB(config.COUCHDB_ALCHEMY + "/" + this.MDatabase.md_database);

    await remote_db.replicate.to(local_db)
      .on('complete', function () {
        on(true);
      })
      .on('error', function (error) {
        on(false);
      });
  }

  // #endregion

  toFField(): FField {
    let FFieldInstance = new FField();

    FFieldInstance._id = "";
    FFieldInstance.mfield_id = this._id;
    FFieldInstance.CFields = this.CFields;
    FFieldInstance.seedInstance();

    return FFieldInstance;
  }
}