import { CommonModule } from '@angular/common';
import {Component, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
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
    RouterModule
  ],
})
export class AppDashboardComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @ViewChild('viewMoreContent') targetElement: ElementRef;

  constructor(){

  }

  scrollToTarget() {
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
}
