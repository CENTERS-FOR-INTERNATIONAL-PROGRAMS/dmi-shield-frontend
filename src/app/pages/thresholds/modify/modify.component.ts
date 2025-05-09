import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { AwarenessService } from '../../../services/awareness.service';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { Router } from '@angular/router';
import {
  Threshold,
  ThresholdDatasource,
} from 'src/app/interfaces/IThreshold.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
})
export class ModifyComponent implements OnInit {
  datasources: ThresholdDatasource[] = [];
  threshold: Threshold | null;

  stepperGroup1 = new FormGroup({
    firstCtrl: new FormControl(
      {
        value: '',
        disabled: false,
      },
      [Validators.required],
    ),
  });
  stepperGroup2 = new FormGroup({
    secondCtrl: new FormControl(
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ),
  });

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  isEditable = false;

  constructor(
    private communication: CommunicationService,
    private awareness: AwarenessService,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createThreshold(attributes: Threshold, stepper: MatStepper) {
    this.ApiResponseStatus.processing = true;

    let payload = {
      data: {
        attributes: attributes,
        type: 'Threshold',
      },
    };

    this.apiService.postRequest('thresholds', payload).subscribe({
      next: (response) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        let threshold = {
          ...response.data.attributes,
          ...{ id: response.data.id },
        } as Threshold;

        this.threshold = threshold;
        this.communication.showToast('Threshold created succesfully');
        this.stepperGroup1.disable();
        this.stepperGroup2.setValue({ secondCtrl: '' });
        this.stepperGroup2.enable();
        stepper.next();
      },

      error: (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Threshold creation failed. Kindly try again.',
        );
      },
      complete: () => {},
    });
  }

  mapAshTypeToValueType(type: string): string {
    switch (type) {
      case 'Float':
        return 'float';
      case 'String':
        return 'string';
      case 'Integer':
        return 'integer';
      default:
        return 'string';
    }
  }

  showLoader(value: boolean) {
    requestAnimationFrame(() => (this.ApiResponseStatus.processing = value));
  }

  updateThreshold(userIds: string[]) {
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
}
