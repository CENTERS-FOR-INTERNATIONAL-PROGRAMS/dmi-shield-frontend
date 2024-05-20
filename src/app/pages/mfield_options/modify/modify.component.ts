import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { MField } from 'src/app/models/MField.model';
import { MFieldOption } from 'src/app/models/MFieldOption.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { v1 as uuidv4, v1 } from 'uuid';
import { CField } from 'src/app/models/CField.model';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  FocusedMField = new MField();
  FOInstance = new MFieldOption();

  constructor(private communication: CommunicationService, private awareness: AwarenessService) {

  }

  ngOnInit(): void {
    // #region Acquire focused {MField}
    this.FocusedMField._id = this.awareness.getFocused("mfield");
    this.FocusedMField.acquireInstance((doc: any) => {
      this.FocusedMField.parseInstance(doc);
    }, (error: any) => { });
    // #endregion

    // #region Seed {MFieldOption} instance
    this.FOInstance._id = this.awareness.getFocused("mfield_option");

    if (this.FOInstance._id != "") {
      this.FOInstance.acquireInstance((doc: any) => {
        this.FOInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
    // #endregion
  }

  validateInstance(): boolean {
    let is_valid = true;

    this.FOInstance.CFields.keys.forEach((key: string) => {
      if (this.FOInstance.CFields.values[key].field_form_control.hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance(): void {
    if (this.validateInstance()) {
      if (this.FocusedMField._id != "") {
        this.FOInstance.fo_field_id = this.FocusedMField._id;
        this.FOInstance.putInstance((res: any) => {
          this.communication.showSuccessToast();
        }, (err: any) => {
          this.communication.showFailedToast();
        });
      } else {
        this.communication.showFailedToast();
      }
    } else {
      this.communication.showMissingFieldsSnackbar();
    }
  }
}
