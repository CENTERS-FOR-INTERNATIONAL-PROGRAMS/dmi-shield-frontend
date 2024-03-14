import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
PouchDB.plugin(plugin);

export class Disease {
  _id: string = "";
  disease_syndrome_id: string = "";
  disease_name: string = "";
  disease_description: string = "";

  _doc: any = null;
  _action: string = "create";
  _processing: boolean = false;
  _action_result: boolean = false;
  _database: string = "diseases";

  constructor() {
  }

  parseInstance(doc: any) {
    this._id = doc['_id'];
    this.disease_syndrome_id = doc['disease_syndrome_id'];
    this.disease_name = doc['disease_name'];
    this.disease_description = doc['disease_description'];

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: Disease[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new Disease();
      CompositeInstances.push(TempInstance.parseInstance(doc))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc = {
      "_id": this._id,
      "_rev": _rev,
      "disease_syndrome_id": this.disease_syndrome_id,
      "disease_name": this.disease_name,
      "disease_description": this.disease_description
    }

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
        .then(response => {
          this._action_result = true;

          // Sync to remote
          this.syncToRemote((response: boolean) => {
            // TODO! Handle success
          });
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
      selector: { disease_syndrome_id: this.disease_syndrome_id }
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