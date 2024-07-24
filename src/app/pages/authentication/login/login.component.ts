import {Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';
import {AuthService} from "../../../services/api/auth.service";
import {ApiResponse, UserAuthenticationData} from "../../../interfaces/IAuth.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class AppSideLoginComponent implements OnInit{

  hide: boolean = true;
  AuthUser: User = new User();
  UserFormControls: CompositeFormControls = {};
  userData: UserAuthenticationData;
  wrong_cred_error: boolean;

  constructor(private router: Router, private awareness: AwarenessService,
              private communication: CommunicationService, public authService: AuthService) {
  }

  ApiResponseStatus: ApiResponse = {
    error: false,
    result: null,
    processing: false,
    message: ""
  }

  ngOnInit(): void {

    const userDataStr = this.awareness.getUserData();
    if (userDataStr) {
      this.router.navigate(['/home']);
    }
    this.awareness.awaken(null);
    this.seedForm();

  }

  seedForm(){
    this.UserFormControls["user_email"] = new FormControl('', [Validators.required]);
    this.UserFormControls["user_password"] = new FormControl('', [Validators.required]);
  }

  validateInstance(): boolean {
    let is_valid = true;

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
      this.loginUser();
    } else {
      this.communication.showToast("Please provide username and password!");
    }
  }

  loginUser(){
    this.ApiResponseStatus.processing = true;

    this.userData = {
      data: {
        attributes: {
          email: this.UserFormControls["user_email"].value,
          password: this.UserFormControls["user_password"].value
        },
        type: 'User Authentication'
      }
    };
    this.authService.postRequest('auth/user/2fa/password/sign-in', this.userData).subscribe(
      (response) => {
        if (response && response.data && response.data.attributes && response.data.attributes.user && response.data.attributes.token) {
          response.data.attributes.user.token = response.data.attributes.token;
          // this.awareness.saveUserData(response.data.attributes.user);
          this.ApiResponseStatus.processing = false;
          // this.router.navigate(['/home'])
          this.router.navigate(['/authentication/confirm-otp'])
        } else {
          this.ApiResponseStatus.processing = false;
          throw new Error('User data not found in response');
        }
      },
      (error) => {
        this.ApiResponseStatus.processing = false;
        console.error('POST Error:', error);
        this.wrong_cred_error = true;
        // this.communication.showToast("Please provide username and password!");
      }
    );
  }

}


