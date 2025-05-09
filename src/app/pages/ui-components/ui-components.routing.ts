import { Routes } from '@angular/router';

import { AppTooltipsComponent } from './tooltips/tooltips.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
    ],
  },
];
