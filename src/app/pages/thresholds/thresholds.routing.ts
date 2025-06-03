import { Routes } from '@angular/router';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from '../../services/authentication.service';

export const ThresholdsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        data: { roles: ['level2', 'admin'] },
        component: CompositeComponent,
      },
      {
        path: 'composites',
        canActivate: [AuthGuard],
        data: { roles: ['level2', 'admin'] },
        component: CompositeComponent,
      },
      {
        path: 'modify',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: ModifyComponent,
      },

      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: EditComponent,
      },
    ],
  },
];
