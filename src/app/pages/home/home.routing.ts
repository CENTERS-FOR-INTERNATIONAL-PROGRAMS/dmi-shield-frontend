import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";

export const HomeRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
    children: [
      {
        path: '',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: WelcomeComponent,
      },
      {
        path: 'welcome',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: WelcomeComponent,
      }
    ]
  }
]
