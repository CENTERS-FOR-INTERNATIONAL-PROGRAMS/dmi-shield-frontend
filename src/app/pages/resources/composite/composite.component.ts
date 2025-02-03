import { Component, OnInit } from '@angular/core';
import { AwarenessService } from '../../../services/awareness.service';
import { CommunicationService } from '../../../services/communication.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/User.model';
import { Resource, ResourceModelApi } from '../../../models/Resource.model';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { ApiService } from '../../../services/api/api.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss'],
})
export class CompositeComponent implements OnInit {
  ResourceModel: ResourceModelApi[] = [];
  TableHeaders: string[] = ['original_filename', 'actions'];
  FilterResource: Resource = new Resource();
  UserInstance: User = new User();
  userRole: string;
  searchQuery: string = '';

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    public awareness: AwarenessService,
    private communication: CommunicationService,
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getUser();
    this.loadComposites();

    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => console.error('Error fetching user role', err),
    });
  }

  getUser() {
    this.awareness.UserInstance = this.awareness.getUserData();
  }

  openUrl(url: string) {
    if (
      !this.awareness.UserInstance?.role ||
      this.awareness.UserInstance?.role === 'level1' ||
      this.awareness.UserInstance?.role === 'guest'
    ) {
      this.communication.showToast(
        'Sorry, you are not authorised to download the file.'
      );
      return;
    }
    window.open(url, '_blank');
  }

  get filteredUploadList() {
    return this.ResourceModel.filter((user) =>
      user.original_filename
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  concatenate(text, limit) {
    if (text) {
      return text.length > limit ? `${text.slice(0, limit)}...` : text;
    }
  }

  loadComposites() {
    this.ApiResponseStatus.processing = true;
    this.apiService
      .getAll('files/uploads/resources?limit=50&sort=-created_at')
      .subscribe({
        next: (res) => {
          this.ApiResponseStatus.success = true;
          this.ResourceModel = res.data.map((item) => item.attributes);
        },
        error: (error) => {
          this.ApiResponseStatus.processing = false;
        },
        complete: () => {
          this.ApiResponseStatus.processing = false;
        },
      });
  }
}
