import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { MForm } from 'src/app/models/MForm.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { FField } from 'src/app/models/FField.model';
import { FForm } from 'src/app/models/FForm.model';
import { KeyValue } from 'src/app/models/KeyValue.model';
import { DForm } from 'src/app/models/DForm.model';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  FocusedMForm = new MForm();

  constructor(private communication: CommunicationService, private awareness: AwarenessService) { }

  ngOnInit(): void {
    // #region Acquire Focused {MForm}
    this.FocusedMForm._id = this.awareness.getFocused("mform");
    this.FocusedMForm.acquireInstance((doc: any) => {
      this.FocusedMForm.parseInstance(doc);

      // Seed with DATA
      this.FocusedMForm.DFormInstance._id = this.awareness.getFocused("dform");

      if (this.FocusedMForm.DFormInstance._id != "") {
        this.FocusedMForm.DFormInstance.acquireInstance((doc: any) => {
          this.FocusedMForm.DFormInstance.parseInstance(doc);

          this.FocusedMForm.acquireFFields(() => {
            // Acquire {FForms}
            this.FocusedMForm.acquireFForms(() => {
              this.FocusedMForm.mapDForm();
            }, (err: any) => {
              // TODO! Handle errors
            }, false);
          }, (err: any) => {
            // TODO! Handle errors
          });
        }, (err: any) => {
          // TODO! Handle errors
        });
      }

      // Seed EMPTY
      else {
        this.FocusedMForm.acquireFFields(() => {
          // Acquire {FForms}
          this.FocusedMForm.acquireFForms(() => {
            // TODO! Handle success
          }, (err: any) => {
            // TODO! Handle errors
          });
        }, (err: any) => {
          // TODO! Handle errors
        });
      }
    }, (err: any) => {
      // TODO! Handle errors
    });
    // #endregion
  }

  addFFormGroup(TargetFForm: FForm) {
    TargetFForm.cloneInstance((CloneFForm: FForm) => {
      this.FocusedMForm.FForms[TargetFForm._id].push(CloneFForm);
    }, (err: any) => {
      // TODO! Handle errors
    });
  }

  removeFFormGroup(fform_id: string, position: number) {
    this.FocusedMForm.FForms[fform_id].splice(position, 1);
  }

  submitInstance(): void {
    // Prerequisites
    let mform_validate = true;

    // #region Validate {FField}s
    this.FocusedMForm.FFields.forEach((SeekFField: FField) => {
      if (SeekFField.FormControlInstance.hasError("required")) {
        mform_validate = false;
      }
    });
    // #endregion

    // #region Validate {FForm}s
    Object.keys(this.FocusedMForm.FForms).forEach((key: any) => {
      this.FocusedMForm.FForms[key].forEach((SeekFForm: FForm) => {
        if (!SeekFForm.validateInstance()) {
          mform_validate = false;
        }
      });
    });
    // #endregion

    if (mform_validate) {
      this.FocusedMForm.compileDForm();

      this.FocusedMForm.DFormInstance.putInstance((res: any) => {
        this.communication.showSuccessToast();
      }, (err: any) => {
        this.communication.showFailedToast();
      });
    } else {
      this.communication.showFailedToast();
    }
  }
}