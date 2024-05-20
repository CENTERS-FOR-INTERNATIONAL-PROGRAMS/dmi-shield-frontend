import {IModelDatabase, IModelFilter, IModelStatus} from "../interfaces/IModel.model";
import {config} from "../config/config";
import PouchDB from "pouchdb";
import plugin from "pouchdb-find";
import {IKeyValue} from "../interfaces/IKeyValue.model";

PouchDB.plugin(plugin);

export class Thresholds {
  _id: string = "";
  county: string = "";
  sub_county: string = "";
  disease: string = "";
  cases_count: number = 0;
  deleted: boolean = false;
  created_By: string = "";
  createdDate = Date.now();
  modifiedDate: Date | null = null;

  MStatus: IModelStatus = {
    ms_processing:false,
    ms_action_result: false
  }

  MFilter: IModelFilter = {
    mf_search: "",
    mf_tag: ""
  }

  MDatabase: IModelDatabase = {
    md_database: config.COUCHDB_ALCHEMY + "/thresholds"
  }

  updateModifiedDate() {
    return this.modifiedDate = new Date();
  }
  constructor() {
  }


  parseInstance(doc: any){
    this._id = doc['_id']
    this.created_By = doc['created_By']
    this.county = doc['county']
    this.sub_county = doc['sub_county']
    this.disease = doc['disease']
    this.cases_count = doc['cases_count']
    this.createdDate = doc['createdDate']
    this.modifiedDate = doc['modifiedDate']
    this.deleted = doc['deleted']

    return this;
  }

  parseComposites(rows: any){
    let CompositeSurveillanceData :Thresholds[] = [];


    rows.forEach((row: any) => {
      let UserTemp = new Thresholds();
      CompositeSurveillanceData.push(UserTemp.parseInstance(row))
    });

    return CompositeSurveillanceData;
  }

  parseComposite(rows: any){
    let CompositeThresholds :Thresholds[] = [];

    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        let UserTemp = new Thresholds();
        CompositeThresholds.push(UserTemp.parseInstance(row));
      });
    } else {
      let UserTemp = new Thresholds();
      CompositeThresholds.push(UserTemp.parseInstance(rows));
    }

    return CompositeThresholds;
  }

  mapInstance(_rev: string){
    let doc: IKeyValue = {
      "_id": this._id,
      "county": this.county,
      "sub_county": this.sub_county,
      "disease": this.disease,
      "cases_count": this.cases_count,
      "created_By": this.created_By,
      "deleted": this.deleted,
      "createdDate": this.createdDate,
      "modifiedDate": this.modifiedDate,
    }

    if(_rev != "") {
      doc['_rev'] = _rev;
    }

    return doc;
  }

  putInstance(response: any, error: any){
    this.MStatus.ms_processing = true;
    let _rev: string = "";

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

  async acquireInstance(success: any, error: any, finished: any = null){
    let db = new PouchDB(this.MDatabase.md_database)
    db.get(this._id)
      .then(function (doc){
        success(doc)
      }).catch(function (err){
      error(err)
    }).finally(() =>{
      if (finished) finished();
    });
  }


  async acquireComposite(success: any, error: any) {
    let remote_db = new PouchDB(this.MDatabase.md_database);
    let instance = this;
    let Surveillance: Thresholds[] = [];

    remote_db.createIndex({
      index: {
        fields: ['county']
      }
    }).then((res: any) => {
      remote_db.find({
        selector: {
          'county': { $regex: ".*" + this.MFilter.mf_search + ".*" },
          'deleted': false
        },
        sort: [{ 'county': 'asc' }]
      }).then(res => {

        Surveillance = instance.parseComposite(res.docs);
        success(Surveillance);
      }).catch(err => {
        error(err);
      });
    });
  }

}
