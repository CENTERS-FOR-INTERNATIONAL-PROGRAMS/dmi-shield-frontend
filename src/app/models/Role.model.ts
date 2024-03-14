import { config } from "../config/config";
import PouchDB from 'pouchdb';
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";
import { v1 } from "uuid";
import plugin from "pouchdb-find";
import sha256 from 'crypto-js/sha256';
import { IKeyValue } from "../interfaces/IKeyValue.model";

PouchDB.plugin(plugin);

export class Role {
  _id: string = "";
  role_name: string = "";
  role_rights: string[] = [];

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
    md_database: config.COUCHDB_ALCHEMY + "/roles"
  };
  // #endregion

  constructor() {
  }

  parseInstance(doc: any) {
    this._id = doc['_id'];
    this.role_name = doc['role_name'];
    this.role_rights = doc['role_rights'];

    return this;
  }

  parseComposite(rows: any) {
    let CompositeInstances: Role[] = [];

    rows.forEach((row: any) => {
      let UserTemp = new Role();
      CompositeInstances.push(UserTemp.parseInstance(row))
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: IKeyValue = {
      "_id": this._id,
      "role_name": this.role_name,
      "role_rights": this.role_rights,
    }

    if(_rev != "") {
      doc['_rev'] = _rev;
    }

    return doc;
  }

  putInstance(response: any, error: any) {
    // Prerequisites
    this.MStatus.ms_processing = true;
    let _rev: string = "";

    // Create ident
    if (this._id == "") { this._id = v1(); }

    // Connect to remote 
    let db = new PouchDB(this.MDatabase.md_database);

    this.acquireInstance((doc: any) => {
      _rev = doc["_rev"];
    }, null, () => {
      db.put(this.mapInstance(_rev))
        .then(res => {
          this.MStatus.ms_action_result = true;
          response(res);
        }).catch((err: any) => {
          error(err);
        }).finally(() => {
          this.MStatus.ms_processing = false;
        });
    });
  }

  // #region Acquire

  async acquireInstance(success: any, error: any, finished: any = null) {
    let db = new PouchDB(this.MDatabase.md_database);

    db.get(this._id)
      .then(function (doc) {
        success(doc);
      }).catch(function (err) {
        error(err);
      }).finally(() => {
        if (finished) finished();
      });
  }

  async acquireComposite(success: any, error: any) {
    let remote_db = new PouchDB(this.MDatabase.md_database);
    let instance = this;
    let Users: Role[] = [];

    remote_db.createIndex({
      index: {
        fields: ['role_name']
      }
    }).then((res: any) => {
      remote_db.find({
        selector: {
          'role_name': { $regex: ".*" + this.MFilter.mf_search + ".*" }
        },
        sort: [{ 'role_name': 'asc' }]
      }).then(res => {
        Users = instance.parseComposite(res.docs);
        success(Users);
      }).catch(err => {
        error(err);
      });
    });
  }
  // #endregion

}