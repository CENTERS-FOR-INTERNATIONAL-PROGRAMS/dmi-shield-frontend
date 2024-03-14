import { Component, OnInit } from '@angular/core';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'configurations',
  templateUrl: './configurations.component.html'
})
export class ConfigurationsComponent implements OnInit {

  constructor(private awareness: AwarenessService) { }

  ngOnInit(): void {
  }

  setFocusedMForm(ident: string) {
    this.awareness.setFocused("mform", ident);
  }
}
