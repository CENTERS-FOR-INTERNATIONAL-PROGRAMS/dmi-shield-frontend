import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';

export const SupportRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PageComponent,
      },
    ],
  },
];
