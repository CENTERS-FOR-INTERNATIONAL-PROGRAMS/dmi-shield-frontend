import { Component, ElementRef, OnInit } from '@angular/core';
import { AwarenessService } from 'src/app/services/awareness.service';
import { SupersetService } from 'src/app/services/superset.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})

export class DashboardsComponent implements OnInit {

  constructor(
    private superset: SupersetService,
    private elementRef: ElementRef,
    public communication: CommunicationService,
    public awareness: AwarenessService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let dashboardId = params['id'];
      this.embedSupersetDashboard(dashboardId);
    });
  }

  embedSupersetDashboard(dashboardId): void {
    const dashboardElement = this.elementRef.nativeElement.querySelector('#dashboard');
    if (dashboardElement) {
      if (dashboardId) {
        this.superset.embedDashboard(document.getElementById('dashboard'), dashboardId).subscribe(
          () => {
            const iframe = dashboardElement.querySelector('iframe');
            if (iframe) {
              iframe.class = 'view-embedded--dashboard'
              iframe.style['border-radius'] = '20px';
              iframe.style.border = 'none';
              iframe.style.width = '100%';
              iframe.style.height = '1000px';
            }
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.communication.showFailedToast();
      }
    }
  }
}