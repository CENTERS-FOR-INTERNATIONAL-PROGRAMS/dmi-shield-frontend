import { Routes } from '@angular/router';

import { SplashComponent } from './splash/splash.component';
import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmOtpComponent } from './confirm-otp/confirm-otp.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SplashComponent,
      },
      {
        path: 'splash',
        component: SplashComponent,
      },
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'confirm-otp',
        component: ConfirmOtpComponent,
      },
      {
        path: 'confirm-account/:token',
        component: ConfirmAccountComponent,
      },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
    ],
  },
];
