import { Component, OnInit } from '@angular/core';
import { Syndrome } from 'src/app/models/Syndrome.model';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  displayedColumns = ['name', 'description', 'actions'];
  CompositeSyndromes: Syndrome[] = [];
  constructor(private awareness: AwarenessService) { }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.initialize();
    });
  }

  initialize() {
    let FilterSyndrome = new Syndrome();
    FilterSyndrome.syncFromRemote((res: any) => {
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
    let FilterSyndrome = new Syndrome();

    FilterSyndrome.acquireComposite((data: Syndrome[]) => {
      this.CompositeSyndromes = data;
    }, (error: any) => {
      // TODO! Handle error
    });
  }

  setFocused(id: string = "") {
    this.awareness.setFocused("syndrome", id);
  }
}