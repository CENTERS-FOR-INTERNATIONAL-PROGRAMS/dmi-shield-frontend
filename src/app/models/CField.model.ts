import { FormControl, Validators } from '@angular/forms';
import { KeyValue } from './KeyValue.model';
import {
  IKeyCField,
  IKeyValue,
  IKeysCFields,
} from '../interfaces/IKeyValue.model';

export class CField {
  field_name: string = '';
  field_label: string = '';
  field_value: any = null;
  field_required: boolean = false;
  field_type: any = {};
  field_options: any[] = [];
  field_form_control: FormControl = new FormControl();

  constructor(doc: KeyValue = {}) {
    if (doc['field_name']) {
      this.field_name = doc['field_name'];
    }

    if (doc['field_label']) {
      this.field_label = doc['field_label'];
    }

    if (doc['field_value']) {
      this.field_value = doc['field_value'];
    }

    if (doc['field_required']) {
      this.field_required = doc['field_required'];
    }

    if (doc['field_type']) {
      this.field_type = doc['field_type'];
    }

    if (doc['field_options']) {
      this.field_options = doc['field_options'];
    }

    this.seedInstance();
  }

  parseInstance(doc: any) {
    let NewCField = new CField(doc);
    NewCField.seedInstance();
    return NewCField;
  }

  parseComposite(docs: any) {
    let CFields: IKeysCFields = {
      values: {},
      keys: [],
    };

    // Seed values
    Object.keys(docs).forEach((key) => {
      CFields.values[key] = this.parseInstance(docs[key]);
    });

    // Seed keys
    CFields.keys = Object.keys(CFields.values);

    return CFields;
  }

  seedInstance() {
    if (this.field_required) {
      this.field_form_control.addValidators(Validators.required);
    }
  }

  mapInstance() {
    let doc: IKeyValue = {};

    doc['field_name'] = this.field_name;
    doc['field_label'] = this.field_label;
    doc['field_value'] = this.field_value;
    doc['field_required'] = this.field_required;
    doc['field_type'] = this.field_type;
    doc['field_options'] = this.field_options;

    return doc;
  }

  mapComposite(CFields: IKeysCFields) {
    let MappedCFields: KeyValue = {};

    CFields.keys.forEach((key: string) => {
      MappedCFields[key] = CFields.values[key].mapInstance();
    });

    return MappedCFields;
  }

  mapLegacy(mfields: IKeyValue) {
    let doc: IKeyValue = {};

    Object.keys(mfields).forEach((key: string) => {
      let NewCField = new CField(mfields[key]);
      doc[key] = NewCField.mapInstance();
    });

    return doc;
  }
}
