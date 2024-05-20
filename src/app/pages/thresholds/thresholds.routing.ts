import { Routes } from '@angular/router';
import {CompositeComponent} from "./composite/composite.component";
import {ModifyComponent} from "./modify/modify.component";
import {AuthGuard} from "../../services/authentication.service";

export const ThresholdsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CompositeComponent,
      },
      {
        path: 'composites',
        component: CompositeComponent,
      }, {
        path: 'modify',
        canActivate: [AuthGuard], data: { roles: ['level3'] },
        component: ModifyComponent,
      }
    ]
  }
]
