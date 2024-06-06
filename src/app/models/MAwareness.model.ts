import { config } from "../config/config";

import { KeyValue } from "./KeyValue.model";

export class MAwareness {
  _id: string;
  focused: KeyValue = {};

  _doc: any = null;
  _action: string = "create";
  _processing: boolean = false;
  _action_result: boolean = false;

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





}
