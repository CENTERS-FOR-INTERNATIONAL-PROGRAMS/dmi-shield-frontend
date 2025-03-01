import { Component, OnInit } from '@angular/core';
import { AwarenessService } from '../../../services/awareness.service';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from '../../../interfaces/IAuth.model';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Threshold } from 'src/app/interfaces/IThreshold.model';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit {
  thresholds: Threshold[] = [];
  userRole: string;
  searchQuery: string = '';

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private awareness: AwarenessService,
    private apiService: ApiService,
    private communication: CommunicationService,

    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => console.error('Error fetching user role', err),
    });
    this.loadComposites();
  }

  loadComposites() {
    this.ApiResponseStatus.processing = true;
    const userData = this.awareness.getUserData();

    if (!userData) {
      this.router.navigate(['/authentication/login']);
    } else {
      const url = `thresholds?user_id=${userData.id}&limit=50&sort=-created_at`;
      this.apiService.get(url).subscribe({
        next: (res) => {
          this.ApiResponseStatus.processing = false;
          this.ApiResponseStatus.success = true;

          this.thresholds = res.data.map((item) => {
            return { ...item.attributes, ...{ id: item.id } };
          });
        },
        error: (error) => {},
        complete: () => {
          this.ApiResponseStatus.success = false;
          this.ApiResponseStatus.processing = false;
        },
      });
    }
  }

  deleteThreshold(id: string) {
    this.ApiResponseStatus.processing = true;

    this.apiService.deleteRequest(`thresholds/${id}`).subscribe({
      next: (res) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        this.communication.showToast('Threshold deleted succesfully');
        this.thresholds = this.thresholds.filter((item) => item.id !== id);
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Failed to delete threshold. Kindly try again.'
        );
      },
      complete: () => {
        this.ApiResponseStatus.success = false;
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  parseDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }
}
