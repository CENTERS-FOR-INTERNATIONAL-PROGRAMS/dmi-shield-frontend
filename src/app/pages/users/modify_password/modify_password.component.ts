import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';
import sha256 from 'crypto-js/sha256';

@Component({
  selector: 'modify_password',
  templateUrl: './modify_password.component.html'
})

export class ModifyPasswordComponent implements OnInit {
  UserInstance = new User();
  UserFormControls: CompositeFormControls = {};
  hide_password = true;
  user_password = "";
  user_password_confirm = "";
  user_password_matched: boolean = false;

  constructor(private location: Location, private awareness: AwarenessService, private communication: CommunicationService) {

  }

  ngOnInit(): void {
    this.seedInstance();

    this.awareness.awaken(() => {
      this.UserInstance._id = this.awareness.getFocused("user");

      if (this.UserInstance._id != "") {
        this.UserInstance.acquireInstance((doc: any) => {
          this.UserInstance.parseInstance(doc);
        }, (err: any) => {
          // TODO! Handle errors
        });
      }
    });
  }

  seedInstance() {
    this.UserFormControls["user_password"] = new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]);
    this.UserFormControls["user_password_confirm"] = new FormControl('', [Validators.required]);
  }

  submitInstance(): void {
    let is_valid = true;

    // Validate required fields
    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (!this.UserFormControls[fc_key].valid) {
        is_valid = false;
        return;
      }
    });

    // Validate password
    if (this.user_password == this.user_password_confirm) {
      this.user_password_matched = true;
    } else {
      is_valid = false;
      this.UserFormControls['user_password_confirm'].setErrors(Validators.required);
      this.user_password_matched = false;
    }

    if (is_valid && this.user_password_matched) {
      this.UserInstance.user_password = sha256(this.user_password + "mlg").toString()

      // this.UserInstance.putInstance((res: any) => {
      //   this.UserInstance.user_password = "~";
      //   this.location.back();
      //   this.communication.showSuccessToast();
      // }, (err: any) => {
      //   this.communication.showFailedToast();
      // });
    } else {
      this.communication.showToast("Kindly fill in all required fields!");
    }
  }
}
