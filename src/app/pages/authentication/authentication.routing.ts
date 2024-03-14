import { Routes } from '@angular/router';

import { SplashComponent } from './splash/splash.component';
import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SplashComponent,
      }, {
        path: 'splash',
        component: SplashComponent,
      }, {
        path: 'login',
        component: AppSideLoginComponent,
      }, {
        path: 'register',
        component: AppSideRegisterComponent,
      },
    ],
  },
];
