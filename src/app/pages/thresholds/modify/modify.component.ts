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

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
})
export class ModifyComponent implements OnInit {
  datasources: ThresholdDatasource[] = [];

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private communication: CommunicationService,
    private awareness: AwarenessService,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createThreshold(attributes: Threshold) {
    this.ApiResponseStatus.processing = true;

    let payload = {
      data: {
        attributes: attributes,
        type: 'Threshold',
      },
    };

    this.apiService.postRequest('thresholds', payload).subscribe({
      next: (_response) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        this.communication.showToast('Threshold created succesfully');
        this.router.navigate(['/thresholds/composites']);
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
}
