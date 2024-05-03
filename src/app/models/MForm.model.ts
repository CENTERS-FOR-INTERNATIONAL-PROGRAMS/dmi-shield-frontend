import { IKeyArray, KeyValue } from "./KeyValue.model";
import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { CField } from "./CField.model";
import { MField } from "./MField.model";
import { FField } from "./FField.model";
import { DataFilter } from "./DataFilter.model";
import { FForm } from "./FForm.model";
import { v1 } from "uuid";
import { DForm } from "./DForm.model";
import { IKeyValue, IKeysCFields, IKeysValues } from "../interfaces/IKeyValue.model";
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";

PouchDB.plugin(plugin);

export class MForm {
  _id: string = "";

  CFields: IKeysCFields = {
    values: {},
    keys: []
  }

  FilterFField: FField = new FField();
  FFields: FField[] = [];

  FilterFForm: FForm = new FForm();
  FForms: IKeyArray = {};
  FFormKeys: string[] = [];

  form_mfields: MField[] = [];
  form_mforms: MForm[] = [];

  DFormInstance: DForm = new DForm();

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
    md_database: "mforms"
  };
  // #endregion

  constructor() {
    this.seedInstance();
  }

  seedInstance() {
    // Prerequisites
    let TempCField = new CField();

    let SeedCFields: IKeyValue = {};

    SeedCFields["form_label"] = new CField({
      field_name: "form_label",
      field_label: "Label",
      field_value: "",
      field_required: true,
      field_type: {
        value: 'string'
      }
    });

    SeedCFields["form_name"] = new CField({
      field_name: "form_name",
      field_label: "Name",
      field_value: "",
      field_required: true,
      field_type: {
        value: 'string'
      }
    });

    SeedCFields["form_description"] = new CField({
      field_name: "form_description",
      field_label: "Description",
      field_value: "",
      field_required: true,
      field_type: {
        value: 'string'
      }
    });

    SeedCFields["form_tags"] = new CField({
      field_name: "form_tags",
      field_label: "Tags",
      field_value: "",
      field_required: false,
      field_type: {
        value: 'string'
      }
    });

    this.CFields = TempCField.parseComposite(SeedCFields);
  }

  parseInstance(doc: any) {
    // Prerequisites
    let FilterMField: MField = new MField();
    let FilterMForm: MForm = new MForm();
    let TempCField: CField = new CField();

    this._id = doc['_id'];
    this.CFields = TempCField.parseComposite(doc['cfields']);

    try {
      this.form_mfields = FilterMField.parseComposite(doc['form_mfields']);
    } catch (error) { console.error(error) }

    try {
      this.form_mforms = FilterMForm.parseComposite(doc['form_mforms']);
    } catch (error) { console.error(error) }

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: MForm[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new MForm();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: KeyValue = {};
    let TempCField = new CField();

    doc['_rev'] = _rev;
    doc['_id'] = this._id;
    doc['cfields'] = TempCField.mapComposite(this.CFields);

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

  // #region Acquire

  async acquireInstance(success: any = null, error: any = null, finished: any = null) {
    let db = new PouchDB(this.MDatabase.md_database);

    await db.get(this._id)
      .then(function (doc) {
        if (success)
          success(doc);
      }).catch(function (err) {
        if (error)
          error(err)
      }).finally(() => {
        if (finished)
          finished();
      });
  }

  async acquireComposite(success: any, error: any) {
    let local_db = new PouchDB(this.MDatabase.md_database);
    let instance = this;

    local_db.find({
      selector: {
        'cfields.form_name.field_value': { $regex: ".*" + this.MFilter.mf_search + ".*" }
      }
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

  // #region Attach and detatch {FField}
  attachFField(NewMField: MField, success: any, error: any) {
    let mfield_found = false;

    let FilterFField = new FField();
    FilterFField.mform_id = this._id;

    FilterFField.acquireComposite((CompositeFFields: FField[]) => {
      CompositeFFields.forEach((SeekFField: FField) => {
        if (SeekFField.mfield_id == NewMField._id) {
          mfield_found = true;
        }
      });

      // Attach {FField}
      if (!mfield_found) {
        let NewFField = NewMField.toFField();
        NewFField.mform_id = this._id;

        NewFField.putInstance((res: boolean) => {
          success(res);
        }, (err: any) => {
          error(err);
        });
      }

      // {FField} exists
      else {
        error(false);
      }
    }, (err: any) => {
      error(err);
    });
  }

  attachFForm(BlueprintMForm: MForm, success: any, error: any) {
    let fform_found = false;

    this.FilterFForm.parent_mform_id = this._id;

    this.FilterFForm.acquireComposite((FForms: FForm[]) => {
      FForms.forEach((SeekFForm: FForm) => {
        if (SeekFForm.mform_id == BlueprintMForm._id) {
          fform_found = true;
        }
      });

      // Attach {FForm}
      if (!fform_found) {
        if (BlueprintMForm._id != this._id) {
          // Seed new {FForm}
          let NewFForm = new FForm();
          NewFForm.mform_id = BlueprintMForm._id;
          NewFForm.parent_mform_id = this._id;
          NewFForm.CFields = BlueprintMForm.CFields;
          NewFForm.seedInstance();

          NewFForm.putInstance((res: boolean) => {
            success(res);
          }, (err: any) => {
            error(err);
          });
        } else {
          // Cannot attach parent to child
          error(false);
        }
      }

      // {FForm} exists
      else {
        error(false);
      }
    }, (err: any) => {
      error(err);
    });
  }
  // #endregion

  // #region {FField}, {DForm}

  acquireFFields(response: any, error: any) {
    this.FilterFField.mform_id = this._id;

    this.FilterFField.acquireComposite((FFields: FField[]) => {
      this.FFields = FFields;

      response();
    }, (err: any) => {
      error(err);
    });
  }

  compileDForm() {
    this.compileDFields();
    this.compileDForms();
  }

  compileDFields() {
    this.DFormInstance.mform_id = this._id;

    this.FFields.forEach((SeekFField: FField) => {
      this.DFormInstance.DFields[SeekFField.DFieldInstance.df_name] = SeekFField.DFieldInstance;
    });
  }

  compileDForms() {
    Object.keys(this.FForms).forEach((key: string) => {
      let fform_name = this.FForms[key][0].CFields.values['form_name']['field_value'];
      this.DFormInstance.DForms[fform_name] = [];

      this.FForms[key].forEach((SeekFForm: FForm) => {
        SeekFForm.compileDFields();

        this.DFormInstance.DForms[fform_name].push(SeekFForm.DFormInstance.mapInstance("~"));
      });
    });
  }
  // #endregion

  // #region {FForm}
  acquireFForms(response: any, error: any, acquire_ffields: boolean = true,) {
    let FilterFForm = new FForm();
    this.FForms = {};

    FilterFForm.parent_mform_id = this._id;
    FilterFForm.acquireComposite((FForms: FForm[]) => {
      FForms.forEach((SeekFForm: FForm) => {
        this.FForms[SeekFForm._id] = [];
        this.FFormKeys.push(SeekFForm._id);
        this.FForms[SeekFForm._id].push(SeekFForm);

        if (acquire_ffields) {
          SeekFForm.acquireFFields((res: boolean) => { });
        }
      });

      response();
    }, (err: any) => {
      error(err);
      // TODO! Handle errors
    });
  }
  // #endregion

  // #region {DForm}

  mapDForm() {
    // Map {DField}s
    Object.keys(this.DFormInstance.DFields).forEach((key: any) => {
      this.FFields.forEach((SeekFField: FField) => {
        if (SeekFField.CFields.values['field_name']['field_value'] == this.DFormInstance.DFields[key]['df_name']) {
          SeekFField.DFieldInstance = this.DFormInstance.DFields[key];
        }
      });
    });

    // Map {FForm}s
    Object.keys(this.DFormInstance.DForms).forEach((key: any) => {
      this.DFormInstance.DForms[key].forEach((SeekDForm: DForm, dform_index: number) => {
        let IndexFForm: FForm = this.FForms[SeekDForm.fform_id][0];

        let TempFForm: FForm = this.FForms[SeekDForm.fform_id][dform_index];

        if (TempFForm) {
          TempFForm.acquireFFields((res: any) => {
            TempFForm.mapDForm(SeekDForm);
          });
        } else {
          IndexFForm.cloneInstance((ClonedFForm: FForm) => {
            ClonedFForm.mapDForm(SeekDForm);
            this.FForms[SeekDForm.fform_id].push(ClonedFForm);
          }, (err: any) => {
            // TODO! Handle errors
          });
        }
      });

    });
  }
  // #endregion

}
