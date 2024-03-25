import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss']
})
export class CompositeComponent implements OnInit{

  @ViewChild('myIframe') myIframe!: ElementRef;

  private sanitizer = inject(DomSanitizer);

  SummaryDashboardsFrame: any;

  constructor(private awareness: AwarenessService) {
    this.SummaryDashboardsFrame = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://afi.icapkenya.org/mohdash'
    );
  }

  ngOnInit() {
  }

  openSummaryDashboardsFrame(): void {
    window.open('https://afi.icapkenya.org/mohdash', '_blank');
  }
}
