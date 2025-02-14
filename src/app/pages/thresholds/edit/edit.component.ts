import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { AwarenessService } from '../../../services/awareness.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Threshold,
  ThresholdDatasource,
} from 'src/app/interfaces/IThreshold.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy {
  thresholdId: string | null = null;
  datasources: ThresholdDatasource[] = [];
  threshold: Threshold | null = null;

  private routeSub: Subscription;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private communication: CommunicationService,
    private awareness: AwarenessService,
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.thresholdId = params['id'];
      this.loadThreshold();
    });
  }

  loadThreshold() {
    this.ApiResponseStatus.processing = true;
    const userData = this.awareness.getUserData();

    if (!userData) {
      this.router.navigate(['/authentication/login']);
      return;
    }

    const url = `thresholds/${this.thresholdId}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        let threshold = {
          ...res.data.attributes,
          ...{ id: res.data.id },
        } as Threshold;

        this.threshold = threshold;

        this.ApiResponseStatus.success = true;
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateThreshold(threshold: Threshold) {
    this.ApiResponseStatus.processing = true;

    let payload = {
      data: {
        attributes: threshold,
        type: 'Threshold',
      },
    };

    const url = `thresholds/${this.thresholdId}`;

    this.apiService.patchRequest(url, payload).subscribe({
      next: (_response) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        this.communication.showToast('Threshold updated succesfully');
        this.router.navigate(['/thresholds/composites']);
      },

      error: (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Threshold update failed. Kindly try again.'
        );
      },
      complete: () => {},
    });
  }

  showLoader(value: boolean) {
    requestAnimationFrame(() => (this.ApiResponseStatus.processing = value));
  }
}
