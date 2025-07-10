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
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  userRole: string;
  currentUser: User = new User();
  private redirectUrl: string | null = null;

  constructor(
    private router: Router,
    private awareness: AwarenessService,
    private apiService: ApiService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): [boolean, boolean] {
    let route_roles: string[] = next.data['roles'];
    let user_authenticated = false;
    let user_confirmed = false;
    this.redirectUrl = state.url;

    if (
      this.awareness.currentUser &&
      this.awareness.currentUser?.id !== '' &&
      this.awareness.currentUser?.confirmed_at != null
    ) {
      route_roles.forEach((role) => {
        if (role == this.awareness.currentUser.role) {
          user_authenticated = true;
        }
      });

      user_confirmed = true;
    }

    if (
      this.awareness.currentUser &&
      this.awareness.currentUser?.id !== '' &&
      this.awareness.currentUser?.confirmed_at == null
    ) {
      if (state.url != '/users/me') {
        this.router.navigate(['/users/me']);
      } else {
        user_confirmed = true;
      }
      user_authenticated = true;
    }

    return [user_authenticated, user_confirmed];
  }

  getCurrentUserRole(): string {
    if (this.awareness.currentUser && this.awareness.currentUser.role) {
      return this.awareness.currentUser.role;
    } else {
      return '';
    }
  }

  getApiCurrentUserRole(): Observable<string | null> {
    this.currentUser = this.awareness.getUserData();
    if (!this.currentUser || !this.currentUser.id) {
      // Return an observable with "level1" as a default role
      // return of('level1');
      return new Observable((observer) => {
        observer.next(null);
      });
    }

    const url = `user/${this.currentUser.id}`;

    return this.apiService.get(url).pipe(
      map((res) => res.data.attributes.role),
      tap((role) => {
        this.awareness.refreshSaveUserData(role);
        this.userRole = role;
      }),
    );
  }

  navigateAfterLogin() {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
      this.redirectUrl = null;
    } else {
      this.router.navigate(['/home']); // or any default route
    }
  }

  signOut() {
    const userToken = this.awareness.getUserData().token;

    if (userToken != '' && userToken != null) {
      let payload = {
        data: {
          attributes: {
            token: userToken,
          },
          type: 'User Authentication',
        },
      };

      this.apiService.postRequest('auth/user/sign-out', payload).subscribe({
        next: () => {},
        error: () => {},
        complete: () => {},
      });
    }
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  const authService = inject(AuthenticationService);
  const awarenessService = inject(AwarenessService);
  const router = inject(Router);
  const [isAuthorized, isConfirmed] = authService.canActivate(next, state);
  const token = awarenessService.getToken();

  const communicationService = inject(CommunicationService);
  if (!isAuthorized) {
    if (token == '') {
      communicationService.showToast(
        'Sorry, you are not authorised to perform this action. Please sign in again',
      );
      router.navigate(['/authentication/login']);
    } else {
      communicationService.showToast(
        'Sorry, you are not authorised to perform this action.',
      );
    }
  }

  if (isAuthorized && isConfirmed == false) {
    communicationService.showToast(
      'Sorry, you are not authorised to perform this action. Please request an account confirmation email on your account profile page.',
    );
  }

  return isAuthorized;
};
