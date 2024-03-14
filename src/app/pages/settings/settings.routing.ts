import { Routes } from '@angular/router';


// pages
import { ConfigurationsComponent } from './configurations/configurations.component';

export const SettingsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'configurations',
        component: ConfigurationsComponent,
      }
    ],
  },
];
