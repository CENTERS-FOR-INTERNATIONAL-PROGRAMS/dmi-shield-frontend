import { KeyValue } from "./KeyValue.model";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { v1 } from "uuid";
import { config } from "../config/config";
import { DataFilter } from "./DataFilter.model";
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";

PouchDB.plugin(plugin);

export class DForm {
  _id: string = "";

  fform_id: string = "~";
  mform_id: string = "";

  // Data fields keys
  DFieldsKeys: string[] = [];

  // Data fields
  DFields: KeyValue = {};

  // Data forms
  DForms: KeyValue = {};

  // Metadata
  df_created_timestamp: string = "";
  df_edited_timestamp: string = "";

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
    md_database: "dforms"
  };
  // #endregion

  constructor() { }

  parseInstance(doc: any) {
    this._id = doc['_id'];
    this.fform_id = doc['fform_id'];
    this.mform_id = doc['mform_id'];

    this.DFields = doc['DFields'];
    this.DForms = doc['DForms'];

    this.df_created_timestamp = doc['df_created_timestamp'];
    this.df_edited_timestamp = doc['df_edited_timestamp'];

    this.seedDFieldsKeys();

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: DForm[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new DForm();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: KeyValue = {};

    doc['_id'] = this._id;
    doc['fform_id'] = this.fform_id;
    doc['mform_id'] = this.mform_id;

    doc['DFields'] = this.DFields;
    doc['DForms'] = this.DForms;

    doc['df_created_timestamp'] = this.df_created_timestamp;
    doc['df_edited_timestamp'] = new Date().toLocaleString();

    doc['_rev'] = _rev;

    return doc;
  }

  // #region Put, Remove

  putInstance(success: any, error: any) {
    // Prerequisites
    let _rev: string = "";
    this.MStatus.ms_processing = true;
    this.MStatus.ms_action_result = false;

    // Create ident
    if (this._id == "") { this._id = v1(); }

    // Connect to remote 
    let db = new PouchDB(this.MDatabase.md_database);

    // Acquire instance
    this.acquireInstance(((doc: any) => {
      _rev = doc["_rev"];
    }), null, () => {
      db.put(this.mapInstance(_rev))
        .then(res => {
          // Sync to remote
          this.syncToRemote((res: boolean) => {
            // TODO! Handle success
          });

          this.MStatus.ms_action_result = true;

          if (success) success(res);
        }).catch((err: any) => {
          if (error) error(err);
          this.MStatus.ms_action_result = false;
        }).finally(() => {
          this.MStatus.ms_processing = false;
        });
    });
  }

  removeInstance(success: any, error: any) {
    // Prerequisites
    let _rev: string = "";
    this.MStatus.ms_processing = true;

    // Connect to remote 
    let db = new PouchDB(this.MDatabase.md_database);

    // Acquire instance
    this.acquireInstance(((doc: any) => {
      _rev = doc["_rev"];
    }), null, () => {
      db.remove(this._id, _rev)
        .then(res => {
          // Sync to remote
          this.syncToRemote((response: boolean) => {
            // TODO! Handle success
          });

          success(res);
        }).catch((err) => {
          error(err);
        });
    });
  }

  // #endregion

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

    local_db.createIndex({
      index: {
        fields: ['df_edited_timestamp']
      }
    }).then((res: any) => {
      local_db.find({
        selector: {
          mform_id: this.mform_id,
          'df_edited_timestamp': { $gt: null }
        },
        sort: [{ 'df_edited_timestamp': 'asc' }]
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
    let local_db = new PouchDB(this.MDatabase.md_database);
    let remote_db = new PouchDB(config.COUCHDB_ALCHEMY + "/" + this.MDatabase.md_database);

    await local_db.replicate.to(remote_db)
      .on('complete', function () {
        on(true);
      })
      .on('error', function (err) {
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

  seedDFieldsKeys() {
    this.DFieldsKeys = [];

    Object.keys(this.DFields).forEach((key: any) => {
      this.DFieldsKeys.push(key);
    });
  }

}