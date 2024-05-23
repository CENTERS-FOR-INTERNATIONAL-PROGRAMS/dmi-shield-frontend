import { CField } from "../models/CField.model";

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

export class IKeyArray {
  [key: string]: any[];
  ka_keys: string[] = [];

  constructor() { }

}
