import { Component, OnInit } from '@angular/core';
import { MField } from 'src/app/models/MField.model';
import { MFieldOption } from 'src/app/models/MFieldOption.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  FilterFieldOption: MFieldOption = new MFieldOption();
  CompositeFieldOptions: MFieldOption[] = [];
  FocusedMField: MField = new MField();

  constructor(private communication: CommunicationService, public awareness: AwarenessService) { }

  ngOnInit(): void {
    // #region Acquire focused {MField}
    this.FocusedMField._id = this.awareness.getFocused("mfield");
    if (this.FocusedMField._id != "") {
      this.FocusedMField.acquireInstance((doc: any) => {
        this.FocusedMField.parseInstance(doc);
      }, (err: any) => {

      })
    }
    // #endregion

    // #region Synchronize from remote
    let FieldOptionFilter = new MFieldOption();
    FieldOptionFilter.syncFromRemote((res: any) => {
      // Success
      // TODO! Handle sync success

      // Failed
      // TODO! Handle sync failed

      this.loadComposite();
    });
    // #endregion
  }

  loadComposite() {
    this.FilterFieldOption.fo_field_id = this.FocusedMField._id;
    this.FilterFieldOption.acquireComposite((data: MFieldOption[]) => {
      this.CompositeFieldOptions = data;
    }, (err: any) => {
      // TODO! Handle error
    });
  }

  removeInstance(id: string) {
    let FOTemp = new MFieldOption();
    FOTemp._id = id;

    FOTemp.removeInstance((response: any) => {
      this.communication.showSuccessToast();
    }, (err: any) => {
      this.communication.showFailedToast();
    });
  }
}