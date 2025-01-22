import { Component, OnInit } from '@angular/core';
import { AwarenessService } from '../../../services/awareness.service';
import { Surveillance } from '../../../models/Surveillance.model';
import { CommunicationService } from '../../../services/communication.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api/api.service';
import {
  ApiResponse,
  ApiResponseStatus,
} from '../../../interfaces/IAuth.model';
import { ResourceModelApi } from '../../../models/Resource.model';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit {
  Surveillance: Surveillance[] = [];
  TableHeaders: string[] = [
    'original_filename',
    'state',
    'type',
    'created_at',
    'actions',
  ];
  // TableHeaders: string[] = [ "original_filename", "state", "type", "validated", "created_at", "actions"];
  fileStates: string[] = [
    'Pending Processing',
    'Validating',
    'Rejected',
    'Processing',
    'Validated',
  ];
  searchQuery: string = '';
  FilterSurveillanceData: Surveillance = new Surveillance();
  ResourceModel: ResourceModelApi[] = [];
  userRole: string;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private awareness: AwarenessService,
    private communication: CommunicationService,
    private apiService: ApiService,
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

  get filteredUploadList() {
    return this.ResourceModel.filter((user) =>
      user.original_filename
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  loadComposites() {
    this.ApiResponseStatus.processing = true;
    const userData = this.awareness.getUserData();
    if (!userData) {
      this.router.navigate(['/authentication/login']);
    } else {
      const url = `files/uploads/?user_id=${userData.id}&limit=50&sort=-created_at`;
      this.apiService.get(url).subscribe({
        next: (res) => {
          this.ApiResponseStatus.success = true;

          this.ResourceModel = res.data
            .map((item) => item.attributes)
            .filter((attr) => attr.type !== 'resource');
        },
        error: (error) => {},
        complete: () => {
          this.ApiResponseStatus.processing = false;
        },
      });
    }
  }

  deleteInstance(doc: any) {
    let SurveillanceInstance = new Surveillance();

    SurveillanceInstance = doc;
    SurveillanceInstance.deleted = true;
    SurveillanceInstance.modifiedDate =
      SurveillanceInstance.updateModifiedDate();

    // SurveillanceInstance.putInstance((res: any) =>{
    //   this.communication.showSuccessToast();
    //
    //   SurveillanceInstance.parseComposite(SurveillanceInstance);
    //
    //   this.loadComposite();
    //
    // }, (err: any) =>{
    //   console.error('error', err)
    //   this.communication.showFailedToast();
    // });
  }

  submitInstance() {}

  parseDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  getValidityStatus(status: boolean): string {
    if (status === true) {
      return 'Valid';
    }
    return 'Invalid';
  }

  formatState(element: any) {
    if (element.type === 'resource') {
      return '-';
    } else {
      // Remove underscores and convert to sentence case
      return element.state
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
    }
  }
}
