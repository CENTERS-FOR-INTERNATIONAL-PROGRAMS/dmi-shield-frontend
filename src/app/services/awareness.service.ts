import { Injectable } from '@angular/core';
import { KeyValue } from '../models/KeyValue.model';
import { MAwareness } from '../models/MAwareness.model';
import { User } from '../models/User.model';

@Injectable({ providedIn: 'root' })
export class AwarenessService {
  currentUser: User | undefined = null;
  focused: KeyValue = {};
  awake: boolean = false;
  private userDataKey = 'userData';
  private preSignUserDataKey = 'preSignInData';
  private authTokenKey = 'auth-token';

  constructor() {
    let user = this.getUserData();

    if (user) {
      this.currentUser = user as User;
    }
  }

  saveUser(dataKey: string, data: any): void {
    localStorage.removeItem(dataKey);
    localStorage.setItem(dataKey, JSON.stringify(data));
  }

  saveToken(token: string): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.setItem(this.authTokenKey, token);
  }

  saveUserData(AuthUser: any): void {
    const mappedUser = {
      name: AuthUser.name,
      id: AuthUser.id,
      status: AuthUser.status,
      email: AuthUser.email,
      role: AuthUser.role,
      notifications: AuthUser.notifications,
      confirmed_at: AuthUser.confirmed_at,
      updated_at: AuthUser.updated_at,
      created_at: AuthUser.created_at,
    };

    this.currentUser = mappedUser as User;
    this.saveUser(this.userDataKey, mappedUser);
  }

  savePresSignUserData(AuthUser: any): void {
    const mappedUser = {
      name: AuthUser.name,
      id: AuthUser.id,
      status: AuthUser.status,
      email: AuthUser.email,
      role: AuthUser.role,
      notifications: AuthUser.notifications,
      confirmed_at: AuthUser.confirmed_at,
      updated_at: AuthUser.updated_at,
      created_at: AuthUser.created_at,
    };

    this.removeUserDataByKey('preSignInData');
    this.saveUser('preSignInData', mappedUser);
  }

  refreshSaveUserData(userRole: string): void {
    const dataString = localStorage.getItem(this.userDataKey);
    let existingUser = JSON.parse(dataString);
    existingUser.role = userRole;
    this.saveUser(this.userDataKey, existingUser);
  }

  getUserData(): any | null {
    const dataString = localStorage.getItem(this.userDataKey);
    return dataString ? JSON.parse(dataString) : null;
  }
  getPreSignUserData(): any | null {
    const dataString = localStorage.getItem(this.preSignUserDataKey);
    return dataString ? JSON.parse(dataString) : null;
  }

  getAuthToken(): any | null {
    const dataString = localStorage.getItem(this.authTokenKey);
    return dataString ? dataString : null;
  }

  removeUserData(): void {
    localStorage.removeItem(this.userDataKey);
    localStorage.removeItem(this.authTokenKey);
    this.currentUser = null;
  }

  removeUserDataByKey(key: string): void {
    localStorage.removeItem(key);
  }

  async awaken(awake: any) {
    if (!this.awake) {
    } else {
      if (awake) awake();
    }
  }

  getToken(): string {
    const token = this.getAuthToken();
    if (token && token != '') {
      return token;
    } else {
      return '';
    }
  }
}
