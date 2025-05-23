import { formatNumber } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { AlertRun, Threshold } from 'src/app/interfaces/IThreshold.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'threshold-item',
  templateUrl: './threshold.item.component.html',
})
export class ThresholdItemComponent implements OnInit, AfterViewInit {
  @Input() threshold: Threshold | null;
  @Input() buttonLabel: string = 'Create';

  @Output() deleteThreshold = new EventEmitter<string>();

  runColumns: string[] = ['ran_at', 'value', 'threshold', 'threshold_reached'];
  dataSource = new MatTableDataSource<AlertRun>([]);

  value: string = '';
  description: string = '';

  constructor(private apiService: ApiService) {}

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<AlertRun>(
      this.threshold.alert.runs,
    );

    this.buildAlertDescription();

    this.value =
      this.threshold.alert.runs.length > 0
        ? this.threshold.alert.runs[0].value
        : '-';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

        this.value = formatNumber(
          Number(this.threshold.value),
          'en-US',
          '1.0-0',
        );

        this.buildAlertDescription();

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

  buildAlertDescription() {
    let method = this.threshold.method;
    let column_name = this.threshold.default.column_name;
    let operator = this.mapOperatorToDescription(
      this.threshold.default.operator,
    );
    let value = this.threshold.default.value;

    this.description = `Alert sent when the ${method} of ${column_name} ${operator} ${value}`;
  }

  mapOperatorToDescription(operator) {
    switch (operator) {
      case 'is_nil':
        return 'is null';
      case 'eq':
        return 'equals';
      case 'not_eq':
        return 'is not equal to';
      case 'in':
        return 'in';
      case 'ilike':
        return 'is like';
      case 'like':
        return 'is like';
      case 'less_than':
        return 'is less than';
      case 'less_than_or_equal':
        return 'is less than or equal to';
      case 'greater_than':
        return 'is greater than';
      case 'greater_than_or_equal':
        return 'is greater than or equal to';

      default:
        return 'unknown';
    }
  }
}
