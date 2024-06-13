import {IModelFilter, IModelStatus} from "../interfaces/IModel.model";

export class Surveillance {
  _id: string = "";
  user_id: string = "";
  file_original_name: string = "";
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


  updateModifiedDate() {
    return this.modifiedDate = new Date();
  }
  constructor() {
  }



}
