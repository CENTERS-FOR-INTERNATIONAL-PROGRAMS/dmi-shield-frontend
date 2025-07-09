import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user_profile.component.html',
})
export class UserProfileComponent implements OnInit {
  currentUser: User | undefined = null;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  ApiResponseStatusConfirmation: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    public awareness: AwarenessService,
    private apiService: ApiService,
    private communicationService: CommunicationService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.awareness.currentUser;

    this.getApiUser();
  }

  getApiUser() {
    const url = `user/${this.currentUser.id}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;

        this.currentUser = {
          id: res.data.id,
          ...res.data.attributes,
        };
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  requestConfirmationEmail(): void {
    this.ApiResponseStatusConfirmation.processing = true;
    const url = `auth/user/confirm/request-confirmation-email`;

    const body = {
      data: {
        attributes: {
          email: this.currentUser.email,
        },
      },
    };

    this.apiService.postRequest(url, body).subscribe({
      next: (res) => {
        this.ApiResponseStatusConfirmation.success = true;

        this.communicationService.showToast(
          'Account confirmation email sent. Please check your email address for the confirmation link',
        );
      },
      error: (error) => {
        this.ApiResponseStatusConfirmation.processing = false;

        this.communicationService.showToast(
          'Account confirmation request failed. Please try again.',
        );
      },
      complete: () => {
        this.ApiResponseStatusConfirmation.processing = false;
      },
    });
  }
}
