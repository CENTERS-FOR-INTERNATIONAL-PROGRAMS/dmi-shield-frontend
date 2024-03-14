import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { KeyValue } from "./KeyValue.model";
import { CField } from "./CField.model";
import { IKeysCFields } from "../interfaces/IKeyValue.model";
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";
import { v1 } from "uuid";

PouchDB.plugin(plugin);

export class MFieldOption {
  _id: string = "";
  fo_field_id: string = "";

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
    md_database: "mfield_options"
  };
  // #endregion

  constructor() {
    this.seedInstance();
  }

  seedInstance() {
    this.CFields.values["fo_label"] = new CField({
      field_name: "fo_label",
      field_label: "Label",
      field_value: "",
      field_required: true,
      field_type: {
        value: 'string'
      }
    });

    this.CFields.values["fo_value"] = new CField({
      field_name: "fo_value",
      field_label: "Value",
      field_required: true,
      field_value: "",
      field_type: {
        value: 'string'
      }
    });

    this.CFields.values["fo_tag"] = new CField({
      field_name: "fo_tag",
      field_label: "Tag",
      field_required: true,
      field_value: "",
      field_type: {
        value: 'string'
      }
    });

    this.CFields.keys = Object.keys(this.CFields.values);
  }

  parseInstance(doc: any) {
    // Prerequisites
    let TempCField: CField = new CField();

    this._id = doc['_id'];
    this.fo_field_id = doc['fo_field_id'];
    this.CFields = TempCField.parseComposite(doc['cfields']);

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: MFieldOption[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new MFieldOption();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    // Prerequisites
    let TempCField = new CField();

    let doc = {
      "_rev": _rev,
      "_id": this._id,
      "fo_field_id": this.fo_field_id,
      "cfields": TempCField.mapComposite(this.CFields)
    }

    return doc;
  }

  putInstance(response: any, error: any) {
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

          response(res);

          // Sync to remote
          this.syncToRemote((res: boolean) => {
            // TODO! Handle success
          });
        }).catch((err: any) => {
          error(err);
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
        .then(response => {
          this._action_result = true;

          // Sync to remote
          this.syncToRemote((response: boolean) => {
            // TODO! Handle success
          });

          success(response);
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
    let db_selector: KeyValue = {
      fo_field_id: this.fo_field_id,
      'cfields.fo_label.field_value': { $regex: ".*" + this.MFilter.mf_search + ".*" }
    }

    // Attach filter tags 
    if (this.MFilter.mf_tag != "") {
      db_selector['cfields.fo_tag.field_value'] = { $regex: ".*" + this.MFilter.mf_tag + ".*" }
    }

    local_db.find({
      selector: db_selector
    }).then(res => {
      success(instance.parseComposite(res.docs));
    }).catch(err => {
      error(err);
    });
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
        // TODO! Handle errors
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
        // TODO! Handle errors
      });
  }

  // #endregion
}