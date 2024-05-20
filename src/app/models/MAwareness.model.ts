import { config } from "../config/config";
import PouchDB from 'pouchdb';
import plugin from "pouchdb-find";
import { KeyValue } from "./KeyValue.model";
PouchDB.plugin(plugin);

export class MAwareness {
  _id: string;
  focused: KeyValue = {};

  _doc: any = null;
  _action: string = "create";
  _processing: boolean = false;
  _action_result: boolean = false;
  _database: string = "diseases";

  constructor(_id: string) {
    this._id = _id;
  }

  parseInstance(doc: any) {
    this._id = doc['_id'];
    this.focused = doc['focused'];

    return this;
  }

  mapInstance(_rev: string) {
    let doc = {
      "_id": this._id,
      "_rev": _rev,
      "focused": this.focused
    }

    return doc;
  }

  putInstance(success: any, error: any) {
    // Prerequisites
    this._processing = true;
    let _rev: string = "";

    // Connect to local
    let db = new PouchDB(this._database);

    // Acquire instance
    this.acquireInstance(((doc: any) => {
      _rev = doc["_rev"];
    }), null, () => {
      db.put(this.mapInstance(_rev))
        .then(res => {
          // Success callback
          if (success) {
            success(res);
          }
          this._action_result = true;

          // Sync to remote
          this.syncToRemote((response: boolean) => {
            // TODO! Handle success
          });
        }).catch((err) => {
          if (error) {
            error(err);
          }
        }).finally(() => {
          this._processing = false;
        });
    });
  }


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
