import { config } from "../config/config";
import PouchDB from 'pouchdb';
import { IModelDatabase, IModelFilter, IModelStatus } from "../interfaces/IModel.model";
import { v1 } from "uuid";
import plugin from "pouchdb-find";
import sha256 from 'crypto-js/sha256';
import {IKeyValue} from "../interfaces/IKeyValue.model";

PouchDB.plugin(plugin);

export class User {
  _id: string = "";
  user_name: string = "";
  user_email: string = "";
  user_password: string = "";

  user_role: any = null;

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
    md_database: config.COUCHDB_ALCHEMY + "/users"
  };
  // #endregion

  constructor() {
  }

  parseInstance(doc: any) {
    this._id = doc['_id'];
    this.user_name = doc['user_name'];
    this.user_email = doc['user_email'];
    this.user_password = doc['user_password'];
    this.user_role = doc['user_role'];

    return this;
  }

  parseComposite(rows: any) {
    let CompositeUsers: User[] = [];

    rows.forEach((row: any) => {
      let UserTemp = new User();
      CompositeUsers.push(UserTemp.parseInstance(row))
    });

    return CompositeUsers;
  }

  mapInstance(_rev: string) {
    let doc : IKeyValue = {
      "_id": this._id,
      "user_name": this.user_name,
      "user_email": this.user_email,
      "user_role": this.user_role,
      "user_password": this.user_password
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

  async authenticateInstance(success: any, error: any) {
    let local_db = new PouchDB(this.MDatabase.md_database);
    let instance = this;

    local_db.find({
      selector: {
        user_email: this.user_email,
        user_password: sha256(this.user_password + "mlg").toString()
      }
    }).then(res => {
      if (res.docs.length > 0) {
        this.parseInstance(res.docs[0]);
        this.user_password = "~";
        success(true);
      } else {
        error(false);
      }
    }).catch(err => {
      error(err);
    });
  }

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
    let Users: User[] = [];

    remote_db.createIndex({
      index: {
        fields: ['user_name']
      }
    }).then((res: any) => {
      remote_db.find({
        selector: {
          'user_name': { $regex: ".*" + this.MFilter.mf_search + ".*" }
        },
        sort: [{ 'user_name': 'asc' }]
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
