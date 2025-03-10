import { KeyValue } from './KeyValue.model';

export class DField {
  df_ffield_id: string = '';
  df_label: string = '';
  df_name: string = '';
  df_value: any = null;

  constructor() {}

  parseInstance(doc: any) {
    this.df_ffield_id = doc['df_ffield_id'];
    this.df_label = doc['df_label'];
    this.df_name = doc['df_name'];
    this.df_value = doc['df_value'];

    return this;
  }

  parseComposite(docs: any) {
    let CompositeInstances: DField[] = [];

    docs.forEach((doc: any) => {
      let TempInstance = new DField();
      CompositeInstances.push(TempInstance.parseInstance(doc));
    });

    return CompositeInstances;
  }

  mapInstance(_rev: string) {
    let doc: KeyValue = {};

    doc['df_ffield_id'] = this.df_ffield_id;
    doc['df_label'] = this.df_label;
    doc['df_name'] = this.df_name;
    doc['df_value'] = this.df_value;

    return doc;
  }
}
