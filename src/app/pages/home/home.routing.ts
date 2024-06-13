import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";

export const HomeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
      }
    ]
  }
]
