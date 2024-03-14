import { Component, OnInit } from '@angular/core';
import { MForm } from 'src/app/models/MForm.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  FilterMForm: MForm = new MForm();
  CompositeMForms: MForm[] = [];

  constructor(private communication: CommunicationService, public awareness: AwarenessService) { }

  ngOnInit(): void {
    // #region Sync from remote
    let FilterMForm = new MForm();
    FilterMForm.syncFromRemote((res: boolean) => {
      // Success
      if (res) {
        // TODO! Handle sync success
      }

      // Failed
      else {
        // TODO! Handle sync failed
      }

      this.loadComposite();
    });
    // #endregion
  }

  loadComposite() {
    this.FilterMForm.acquireComposite((data: MForm[]) => {
      this.CompositeMForms = data;
    }, (err: any) => {
      // TODO! Handle error
    });
  }

  removeInstance(mform_id: string) {
    let SeekMForm = new MForm();
    SeekMForm._id = mform_id;

    SeekMForm.removeInstance((res: any) => {
      this.communication.showSuccessToast();
      this.loadComposite();
    }, (err: any) => {
      this.communication.showFailedToast();
    });
  }
}