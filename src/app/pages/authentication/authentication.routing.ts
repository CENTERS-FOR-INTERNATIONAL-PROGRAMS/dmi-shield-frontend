import { Routes } from '@angular/router';

import { SplashComponent } from './splash/splash.component';
import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";

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
      }, {
        path: 'reset-password',
        component: ForgotPasswordComponent,
      },
    ],
  },
];
