import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { Threshold } from 'src/app/interfaces/IThreshold.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'threshold-item',
  templateUrl: './threshold.item.component.html',
})
export class ThresholdItemComponent implements OnInit, OnChanges {
  @Input() threshold: Threshold | null;
  @Input() buttonLabel: string = 'Create';

  @Output() deleteThreshold = new EventEmitter<string>();

  constructor(private apiService: ApiService) {}

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  ngOnInit(): void {
    this.calculateValue();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error("Method not implemented.");
  }

  onDeleteThreshold(threshold_id: string) {
    this.deleteThreshold.emit(threshold_id);
  }

  calculateValue() {
    this.ApiResponseStatus.processing = true;

    const url = `thresholds/value?id=${this.threshold.id}`;
    this.apiService.get(url).subscribe({
      next: (res) => {
        this.threshold = { ...this.threshold, ...res.data.attributes };

        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;
      },
      error: (error) => {
        this.ApiResponseStatus.success = false;
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        this.ApiResponseStatus.success = false;
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  refreshValue() {
    this.calculateValue();
  }
}
