import {IModelDatabase, IModelFilter, IModelStatus} from "../interfaces/IModel.model";
import {config} from "../config/config";
import PouchDB from "pouchdb";
import plugin from "pouchdb-find";
import {IKeyValue} from "../interfaces/IKeyValue.model";

PouchDB.plugin(plugin);


export class ResourceModelApi {
  error: string | null;
  size: number;
  type: string;
  filename: string;
  state: string;
  mime: string;
  ext: string | null;
  url: string;
  updated_at: string;
  created_at: string;
  error_state: string | null;
  original_filename: string;

  constructor(error: string | null, size: number, type: string, filename: string, state: string, mime: string,
              ext: string | null, url: string, updated_at: string, created_at: string, error_state: string | null,
    original_filename: string
  ) {
    this.error = error;
    this.size = size;
    this.type = type;
    this.filename = filename;
    this.state = state;
    this.mime = mime;
    this.ext = ext;
    this.url = url;
    this.updated_at = updated_at;
    this.created_at = created_at;
    this.error_state = error_state;
    this.original_filename = original_filename;
  }
}

export class Resource {
  _id: string = "";
  user_id: string = "";
  file_original_name: string = "";
  original_filename: string = "";
  file_extension: string = "";
  file_header_status: boolean = true;
  file_data_status: boolean = true;
  file_type: string = "";
  file_url: string = "";
  validated: boolean = true;
  deleted: boolean = false;
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
    md_database: config.COUCHDB_ALCHEMY + "/resource_data"
  }

  updateModifiedDate() {
    return this.modifiedDate = new Date();
  }
  constructor() {
  }


  parseInstance(doc: any){
    this._id = doc['_id']
    this.user_id = doc['user_id']
    this.file_original_name = doc['file_original_name']
    this.file_extension = doc['file_extension']
    this.file_header_status = doc['file_header_status']
    this.file_data_status = doc['file_data_status']
    this.file_type = doc['file_type']
    this.file_url = doc['file_url']
    this.validated = doc['validated']
    this.createdDate = doc['createdDate']
    this.modifiedDate = doc['modifiedDate']
    this.deleted = doc['deleted']

    return this;
  }




}
