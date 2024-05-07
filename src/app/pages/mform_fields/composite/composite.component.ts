import { Component, OnInit } from '@angular/core';
import { FField } from 'src/app/models/FField.model';
import { MField } from 'src/app/models/MField.model';
import { MForm } from 'src/app/models/MForm.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  FocusedMForm: MForm = new MForm();
  CompositeMFields: MField[] = [];
  CompositeFFields: FField[] = [];
  FilterMField: MField = new MField();
  FilterFField: FField = new FField();

  constructor(private communication: CommunicationService, public awareness: AwarenessService) { }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.FilterMField.syncFromRemote((res: any) => {

      });

      this.FilterFField.syncFromRemote((res: any) => {

      });

      this.FocusedMForm.syncFromRemote((res: any) => {
        // TODO! Handle success!
      });

      this.initialize();
    });
  }

  initialize() {
    // #region Acquire focused {MForm}
    this.FocusedMForm._id = this.awareness.getFocused("mform");
    this.FocusedMForm.acquireInstance((doc: any) => {
      this.FocusedMForm.parseInstance(doc);
      this.acquireFFields();
    }, (err: any) => {
      // TODO! Handle errors
      console.error(err);
    });
    // #endregion

    this.acquireMFields();
  }

  acquireMFields() {
    this.FilterMField.acquireComposite((data: MField[]) => {
      this.CompositeMFields = data;
    }, (err: any) => {
      // TODO! Handle error
      console.error(err);
    });
  }

  acquireFFields() {
    this.FilterFField.mform_id = this.FocusedMForm._id;
    this.FilterFField.acquireComposite((FFields: FField[]) => {
      this.CompositeFFields = FFields;
    }, (err: any) => {
      // TODO! Handle error
    });
  }

  attachFField(SelectedMField: any) {
    this.FocusedMForm.attachFField(SelectedMField, (res: any) => {
      this.communication.showSuccessToast();
      this.acquireFFields();
    }, (err: any) => {
      this.communication.showFailedToast();
    });
  }

  removeFField(ffield_id: string) {
    let FFieldInstance = new FField();
    FFieldInstance._id = ffield_id;
    FFieldInstance.removeInstance((res: any) => {
      this.communication.showSuccessToast();
      this.acquireFFields();
    }, (err: any) => {
      this.communication.showFailedToast();
    });
  }

  searchMFields() {
    this.acquireMFields();
  }

  searchFFields() {
    this.acquireFFields();
  }
}
