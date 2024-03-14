import { Routes } from '@angular/router';

// Pages
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';

export const SyndromesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CompositeComponent,
      }, {
        path: 'composite',
        component: CompositeComponent,
      }, {
        path: 'modify',
        component: ModifyComponent,
      }
    ],
  },
];
