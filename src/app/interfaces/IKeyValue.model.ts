import { CField } from "../models/CField.model";
import { FForm } from "../models/FForm.model";

export interface KeyValue {
  [key: string]: any;
}

export interface IKeyValue {
  [key: string]: any;
}

export interface IKeysValues {
  values: IKeyValue;
  keys: string[];
}

// #region {CFields}

export interface IKeyCField {
  [key: string]: CField;
}

export interface IKeysCFields {
  values: IKeyCField;
  keys: string[];
}

// #endregion

// #region FForms

export interface IKeyFForm {
  [key: string]: FForm;
}

export interface IKeysFForms {
  values: IKeyFForm;
  keys: string[];
}

// #endregion

export class IKeyArray {
  [key: string]: any[];
  ka_keys: string[] = [];

  constructor() { }

}