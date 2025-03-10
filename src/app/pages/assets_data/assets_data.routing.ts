import { Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';

export const AssetsDataRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
    children: [
      {
        path: '',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: AssetsComponent,
      },
    ],
  },
];
