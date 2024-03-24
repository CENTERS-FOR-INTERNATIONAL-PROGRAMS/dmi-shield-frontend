import { Injectable } from '@angular/core';
import { KeyValue } from '../models/KeyValue.model';
import { MAwareness } from '../models/MAwareness.model';
import PouchDB from 'pouchdb';
import { config } from "../config/config";
import plugin from "pouchdb-find";
import { User } from '../models/User.model';
import { MatSnackBar } from '@angular/material/snack-bar';

PouchDB.plugin(plugin);

@Injectable({ providedIn: 'root' })

export class AwarenessService {
  AwarenessInstance: MAwareness = new MAwareness("morlig_awareness");
  UserInstance: User = new User();
  focused: KeyValue = {};
  awake: boolean = false;
  private userDataKey = 'userData';

  constructor(private snackbar_instance: MatSnackBar) {

  }

  saveUser(data: any): void {
    localStorage.removeItem(this.userDataKey);
    localStorage.setItem(this.userDataKey, JSON.stringify(data));

  }

  saveUserData(AuthUser: any): void {
    const mappedUser = {
      user_name: AuthUser.user_name,
      userId: AuthUser._id,
      user_status: AuthUser.user_status,
      user_email: AuthUser.user_email,
      user_role: AuthUser.user_role,
    };

    // Save mapped user
    this.saveUser(mappedUser);
  }

  getUserData(): any | null {
    const dataString = localStorage.getItem(this.userDataKey);
    return dataString ? JSON.parse(dataString) : null;
  }

  removeUserData(): void {
    localStorage.removeItem(this.userDataKey);
  }


  async awaken(awake: any) {
    if (!this.awake) {
      this.AwarenessInstance.acquireInstance((doc: any) => {
        this.AwarenessInstance.parseInstance(doc);
        this.awake = true;

        if (awake) awake();
      }, (err: any) => {
        this.awake = true;
        if (awake) awake();
      });
    } else {
      if (awake) awake();
    }
  }

  setFocused(key: string, value: string, response: any = null) {
    this.AwarenessInstance.focused[key] = value;

    this.AwarenessInstance.putInstance((res: any) => {
      if(response) response(true);
    }, (err: any) => {
      // TODO! Handle error
    });

    return value;
  }

  getFocused(key: string): string {
    let focused_value = "";

    Object.keys(this.AwarenessInstance.focused).forEach(seek_key => {
      if (seek_key == key) {
        focused_value = this.AwarenessInstance.focused[seek_key];
      }
    });

    return focused_value;
  }

  async syncFromRemote(databases: string[]) {
    databases.forEach((database_name: string) => {
      let local_db = new PouchDB(database_name);
      let remote_db = new PouchDB(config.COUCHDB_ALCHEMY + "/" + database_name);

      remote_db.replicate.to(local_db)
        .on('complete', function () {
          // TODO! Handle success
        })
        .on('error', function (error) {
          // TODO! Handle errors
        });
    });
  }
}
