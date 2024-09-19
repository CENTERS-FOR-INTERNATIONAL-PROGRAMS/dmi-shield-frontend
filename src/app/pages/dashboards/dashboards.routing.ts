import { Routes } from '@angular/router';
import {DashboardsComponent} from "./dashboards.component";
import {AuthGuard} from "../../services/authentication.service";

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
        canActivate: [AuthGuard], data: { roles: ['level2', 'admin'] },
        component: DashboardsComponent,
      }
    ]
  }
]
