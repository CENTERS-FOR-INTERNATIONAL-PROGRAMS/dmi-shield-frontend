import { Routes } from '@angular/router';
import {DashboardsComponent} from "./dashboards.component";

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardsComponent,
      },
      {
        path: ':id',
        component: DashboardsComponent,
      }
    ]
  }
]
