import { Routes } from '@angular/router';
import {CompositeComponent} from "./composite/composite.component";

export const ResourcesRoutes: Routes = [
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
      }
    ]
  }
]
