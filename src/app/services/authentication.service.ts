import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AwarenessService } from './awareness.service';
import { CommunicationService } from './communication.service';
import { User } from '../models/User.model';
import { ApiService } from './api/api.service';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  userRole: string;
  UserInstance: User = new User();
  private redirectUrl: string | null = null;

  constructor(
    private router: Router,
    private awareness: AwarenessService,
    private communication: CommunicationService,
    private apiService: ApiService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let route_roles: string[] = next.data['roles'];
    let user_authenticated = false;

    if (this.awareness.UserInstance == null) {
      this.awareness.UserInstance = new User();
    }

    if (this.awareness.UserInstance.id !== '') {
      route_roles.forEach((role) => {
        if (role == this.awareness.UserInstance.role) {
          user_authenticated = true;
        }
      });
    }

    if (!user_authenticated) {
      // Store the intended URL before redirecting
      this.redirectUrl = state.url;
      this.router.navigate(['/authentication/login']);
    }

    return user_authenticated;
  }

  getCurrentUserRole(): string {
    if (this.awareness.UserInstance && this.awareness.UserInstance.role) {
      return this.awareness.UserInstance.role;
    } else {
      return '';
    }
  }

  getApiCurrentUserRole(): Observable<string> {
    this.UserInstance = this.awareness.getUserData();
    if (!this.UserInstance || !this.UserInstance.id) {
      // Return an observable with "level1" as a default role
      return of('level1');
    }

    const url = `user/${this.UserInstance.id}`;

    return this.apiService.get(url).pipe(
      map((res) => res.data.attributes.role),
      tap((role) => {
        this.awareness.refreshSaveUserData(role);
        this.userRole = role;
      })
    );
  }

  navigateAfterLogin() {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
      this.redirectUrl = null;
    } else {
      this.router.navigate(['/dashboard']); // or any default route
    }
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthenticationService);
  const isAuthorized = authService.canActivate(next, state);
  const communicationService = inject(CommunicationService);
  if (!isAuthorized) {
    communicationService.showToast(
      'Sorry, you are not authorised to perform this action.'
    );
  }

  return isAuthorized;
};
