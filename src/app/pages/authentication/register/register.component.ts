import {Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {User} from "../../../models/User.model";
import {CommunicationService} from "../../../services/communication.service";
import {AuthService} from "../../../services/api/auth.service";
import {ApiResponse, UserRegisterData} from "../../../interfaces/IAuth.model";
import {AwarenessService} from "../../../services/awareness.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class AppSideRegisterComponent implements OnInit{

  hide: boolean = true;
  UserInstance: User = new User();
  UserFormControls: CompositeFormControls = {};
  userData: UserRegisterData;
  constructor(private router: Router, private communication: CommunicationService,
              public authService: AuthService, private awareness: AwarenessService) { }


  ngOnInit(): void {
    this.seedFormInstance();
  }

  ApiResponseStatus: ApiResponse = {
    error: false,
    result: null,
    processing: false,
    message: ""
  }

  seedFormInstance(){
    this.UserFormControls["user_name"] = new FormControl('', [Validators.required]);
    this.UserFormControls["user_email"] = new FormControl('', [Validators.required, Validators.email]);
    this.UserFormControls["user_password"] = new FormControl('', [Validators.required]);
    this.UserFormControls["confirm_password"] = new FormControl('', [Validators.required, this.confirmPasswordValidator.bind(this)]);
  }

  confirmPasswordValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value !== this.UserFormControls['user_password'].value) {
      return { 'passwordMismatch': true };
    }
    return null;
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
      this.registerUser();
    }
  }


  registerUser(){
    this.ApiResponseStatus.processing = true;

    this.userData = {
      data: {
        attributes: {
          email: this.UserFormControls["user_email"].value,
          name : this.UserFormControls["user_name"].value,
          password: this.UserFormControls["user_password"].value
        },
        type: 'User Authentication'
      }
    };

    this.authService.postRequest('auth/user/password/register', this.userData).subscribe(
      (response) => {
        if (response.data.attributes.user && response.data.attributes.token) {
          response.data.attributes.user.token = response.data.attributes.token;
          this.awareness.saveUserData(response.data.attributes.user);
          this.ApiResponseStatus.processing = false;
          this.router.navigate(['/home'])
        } else if(response.errors[0].detail) {
          this.ApiResponseStatus.processing = false;
          throw new Error(response.errors[0].detail);
        }
      },
      (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.error = true;
        if (error.error.errors && error.error.errors.length > 0) {
          this.ApiResponseStatus.error = true;
          this.ApiResponseStatus.message = error.error.errors[0].detail;

        }
      }
    );
  }
}
