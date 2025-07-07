import { Routes } from '@angular/router';

// Pages
import { CompositeComponent } from './composite/composite.component';
import { ModifyProfileComponent } from './modify_profile/modify_profile.component';
import { ModifyPasswordComponent } from './modify_password/modify_password.component';
import { ModifyRoleComponent } from './modify_role/modify_role.component';
import { UserProfileComponent } from './user_profile/user_profile.component';
import { AuthGuard } from 'src/app/services/authentication.service';

export const UsersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: CompositeComponent,
      },
      {
        canActivate: [AuthGuard],
        path: 'me/update-profile',
        component: ModifyProfileComponent,
      },
      {
        canActivate: [AuthGuard],
        path: 'me/update-password',
        component: ModifyPasswordComponent,
      },
      {
        path: ':id/update-role',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: ModifyRoleComponent,
      },
      {
        path: 'me',
        canActivate: [AuthGuard],
        component: UserProfileComponent,
      },
    ],
  },
];
