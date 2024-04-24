import { Routes } from '@angular/router';
import {PageComponent} from "./page/page.component";

export const AboutRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PageComponent,
      }
    ]
  }
]
