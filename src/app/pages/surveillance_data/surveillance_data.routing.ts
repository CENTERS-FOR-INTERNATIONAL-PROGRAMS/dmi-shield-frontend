import { Routes } from '@angular/router';
import {CompositeComponent} from "./composite/composite.component";
import {ModifyComponent} from "./modify/modify.component";
import {AuthGuard} from "../../services/authentication.service";

export const SurveillanceDataRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
    children: [
      {
        path: '',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: CompositeComponent,
      },
      {
        path: 'composites',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: CompositeComponent,
      }, {
        path: 'modify',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        component: ModifyComponent,
      }
    ]
  }
]
