import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CField } from 'src/app/models/CField.model';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { FField } from 'src/app/models/FField.model';
import { MField } from 'src/app/models/MField.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { v1 } from 'uuid';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  FocusedFField = new FField();

  constructor(public communication: CommunicationService, private awareness: AwarenessService) {

  }

  ngOnInit(): void {
    // this.seed();

    this.awareness.awaken(() => {
      this.initialize();
    });
  }

  initialize() {
    this.FocusedFField._id = this.awareness.getFocused("ffield");
    this.FocusedFField.acquireInstance((doc: any) => {
      this.FocusedFField.parseInstance(doc);
    }, (err: any) => {
      console.log("Err", err);
      // TODO! Handle errors
    });
  }

  validateInstance(): boolean {
    let is_valid = true;

    this.FocusedFField.CFields.keys.forEach(key => {
      if (this.FocusedFField.CFields.values[key].field_form_control.hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  };

  submitInstance(): void {
    if (this.validateInstance()) {
      this.FocusedFField.putInstance((res: any) => {
        this.communication.showSuccessToast();
      }, (err: any) => {
        this.communication.showFailedToast();
      });
    } else {
      this.communication.showMissingFieldsSnackbar();
    }
  }
}