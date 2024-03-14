import { Component, Input, OnChanges } from '@angular/core';
import { IKeysCFields, IKeysValues } from 'src/app/interfaces/IKeyValue.model';

@Component({
  selector: 'app-cfields',
  templateUrl: './cfields.component.html',
  styleUrls: [],
})

export class CFieldsComponent {

  @Input() CFields: IKeysCFields | any;

  constructor() {

  }

}