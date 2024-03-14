import { Component, OnInit } from '@angular/core';
import { DField } from 'src/app/models/DField.model';
import { DForm } from 'src/app/models/DForm.model';
import { MForm } from 'src/app/models/MForm.model';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  FocusedMForm: MForm = new MForm();
  FilterDForm: DForm = new DForm();
  DForms: DForm[] = [];

  constructor(public awareness: AwarenessService) { }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.initialize();
    });
  }

  initialize() {
    // #region Acquire focused {MForm}
    this.FocusedMForm._id = this.awareness.getFocused("mform");
    this.FocusedMForm.acquireInstance((doc: any) => {
      this.FocusedMForm.parseInstance(doc);
      this.loadComposite();
    }, (err: any) => {
      // TODO! Handle errors
    });
    // #endregion
  }

  removeInstance(_id: string) {
    let SeekDForm = new DForm();
    SeekDForm._id = _id;

    SeekDForm.removeInstance((res: any) => {
      console.log("Removed", res);
      // TODO! Handle success
      this.loadComposite();
    }, (err: any) => {
      // TODO! Handle Errors
    });
  }

  loadComposite() {
    this.FilterDForm.mform_id = this.FocusedMForm._id;

    this.FilterDForm.acquireComposite((DForms: DForm[]) => {
      this.DForms = DForms;
    }, (err: any) => {
      console.log("Error", err);
      // TODO! Handle errors
    });
  }

}