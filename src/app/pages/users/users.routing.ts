import { Routes } from '@angular/router';

// Pages
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';
import { ModifyPasswordComponent } from './modify_password/modify_password.component';
import { ModifyRoleComponent } from './modify_role/modify_role.component';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from 'src/app/services/authentication.service';

export const UsersRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
    children: [
      {
        path: '',
        canActivate: [AuthGuard], data: { roles: [1, 2] },
        component: CompositeComponent,
      }, {
        path: 'composite',
        canActivate: [AuthGuard], data: { roles: [1, 2] },
        component: CompositeComponent,
      }, {
        path: 'modify',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: ModifyComponent,
      }, {
        path: 'modify_password',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: ModifyPasswordComponent
      }, {
        path: 'modify_role',
        canActivate: [AuthGuard], data: { roles: [1] },
        component: ModifyRoleComponent
      }, {
        path: 'view',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: ViewComponent,
      }
    ]
  }
];
