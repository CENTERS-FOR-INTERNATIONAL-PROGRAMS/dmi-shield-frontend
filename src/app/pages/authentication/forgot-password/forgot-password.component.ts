import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import { ApiResponse, ConfirmResetPasswordData, ResetPasswordData} from "../../../interfaces/IAuth.model";
import {User} from "../../../models/User.model";
import {AuthService} from "../../../services/api/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AwarenessService} from "../../../services/awareness.service";
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{

  hide: boolean = true;
  UserFormControls: CompositeFormControls = {};
  AuthUser: User = new User();
  userData: ResetPasswordData;
  confirmResetPassData: ConfirmResetPasswordData;
  showConfirmReset: boolean;
  user_password: string = "";
  confirm_password: string = "";
  confirmPasswordToken: string = "";

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private awareness: AwarenessService,
              private router: Router,private communication: CommunicationService) {
  }

  ngOnInit(): void {
    this.confirmPasswordToken = this.activatedRoute.snapshot.paramMap.get('token');
    console.log("activated", this.confirmPasswordToken);
    if(this.confirmPasswordToken != ''){
      this.showConfirmReset = true;
      this.seedConfirmResetFormInstance();
    }else {
      this.seedFormInstance();
    }
  }

  ApiResponseStatus: ApiResponse = {
    error: false,
    result: null,
    processing: false,
    message: ""
  }

  seedFormInstance(){
    this.UserFormControls["user_email"] = new FormControl('', [Validators.required]);
  }

  seedConfirmResetFormInstance(){
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

    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (this.UserFormControls[fc_key].hasError("required") ||
        this.UserFormControls[fc_key].hasError("email")) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance() {
    if (this.validateInstance()){
      this.ApiResponseStatus.processing = true;

      this.userData = {
        data: {
          attributes: {
            email: this.AuthUser.user_email,
          },
          type: 'User Authentication'
        }
      };

      this.authService.postRequest('auth/user/password/request-reset', this.userData).subscribe({
        next: (res) => {
          this.ApiResponseStatus.error = true;
          this.ApiResponseStatus.message = "A password reset link has been sent to your email";
        },
        error: (error) =>{

        },
        complete: () =>{
          this.ApiResponseStatus.processing = false;
        },
      });
    }
  }

  submitConfirmResetPassword() {
    if (this.validateInstance()){
      this.ApiResponseStatus.processing = true;

      this.confirmResetPassData = {
        data: {
          attributes: {
            password: this.user_password,
            token: this.confirmPasswordToken,
          },
          type: 'User Authentication'
        }
      };

      console.log('userData', this.confirmResetPassData);
      this.authService.postRequest('auth/user/password/reset', this.confirmResetPassData).subscribe({
        next: (response) => {
          this.awareness.saveUserData(response.data.attributes.user);
          this.ApiResponseStatus.error = true;
          this.ApiResponseStatus.message = "Password reset successful";
          this.router.navigate(['/home'])
          this.communication.showToast("Password reset successful");
        },
        error: (error) =>{
          this.ApiResponseStatus.processing = false;
          this.ApiResponseStatus.error = true;
          this.ApiResponseStatus.message = "Reset link expired. Please request another one!";
        },
        complete: () =>{
          this.ApiResponseStatus.processing = false;
        },
      });
    }
  }
}
