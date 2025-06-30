import { Component, OnInit } from '@angular/core';
import { CompositeFormControls } from '../../../models/CompositeFormControls.model';
import { ApiResponse, VerifyOtpData } from '../../../interfaces/IAuth.model';
import { AuthService } from '../../../services/api/auth.service';
import { AwarenessService } from '../../../services/awareness.service';
import { Router } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrls: ['./confirm-otp.component.scss'],
})
export class ConfirmOtpComponent implements OnInit {
  hide: boolean = true;
  UserFormControls: CompositeFormControls = {};
  userData: VerifyOtpData;

  constructor(
    private authService: AuthService,
    private awareness: AwarenessService,
    private router: Router,
    private communication: CommunicationService,
  ) {}

  ngOnInit(): void {
    const hostDomain = window.location.origin;
    this.seedFormInstance();
  }

  ApiResponseStatus: ApiResponse = {
    error: false,
    result: null,
    processing: false,
    message: '',
  };

  seedFormInstance() {
    this.UserFormControls['one_time_pass'] = new FormControl('', [
      Validators.required,
    ]);
  }

  validateInstance(): boolean {
    let is_valid = true;

    Object.keys(this.UserFormControls).forEach((fc_key) => {
      if (
        this.UserFormControls[fc_key].hasError('required') ||
        this.UserFormControls[fc_key].hasError('one_time_pass')
      ) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance() {
    if (this.validateInstance()) {
      this.ApiResponseStatus.processing = true;

      this.userData = {
        data: {
          attributes: {
            code: this.UserFormControls['one_time_pass'].value,
            id: this.getUserId(),
            token: this.handleGetToken(),
          },
          type: 'User Authentication',
        },
      };

      this.authService
        .postRequest('auth/user/2fa/verify', this.userData)
        .subscribe({
          next: (response) => {
            this.ApiResponseStatus.processing = false;
            response.data.attributes.user.token =
              response.data.attributes.token;
            this.awareness.saveUserData(response.data.attributes.user);
          },
          error: (error) => {
            this.ApiResponseStatus.error = true;
            this.ApiResponseStatus.processing = false;
            this.ApiResponseStatus.message = 'Expired on invalid pass code';
          },
          complete: () => {
            this.ApiResponseStatus.processing = false;
            this.router.navigate(['/home']);
          },
        });
    }
  }

  handleGetToken(): string {
    const token = this.awareness.getPreSignUserData().token;
    if (token != '') {
      return token;
    } else {
      this.router.navigate(['/home']);
      return '';
    }
  }

  getUserId(): string {
    const token = this.awareness.getPreSignUserData().id;
    if (token != '') {
      return token;
    } else {
      this.router.navigate(['/home']);
      return '';
    }
  }
}
