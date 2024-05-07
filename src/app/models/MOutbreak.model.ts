import { KeyValue } from "./KeyValue.model";
import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { CField } from "./CField.model";

PouchDB.plugin(plugin);

export class MOutbreak {
  _id: string = "";
  mfields: KeyValue = {};
  _doc: any = null;
  _action: string = "create";
  _processing: boolean = false;
  _action_result: boolean = false;
  _database: string = "moutbreaks";

  constructor() {
    this.seedInstance();
  }

  seedInstance() {
    this.mfields["outbreak_syndrome"] = new CField({
      field_name: "outbreak_syndrome",
      field_label: "Syndrome",
      field_value: "",
      field_type: {
        value: 'select_one'
      }
    });

    this.mfields["outbreak_disease"] = new CField({
      field_name: "outbreak_disease",
      field_label: "Disease",
      field_value: "",
      field_type: {
        value: 'select_one'
      }
    });

    this.mfields["outbreak_onset_date"] = new CField({
      field_name: "outbreak_onset_date",
      field_label: "Date of Onset",
      field_value: "",
      field_type: {
        value: 'date'
      }
    });
  }

  parseInstance(doc: any) {
    this._id = doc['_id'];
    this.mfields = doc['mfields'];

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: MOutbreak[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new MOutbreak();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: KeyValue = {};

    doc['_id'] = this._id;
    doc['mfields'] = this.mfields;
    doc['_rev'] = _rev;

    return doc;
  }

  putInstance() {
    // Prerequisites
    this._processing = true;
    let _rev: string = "";

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
        }).catch((err: any) => {
          // TODO! Handle errors
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
    let db = new PouchDB(this._database);

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
    let local_db = new PouchDB(this._database);
    let instance = this;

    local_db.find({
      selector: { ff_mform_id: this.mfields['ff_mform_id'] }
    }).then(res => {
      success(instance.parseComposite(res.docs));
    }).catch(err => {
      error(err);
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
}
