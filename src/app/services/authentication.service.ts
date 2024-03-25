import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AwarenessService } from './awareness.service';
import { CommunicationService } from './communication.service';
import {User} from "../models/User.model";

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    constructor(private router: Router, private awareness: AwarenessService, private communication: CommunicationService) {

    }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let route_roles: string[] = next.data['roles'];
    let user_authenticated = false;


    if(this.awareness.UserInstance == null){
      this.awareness.UserInstance = new User();
    }
    if (this.awareness.UserInstance._id !== '') {

      route_roles.forEach(role => {
        if (role == this.awareness.UserInstance.user_role) {
          user_authenticated = true;
        }
      });
    }

    if (!user_authenticated) {
      this.router.navigate(['/authentication/login']);
    }

    return user_authenticated;
  }

}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(AuthenticationService).canActivate(next, state);
}
