import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CField } from 'src/app/models/CField.model';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { MForm } from 'src/app/models/MForm.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  MFormInstance: MForm = new MForm();
  MFormFC: CompositeFormControls = {};
  CompositeMFieldKeys: string[] = [];

  constructor(private communication: CommunicationService, private awareness: AwarenessService) { }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.initialize();
    });
  }

  initialize() {
    this.MFormInstance._id = this.awareness.getFocused("mform");

    if (this.MFormInstance._id != "") {
      this.MFormInstance.acquireInstance((doc: any) => {
        this.MFormInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
        console.error(err);
      });
    }
  }

  validateInstance(): boolean {
    let is_valid = true;

    this.MFormInstance.CFields.keys.forEach((key: string) => {
      if (this.MFormInstance.CFields.values[key].field_form_control.hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance(): void {
    if (this.validateInstance()) {
      this.MFormInstance.putInstance((res: any) => {
        this.communication.showSuccessToast();
      }, (err: any) => {
        this.communication.showFailedToast();
      });
    } else {
      this.communication.showMissingFieldsSnackbar();
    }
  }

}
