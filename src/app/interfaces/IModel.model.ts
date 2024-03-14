export interface IModelStatus {
  ms_processing: boolean;
  ms_action_result: boolean;
}

export interface IModelFilter {
  mf_search: string;
  mf_tag: string;
}

export interface IModelDatabase {
  md_database: string;
}