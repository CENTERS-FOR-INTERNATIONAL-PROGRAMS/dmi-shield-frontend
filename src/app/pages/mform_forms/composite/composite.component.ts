import { Component, OnInit } from '@angular/core';
import { FForm } from 'src/app/models/FForm.model';
import { MField } from 'src/app/models/MField.model';
import { MForm } from 'src/app/models/MForm.model';
import { Syndrome } from 'src/app/models/Syndrome.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  FocusedMForm: MForm = new MForm();
  MForms: MForm[] = [];
  FForms: FForm[] = [];

  constructor(private communication: CommunicationService, public awareness: AwarenessService) { }

  ngOnInit(): void {
    // #region Acquire focused {MForm}
    this.FocusedMForm._id = this.awareness.getFocused("mform");
    this.FocusedMForm.acquireInstance((doc: any) => {
      this.FocusedMForm.parseInstance(doc);
      this.acquireFForms();
    }, (err: any) => {
      // TODO! Handle errors
      console.error(err);
    });
    // #endregion

    // #region Acquire composite {MForms}
    let FilterMForm = new MForm();
    FilterMForm.acquireComposite((data: MForm[]) => {
      this.MForms = data;
    }, (err: any) => {
      // TODO! Handle error
      console.error(err);
    });
    // #endregion
  }

  acquireFForms() {
    let FilterFForm = new FForm();
    FilterFForm.parent_mform_id = this.FocusedMForm._id;

    FilterFForm.acquireComposite((FForms: FForm[]) => {
      this.FForms = FForms;
    }, (err: any) => {
      // TODO! Handle errors
    });
  }

  attachMForm(BlueprintMForm: MForm) {
    this.FocusedMForm.attachFForm(BlueprintMForm, (res: any) => {
      this.communication.showSuccessToast();
      this.acquireFForms();
    }, (err: any) => {
      this.communication.showFailedToast();
    });
  }

  removeSelected(fform_id: string = "") {
    let TempFForm = new FForm();
    TempFForm._id = fform_id;

    TempFForm.removeInstance((res: any) => {
      this.communication.showSuccessToast();
      this.acquireFForms();
    }, (err: any) => {
      this.communication.showFailedToast();
    });
  }
}
