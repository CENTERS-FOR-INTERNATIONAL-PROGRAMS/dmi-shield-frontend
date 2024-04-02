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

  constructor(private authService: AuthService, private awareness: AwarenessService,
              private router: Router,private communication: CommunicationService) {
  }

  ngOnInit(): void {
    const hostDomain = window.location.origin;
    console.log('Host Domain:', hostDomain);
    this.seedFormInstance();
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
            redirect_to: `${window.location.origin}/authentication/reset-password/`
          },
          type: 'User Authentication'
        }
      };

      this.authService.postRequest('auth/user/password/request-reset', this.userData).subscribe({
        next: (res) => {
          this.ApiResponseStatus.error = true;
          this.ApiResponseStatus.message = "A password reset link has been sent to your email";
          this.ApiResponseStatus.processing = false;
        },
        error: (error) =>{
          this.ApiResponseStatus.processing = false;
        },
        complete: () =>{
          this.ApiResponseStatus.processing = false;
        },
      });
    }
  }
}
