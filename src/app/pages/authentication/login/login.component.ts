import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class AppSideLoginComponent {

  hide: boolean = true;
  AuthUser: User = new User();
  UserData: User = new User();
  UserFormControls: CompositeFormControls = {};
  user_password: string = "";

  constructor(private router: Router, private awareness: AwarenessService, private communication: CommunicationService) {
  }

  ngOnInit(): void {
    this.awareness.awaken(null);

    this.UserFormControls["user_email"] = new FormControl('', [Validators.required]);
    this.UserFormControls["user_password"] = new FormControl('', [Validators.required]);
  }


  validateInstance(): boolean {
    let is_valid = true;

    // Validate required fields
    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (this.UserFormControls[fc_key].hasError("required") ||
        this.UserFormControls[fc_key].hasError("email")) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance(): void {
    if (this.validateInstance()) {
      this.AuthUser.user_password = this.user_password;
      this.AuthUser.authenticateInstance((res: any) => {
        if (res) {
          this.user_password = "";

          this.awareness.setFocused("authenticated", this.AuthUser._id, (res: any) => {
            this.awareness.UserInstance._id = this.AuthUser._id;
            this.awareness.UserInstance.acquireInstance((doc: any)=>{
                this.awareness.UserInstance.parseInstance(doc);
                // this.router.navigate(['/home']);
            }, (err: any) =>{

              }
            )

          });
          this.awareness.saveUserData(this.AuthUser);
          this.router.navigate(['/home']);
          this.communication.showSuccessToast();
        }
      }, (err: any) => {
        console.log('err', err)
        this.communication.showToast("Failed! Check your credentials and try again.");
      });
    } else {
      this.communication.showToast("Please provide username and password!");
    }
  }

}
