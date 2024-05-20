import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MdbCarouselComponent} from "mdb-angular-ui-kit/carousel";
import {config} from "../../../config/config";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss']
})
export class CompositeComponent implements OnInit{

  @ViewChild('myIframe') myIframe!: ElementRef;
  private sanitizer = inject(DomSanitizer);
  SummaryDashboardsFrame: SafeResourceUrl;

  @ViewChild('carousel', {static: false}) carousel: any;
  constructor(private awareness: AwarenessService) {
    config.SUMMARIZED_IFRAME_SOURCES.forEach(item => {
      item.source = <string>this.sanitizer.bypassSecurityTrustResourceUrl(item.source);
    });
  }

  ngOnInit() {
  }


  nextSlide() {
    this.carousel.next();
  }

  previousSlide() {
    this.carousel.prev();
  }

  protected readonly config = config;
}
