import { Component, Input, OnChanges } from '@angular/core';
import { FField } from 'src/app/models/FField.model';
import { KeyValue } from 'src/app/models/KeyValue.model';

@Component({
  selector: 'app-ffields',
  templateUrl: './ffields.component.html',
  styleUrls: [],
})
export class FFieldsComponent {
  @Input() FFields: FField[] | any;
  initialized: boolean = false;

  constructor() {}

  initializeLogic(FocusedFField: FField) {
    if (FocusedFField._evaluated < 2) {
      if (!this.initialized) {
        FocusedFField._evaluated = FocusedFField._evaluated + 1;
        this.evaluateLogic();
      }
    }
  }

  evaluateLogic() {
    let DFields: KeyValue = {};

    this.FFields.forEach((SeekFField: FField) => {
      DFields[SeekFField.DFieldInstance.df_name] =
        SeekFField.DFieldInstance.df_value;

      SeekFField.MCodeLogic.evaluateInstance('evaluateBoolean', DFields);
      SeekFField.MCodeOptionsTag.evaluateInstance(
        'evaluateString',
        DFields
      ).then((res: any) => {
        SeekFField.acquireFieldOptions();
      });
    });
  }
}
