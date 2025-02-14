import { Injectable } from '@angular/core';
import { KeyValue } from '../models/KeyValue.model';
import { MAwareness } from '../models/MAwareness.model';
import { User } from '../models/User.model';

@Injectable({ providedIn: 'root' })
export class AwarenessService {
  AwarenessInstance: MAwareness = new MAwareness('morlig_awareness');
  UserInstance: User = new User();
  focused: KeyValue = {};
  awake: boolean = false;
  private userDataKey = 'userData';
  private preSignUserDataKey = 'preSignInData';

  constructor() {
    let user = this.getUserData();

    if (user) {
      this.UserInstance = user as User;
      this.AwarenessInstance.focused['user'] = this.UserInstance.id;
    }
  }

  saveUser(dataKey: string, data: any): void {
    localStorage.removeItem(dataKey);
    localStorage.setItem(dataKey, JSON.stringify(data));
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
      token: AuthUser.token,
    };

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
      token: AuthUser.token,
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

  removeUserData(): void {
    localStorage.removeItem(this.userDataKey);
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

  setFocused(key: string, value: string, response: any = null) {
    this.AwarenessInstance.focused[key] = value;

    return value;
  }

  getFocused(key: string): string {
    let focused_value = '';

    Object.keys(this.AwarenessInstance.focused).forEach((seek_key) => {
      if (seek_key == key) {
        focused_value = this.AwarenessInstance.focused[seek_key];
      }
    });

    return focused_value;
  }
}
