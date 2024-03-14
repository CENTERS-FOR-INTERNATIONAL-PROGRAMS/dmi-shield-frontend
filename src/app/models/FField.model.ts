import { KeyValue } from "./KeyValue.model";
import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { MFieldOption } from "./MFieldOption.model";
import { v1 } from 'uuid';
import { FormControl, Validators } from "@angular/forms";
import { CField } from "./CField.model";
import { DataFilter } from "./DataFilter.model";
import { DField } from "./DField.model";
import { IKeysCFields } from "../interfaces/IKeyValue.model";
import { MCode } from "./MCode.model";
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";

PouchDB.plugin(plugin);

export class FField {
  _id: string = "";
  _evaluated: number = 0;
  mfield_id: string = "";

  // Data {Field}
  DFieldInstance: DField = new DField;

  /**Parent {MForm}._id */
  mform_id: string = "";

  MFieldOptions: MFieldOption[] = [];

  CFields: IKeysCFields = {
    values: {},
    keys: []
  };

  MCodeLogic: MCode = new MCode({
    mcode_raw: "",
    mcode_seeded: "",
    mcode_result: null,
    mcode_default: null,
    mcode_error_default: null,
    mcode_parent: null,
    mcode_params: null,
    mcode_fields: []
  });

  MCodeOptionsTag: MCode = new MCode({
    mcode_raw: "",
    mcode_seeded: "",
    mcode_result: null,
    mcode_default: null,
    mcode_error_default: null,
    mcode_parent: null,
    mcode_params: null,
    mcode_fields: []
  });

  FormControlInstance: FormControl = new FormControl();
  
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
    md_database: "ffields"
  };
  // #endregion

  constructor() { }

  seedInstance() {
    let SeedCFields: KeyValue = {};
    let TempCField = new CField();

    SeedCFields["field_validator"] = new CField({
      field_name: "field_validator",
      field_label: "Validator",
      field_value: "",
      field_required: false,
      field_type: {
        value: 'multiple_select'
      },
      field_options: [
        {
          label: 'Required',
          value: 'required'
        }
      ]
    });

    SeedCFields["field_index"] = new CField({
      field_name: "field_index",
      field_label: "Index",
      field_value: 1,
      field_required: true,
      field_type: {
        value: 'number'
      }
    });

    SeedCFields["field_logic"] = new CField({
      field_name: "field_logic",
      field_label: "Logic",
      field_value: null,
      field_required: false,
      field_type: {
        value: 'string'
      }
    });

    SeedCFields["field_options_tag"] = new CField({
      field_name: "field_options_tag",
      field_label: "Field Options Tag",
      field_value: null,
      field_required: false,
      field_type: {
        value: 'string'
      }
    });

    Object.keys(SeedCFields).forEach((key: string) => {
      let seed_found = false;

      if (this.CFields.values[key]) {
        seed_found = true;
      }

      if (!seed_found) {
        this.CFields.values[key] = SeedCFields[key];
      } else {
        if ((this.CFields.values[key]['field_type']['value'] == 'multiple_select') ||
          (this.CFields.values[key]['field_type']['value'] == 'single_select')) {
          this.CFields.values[key]['field_options'] = SeedCFields[key]['field_options'];
        }
      }
    });

    // Update keys
    this.CFields.keys = Object.keys(this.CFields.values);

    // #region Seed {DField}
    this.DFieldInstance.df_ffield_id = this._id;
    this.DFieldInstance.df_label = this.CFields.values['field_label']['field_value'];
    this.DFieldInstance.df_name = this.CFields.values['field_name']['field_value'];
    // #endregion
  }

  parseInstance(doc: any) {
    // Prerequisites
    let TempCField: CField = new CField();

    this._id = doc['_id'];
    this.mfield_id = doc['mfield_id'];
    this.mform_id = doc['mform_id'];
    this.CFields = TempCField.parseComposite(doc['cfields']);

    this.seedInstance();

    // Setup Field Validator
    if (this.CFields.values['field_validator']) {
      if (this.CFields.values['field_validator']['field_value']) {
        this.CFields.values['field_validator']['field_value'].forEach((mfield_validator: string) => {
          if (mfield_validator == "required") {
            this.FormControlInstance.addValidators(Validators.required);
          }
        });
      }
    }

    this.MCodeLogic = new MCode({
      mcode_raw: this.CFields.values['field_logic']['field_value'],
      mcode_seeded: "",
      mcode_result: null,
      mcode_default: true,
      mcode_error_default: false,
      mcode_params: 'DFields: KeyValue',
      mcode_parent: 'DFields',
      mcode_fields: []
    });

    this.MCodeOptionsTag = new MCode({
      mcode_raw: this.CFields.values['field_options_tag']['field_value'],
      mcode_seeded: "",
      mcode_result: null,
      mcode_default: "",
      mcode_error_default: "~",
      mcode_params: 'DFields: KeyValue',
      mcode_parent: 'DFields',
      mcode_fields: []
    });

    this.acquireFieldOptions();

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: FField[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new FField();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: KeyValue = {};
    let TempCField = new CField();

    doc['_id'] = this._id;
    doc['mfield_id'] = this.mfield_id;
    doc['mform_id'] = this.mform_id;
    doc['cfields'] = TempCField.mapComposite(this.CFields);

    doc['_rev'] = _rev;

    return doc;
  }

  putInstance(success: any, error: any) {
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
          if (success) success(true);

          // Sync to remote
          this.syncToRemote((res: boolean) => {
            // TODO! Handle success
          });
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
    let FFields: FField[] = [];

    local_db.createIndex({
      index: {
        fields: ['cfields.field_index.field_value']
      }
    }).then((res: any) => {
      local_db.find({
        selector: {
          mform_id: this.mform_id,
          'cfields.field_index.field_value': { $gt: null },
          'cfields.field_name.field_value': { $regex: ".*" + this.MFilter.mf_search + ".*" }
        },
        sort: [{ 'cfields.field_index.field_value': 'asc' }]
      }).then(res => {
        FFields = instance.parseComposite(res.docs);
        success(FFields);
      }).catch(err => {
        error(err);
      });
    });
  }

  async seedMFieldOptions(mfield_id: string) {
    let FilterFieldOption = new MFieldOption();
    FilterFieldOption.fo_field_id = mfield_id;

    this.MFieldOptions = [];

    FilterFieldOption.acquireComposite((CompositeFieldOptions: MFieldOption[]) => {
      this.MFieldOptions = CompositeFieldOptions;
    }, () => {
      // TODO! Handle errors
    })
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

  acquireFieldOptions() {
    if ((this.CFields.values['field_type']['field_value'][0]['value'] == "single_select") ||
      (this.CFields.values['field_type']['field_value'][0]['value'] == "multiple_select")) {

      let FilterFieldOption = new MFieldOption();
      FilterFieldOption.fo_field_id = this.mfield_id;
      FilterFieldOption.MFilter.mf_tag = this.MCodeOptionsTag.IMCodeInstance.mcode_result;

      FilterFieldOption.acquireComposite((MFieldOptions: MFieldOption[]) => {
        this.MFieldOptions = MFieldOptions;
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }
}