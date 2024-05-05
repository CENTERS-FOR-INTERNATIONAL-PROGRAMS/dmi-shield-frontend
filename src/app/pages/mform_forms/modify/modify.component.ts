import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CField } from 'src/app/models/CField.model';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { FForm } from 'src/app/models/FForm.model';
import { MForm } from 'src/app/models/MForm.model';
import { Syndrome } from 'src/app/models/Syndrome.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  FFormInstance: FForm = new FForm();

  constructor(private communication: CommunicationService, private awareness: AwarenessService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.FFormInstance._id = this.awareness.getFocused("fform");

    if (this.FFormInstance._id != "") {
      this.FFormInstance.acquireInstance((doc: any) => {
        this.FFormInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }

  validateInstance(): boolean {
    let is_valid = true;

    this.FFormInstance.CFields.keys.forEach((key: string) => {
      if (this.FFormInstance.CFields.values[key].field_form_control.hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance(): void {
    if (this.validateInstance()) {
      this.FFormInstance.putInstance((res: any) => {
        this.communication.showSuccessToast()
      }, (err: any) => {
        this.communication.showFailedToast();
      });
    } else {
      this.communication.showMissingFieldsSnackbar();
    }
  }
}
