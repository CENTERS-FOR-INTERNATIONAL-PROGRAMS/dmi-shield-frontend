import { Routes } from '@angular/router';
import {PageComponent} from "./page/page.component";

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PageComponent,
      },
      {
        path: ':id',
        component: PageComponent,
      }
    ]
  }
]
