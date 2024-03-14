import { Component, OnInit } from '@angular/core';
import { Disease } from 'src/app/models/Disease.model';
import { Syndrome } from 'src/app/models/Syndrome.model';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  displayedColumns = ['name', 'description', 'actions'];
  CompositeDiseases: Disease[] = [];
  FocusedSyndrome: Syndrome = new Syndrome();
  constructor(private awareness: AwarenessService) { }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.initialize();
    });
  }

  initialize() {
    // #region Acquire focused syndrome
    this.FocusedSyndrome._id = this.awareness.getFocused("syndrome");
    this.FocusedSyndrome.acquireInstance((doc: any) => {
      this.FocusedSyndrome.parseInstance(doc);
    }, (err: any) => {
      // TODO! Handle errors
      console.log(err);
    });
    // #endregion

    // #region Seed filter {Disease}
    let FilterDisease = new Disease();
    FilterDisease.syncFromRemote((response: any) => {
      // Success
      // TODO! Handle sync success

      // Failed
      // TODO! Handle sync failed

      this.loadComposite();
    });
    // #endregion
  }

  loadComposite() {
    // Seed filter {Disease}
    let FilterDisease = new Disease();
    FilterDisease.disease_syndrome_id = this.FocusedSyndrome._id;

    FilterDisease.acquireComposite((data: Disease[]) => {
      this.CompositeDiseases = data;
    }, (error: any) => {
      // TODO! Handle error
    });
  }

  setFocused(id: string = "") {
    this.awareness.setFocused("disease", id);
  }
}