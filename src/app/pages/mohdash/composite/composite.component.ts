import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss']
})
export class CompositeComponent implements OnInit{

  SummaryDashboardsFrame: any;

  constructor(private awareness: AwarenessService) {
  }

  ngOnInit() {
  }

  openSummaryDashboardsFrame(): void {
    window.open('https://afi.icapkenya.org/mohdash', '_blank');
  }
}
