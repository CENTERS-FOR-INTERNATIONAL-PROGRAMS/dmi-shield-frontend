import { Routes } from '@angular/router';

// pages
import { AdvancedComponent } from './advanced/advanced.component';
import { SimpleComponent } from './simple/simple.component';

export const AnalyticsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'advanced',
        component: AdvancedComponent,
      },
      {
        path: 'simple',
        component: SimpleComponent,
      },
    ],
  },
];
