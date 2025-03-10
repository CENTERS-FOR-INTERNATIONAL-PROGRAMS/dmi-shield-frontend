import { Routes } from '@angular/router';
import { CompositeComponent } from './composite/composite.component';

export const NotificationsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CompositeComponent,
      },
    ],
  },
];
