import { Component, OnInit } from '@angular/core';
import {
  ApiResponse,
  ConfirmAccountData,
} from '../../../interfaces/IAuth.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
})
export class ConfirmAccountComponent implements OnInit {
  userData: ConfirmAccountData;
  confirmationToken: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private communication: CommunicationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.confirmationToken = this.route.snapshot.paramMap.get('token');
    this.confirmAccount();
  }

  ApiResponseStatus: ApiResponse = {
    error: false,
    result: null,
    processing: false,
    message: '',
  };

  confirmAccount() {
    this.ApiResponseStatus.processing = true;
    this.userData = {
      data: {
        attributes: {
          token: this.confirmationToken,
        },
        type: 'User Authentication',
      },
    };

    this.apiService.postRequest('auth/user/confirm', this.userData).subscribe({
      next: (_response) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.error = false;
        this.communication.showToast('Account verification confirmed.');
      },
      error: (error) => {
        this.ApiResponseStatus.error = true;
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.message =
          'Expired or invalid confirmation token. Please sign in and request a new account confirmation request on your account settings page.';

        this.communication.showToast('Account verification failed.');
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
        this.router.navigate(['/home']);
      },
    });
  }
}
