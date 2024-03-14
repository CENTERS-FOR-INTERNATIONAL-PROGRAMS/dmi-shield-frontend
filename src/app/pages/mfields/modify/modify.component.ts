import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CField } from 'src/app/models/CField.model';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { MField } from 'src/app/models/MField.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { v1 } from 'uuid';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  MFieldInstance = new MField();

  constructor(private communication: CommunicationService, private awareness: AwarenessService) {

  }

  ngOnInit(): void {
    this.MFieldInstance._id = this.awareness.getFocused("mfield");

    if (this.MFieldInstance._id != "") {
      this.MFieldInstance.acquireInstance((doc: any) => {
        this.MFieldInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }

  validateInstance(): boolean {
    let is_valid = true;

    this.MFieldInstance.CFields.keys.forEach(key => {
      if (this.MFieldInstance.CFields.values[key].field_form_control.hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  };

  submitInstance(): void {
    if (this.validateInstance()) {
      this.MFieldInstance.putInstance();
      this.communication.showSuccessToast();
    } else {
      this.communication.showMissingFieldsSnackbar();
    }
  }
}