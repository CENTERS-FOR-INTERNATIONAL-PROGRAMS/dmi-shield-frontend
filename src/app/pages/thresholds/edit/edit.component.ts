import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Threshold,
  ThresholdAlert,
  ThresholdDatasource,
} from 'src/app/interfaces/IThreshold.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  thresholdId: string | null = null;
  datasources: ThresholdDatasource[] = [];
  threshold: Threshold | null = null;
  alert: ThresholdAlert | null = null;

  stepperGroup1 = new FormGroup({
    firstCtrl: new FormControl({
      value: '1',
      disabled: false,
    }),
  });
  stepperGroup2 = new FormGroup({
    secondCtrl: new FormControl({
      value: '2',
      disabled: false,
    }),
  });

  isEditable = true;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private communication: CommunicationService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.thresholdId = this.route.snapshot.paramMap.get('id');
    this.loadThreshold();
  }

  loadThreshold() {
    this.ApiResponseStatus.processing = true;

    const url = `thresholds/${this.thresholdId}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        let threshold = {
          ...res.data.attributes,
          ...{ id: res.data.id },
        } as Threshold;

        this.threshold = threshold;

        this.alert = threshold.alert;

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

  updateThreshold(threshold: Threshold) {
    this.ApiResponseStatus.processing = true;

    let payload = {
      data: {
        attributes: {
          ...threshold,
          ...{
            alert: {
              threshold_id: this.threshold.id,
              user_ids: [this.threshold.user_id],
            },
          },
        },
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
          'Threshold update failed. Kindly try again.',
        );
      },
      complete: () => {},
    });
  }

  updateThresholdAlert(userIds: string[]) {
    this.ApiResponseStatus.processing = true;

    let users = userIds.filter((e) => e != this.threshold.user_id);

    let payload = {
      data: {
        attributes: {
          ...{
            source: this.threshold.source,
            name: this.threshold.name,
            method: this.threshold.method,
            filters: this.threshold.filters,
            filters_combine_by: this.threshold.filters_combine_by,
            alert_frequency: this.threshold.alert_frequency,
            default: this.threshold.default,
            resource: this.threshold.resource,
            domain: this.threshold.domain,
          },
          ...{
            alert: {
              threshold_id: this.threshold.id,
              user_ids: [...users, this.threshold.user_id],
            },
          },
        },
        type: 'Threshold',
      },
    };

    const url = `thresholds/${this.threshold.id}`;

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
          'Threshold update failed. Kindly try again.',
        );
      },
      complete: () => {},
    });
  }

  showLoader(value: boolean) {
    requestAnimationFrame(() => (this.ApiResponseStatus.processing = value));
  }
}
