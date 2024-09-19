import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, ViewEncapsulation, ViewChild, ElementRef, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import {RouterModule} from "@angular/router";
import {AwarenessService} from "../../services/awareness.service";
import {config} from '../../config/config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    NgApexchartsModule,
    MatTableModule,
    CommonModule,
    RouterModule,
    NgOptimizedImage
  ],
})
export class AppDashboardComponent implements OnInit{
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @ViewChild('viewMoreContent') targetElement: ElementRef;
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  activeCardIndex = 0;
  dashboards: string[];

  constructor(public awareness: AwarenessService){

  }

  ngOnInit() {
    this.dashboards = config.SUPERSET.DASHBOARDS;
  }

  scrollToTarget() {
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }

  scrollToViewMore() {
    // Get a reference to the viewMoreContent element
    const viewMoreContent = document.querySelector('#cards');

    // Check if the element exists
    if (viewMoreContent) {
      // Scroll to the viewMoreContent element
      viewMoreContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  scrollLeft() {
    this.cardContainer.nativeElement.scrollLeft -= 360;
  }

  scrollRight() {
    this.cardContainer.nativeElement.scrollLeft += 360;
  }

  scrollToCard(index: number) {
    if (this.cardContainer && this.cardContainer.nativeElement) {
      const cardWidth = this.cardContainer.nativeElement.offsetWidth;
      this.cardContainer.nativeElement.scrollLeft = index * cardWidth;
      this.activeCardIndex = index;
    }
  }

}
