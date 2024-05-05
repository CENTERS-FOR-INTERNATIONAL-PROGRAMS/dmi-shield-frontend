import { Component, OnInit } from '@angular/core';
import { MField } from 'src/app/models/MField.model';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  displayedColumns = ['field_label', 'field_type', 'field_tags', 'field_actions'];
  FilterMField: MField = new MField();
  CompositeMFields: MField[] = [];
  constructor(public awareness: AwarenessService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    let MFieldFilter = new MField();

    MFieldFilter.syncFromRemote((res: any) => {
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
  }

  loadComposite() {
    this.FilterMField.acquireComposite((data: MField[]) => {
      this.CompositeMFields = data;
    }, (err: any) => {
      // TODO! Handle error
      console.error(err);
    });
  }

  removeInstance(_id: string) {
    let SeekMField = new MField();
    SeekMField._id = _id;

    SeekMField.removeInstance((res: any) => {
      // TODO! Handle success
      this.loadComposite();
    }, (err: any) => {
      // TODO! Handle Errors
    });
  }

}
