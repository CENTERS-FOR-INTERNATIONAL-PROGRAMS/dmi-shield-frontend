import { KeyValue } from "./KeyValue.model";
import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { CField } from "./CField.model";
import { FField } from "./FField.model";
import { DataFilter } from "./DataFilter.model";
import { v1 } from "uuid";
import { FormControl, Validators } from "@angular/forms";
import { DForm } from "./DForm.model";
import { IKeysCFields } from "../interfaces/IKeyValue.model";

PouchDB.plugin(plugin);

export class FForm {
  _id: string = "";

  CFields: IKeysCFields = {
    values: {},
    keys: []
  }

  /** Blueprint {MForm}._id */
  mform_id: string = "";

  /**Parent {MForm}._id */
  parent_mform_id: string = "";

  /** Form {DField}s */
  FFields: FField[] = [];

  /** Data form */
  DFormInstance: DForm = new DForm();

  _processing: boolean = false;
  _action_result: boolean = false;
  _database: string = "fforms";

  _data_filter: DataFilter = {
    df_search: "",
    df_tag: ""
  }

  constructor() {
    this.seedInstance();
  }

  cloneInstance(response: any, error: any) {
    let CloneFForm = new FForm();
    CloneFForm._id = this._id;

    CloneFForm.acquireInstance((doc: any) => {
      CloneFForm.parseInstance(doc);

      CloneFForm.acquireFFields((res: boolean) => {
        response(CloneFForm);
      });
    }, (err: any) => {
      error(err);
    });
  }

  seedInstance() {
    let SeedCFields: KeyValue = {};

    SeedCFields["form_logic"] = new CField({
      field_name: "form_logic",
      field_label: "Logic",
      field_value: null,
      field_type: {
        value: 'string'
      }
    });

    SeedCFields["form_index"] = new CField({
      field_name: "form_index",
      field_label: "Index",
      field_value: '1',
      field_type: {
        value: 'number'
      },
      field_required: true
    });

    SeedCFields["form_repeatable"] = new CField({
      field_name: "form_repeatable",
      field_label: "Repeatable",
      field_value: null,
      field_type: {
        value: 'single_select'
      },
      field_options: [{
        label: 'True',
        value: true
      }, {
        label: 'False',
        value: false
      }],
      field_required: true
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
    let TempCField = new CField();

    this._id = doc['_id'];
    this.mform_id = doc['mform_id'];
    this.parent_mform_id = doc['parent_mform_id'];

    this.CFields = TempCField.parseComposite(doc['cfields']);

    this.seedInstance();

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: FForm[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new FForm();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: KeyValue = {};
    let TempCField = new CField();

    doc['_rev'] = _rev;
    doc['_id'] = this._id;
    doc['mform_id'] = this.mform_id;
    doc['parent_mform_id'] = this.parent_mform_id;
    doc['cfields'] = TempCField.mapComposite(this.CFields);

    return doc;
  }

  putInstance(success: any, error: any) {
    // Prerequisites
    this._processing = true;
    let _rev: string = "";

    // Create ident
    if (this._id == "") this._id = v1();

    // Connect to remote 
    let db = new PouchDB(this._database);

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

          //Success
          if (success) success(res);
        }).catch((err: any) => {
          if (error) error(err);
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
    let db = new PouchDB(this._database);

    // Acquire instance
    this.acquireInstance(((doc: any) => {
      _rev = doc["_rev"];
    }), null, () => {
      db.remove(this._id, _rev)
        .then(res => {
          this._action_result = true;

          // Sync to remote
          this.syncToRemote((res: boolean) => {
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

  validateInstance(): boolean {
    let fform_valid = true;

    this.FFields.forEach((SeekFField: FField) => {
      if (SeekFField.FormControlInstance.hasError("required")) {
        fform_valid = false;
      }
    });

    return fform_valid;
  }

  // #region Acquire

  async acquireInstance(success: any = null, error: any = null, finished: any = null) {
    let db = new PouchDB(this._database);

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
    let local_db = new PouchDB(this._database);
    let instance = this;

    local_db.createIndex({
      index: {
        fields: ['cfields.form_index.field_value']
      }
    }).then((res: any) => {
      local_db.find({
        selector: {
          parent_mform_id: this.parent_mform_id,
          'cfields.form_index.field_value': { $gt: null },
          'cfields.form_name.field_value': { $regex: ".*" + this._data_filter.df_search + ".*" }
        }
      }).then(res => {
        success(instance.parseComposite(res.docs));
      }).catch(err => {
        error(err);
      });
    });
  }

  // #endregion

  // #region Synchronize

  async syncToRemote(on: any) {
    let local_db = new PouchDB(this._database);
    let remote_db = new PouchDB(config.COUCHDB_ALCHEMY + "/" + this._database);

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
    let local_db = new PouchDB(this._database);
    let remote_db = new PouchDB(config.COUCHDB_ALCHEMY + "/" + this._database);

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

  // #region {FField}

  acquireFFields(response: any) {
    let FilterFField = new FField();
    FilterFField.mform_id = this.mform_id;

    FilterFField.acquireComposite((FFields: FField[]) => {
      this.FFields = FFields;

      if (response) response(true);
    }, (err: any) => {
      // TODO! Handle errors
      if (response) response(false);
    });
  }

  compileDFields() {
    this.DFormInstance.fform_id = this._id;
    this.DFormInstance.mform_id = this.mform_id;

    this.FFields.forEach((SeekFField: FField) => {
      this.DFormInstance.DFields[SeekFField.DFieldInstance.df_name] = SeekFField.DFieldInstance;
    });
  }

  // #endregion

  // #region {DForm}s
  mapDForm(DFormInstance: DForm) {
    Object.keys(DFormInstance.DFields).forEach((key: any) => {
      this.FFields.forEach((SeekFField: FField) => {
        if (SeekFField.CFields.values['field_name']['field_value'] == DFormInstance.DFields[key]['df_name']) {
          SeekFField.DFieldInstance = DFormInstance.DFields[key];
        }
      });
    });
  }
  // #endregion
}