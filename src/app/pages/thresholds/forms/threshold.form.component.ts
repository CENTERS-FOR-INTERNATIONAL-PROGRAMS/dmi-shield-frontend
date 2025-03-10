import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Threshold,
  ThresholdColumn,
  ThresholdColumnOperator,
  ThresholdDatasource,
  ThresholdFilter,
} from 'src/app/interfaces/IThreshold.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'threshold-form',
  templateUrl: './threshold.form.component.html',
})
export class ThresholdFormComponent implements OnInit, OnChanges {
  methods: string[] = ['sum', 'avg', 'max', 'min', 'count'];
  combinators: string[] = ['and', 'or'];
  selectedDatasource: ThresholdDatasource | null = null;
  selectedBaseMethod: string | null = null;
  selectedBaseColumn: ThresholdColumn | null = null;
  selectedBaseColumnOperator: ThresholdColumnOperator = null;
  selectedFiltersCombinator: string = 'and';
  thresholdValue: number | null | string = null;
  thresholdFilter: ThresholdFilter | null = null;
  thresholdForm!: FormGroup;

  @Input() datasources: ThresholdDatasource[] = [];
  @Input() threshold: Threshold | null;
  @Input() buttonLabel: string = 'Create';

  @Output() formSubmit = new EventEmitter<Threshold>();
  @Output() showLoader = new EventEmitter<boolean>();

  constructor(
    private communication: CommunicationService,
    private awareness: AwarenessService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDatasources();

    this.thresholdForm = new FormGroup({
      datasource: new FormControl(
        {
          value: this.selectedDatasource,
          disabled: true,
        },
        [Validators.required]
      ),
      column: new FormControl(
        {
          value: this.selectedBaseColumn,
          disabled: true,
        },
        [Validators.required]
      ),

      method: new FormControl(
        {
          value: this.selectedBaseMethod,
          disabled: true,
        },
        [Validators.required]
      ),
      operator: new FormControl(
        {
          value: this.selectedBaseColumnOperator,
          disabled: true,
        },
        [Validators.required]
      ),
      combinator: new FormControl(this.selectedFiltersCombinator, [
        Validators.required,
      ]),
      thresholdValue: new FormControl(this.thresholdValue, [
        Validators.required,
      ]),
      filters: new FormArray([]),
    });

    this.thresholdForm
      .get('column')
      .valueChanges.pipe(
        filter((column) => column !== null),
        tap((column) => {
          this.thresholdForm.get('operator').reset();
          this.thresholdForm.get('method').reset();
          this.selectedBaseColumn = column as ThresholdColumn;
          this.thresholdForm.get('operator').enable();
          this.thresholdForm.get('method').enable();
        })
      )
      .subscribe();

    this.thresholdForm
      .get('datasource')
      .valueChanges.pipe(
        filter((column) => column !== null),
        tap((column) => {
          this.thresholdForm.get('column').reset();
          this.thresholdForm.get('method').reset();
          this.thresholdForm.get('operator').reset();
          this.selectedDatasource = column as ThresholdDatasource;
          this.thresholdForm.get('column').enable();
          this.thresholdForm.get('method').disable();
          this.thresholdForm.get('operator').disable();
        })
      )
      .subscribe();

    this.thresholdAttributesToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasources']) {
      this.datasources = changes['datasources'].currentValue;
    }
    if (changes['threshold']) {
      this.threshold = changes['threshold'].currentValue;
    }

    requestAnimationFrame(() => {
      this.thresholdAttributesToForm();
    });
  }

  loadDatasources() {
    this.showLoader.emit(true);
    const userData = this.awareness.getUserData();

    if (!userData) {
      this.router.navigate(['/authentication/login']);
      return;
    }

    const url = `thresholds/datasources`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.datasources = res.map((item) => item as ThresholdDatasource);
        this.thresholdForm.get('datasource')?.enable({ emitEvent: false });

        this.showLoader.emit(false);
      },
      error: (error) => {
        this.showLoader.emit(false);
      },
      complete: () => {
        this.showLoader.emit(false);
      },
    });
  }

  onFormSubmit() {
    if (!this.thresholdForm.valid) return;

    let threshold = this.thresholdFormAttributes(this.thresholdForm);

    this.formSubmit.emit(threshold);
  }

  get filters() {
    return this.thresholdForm.get('filters') as FormArray;
  }

  addFilter() {
    let control = this.createFilterFormGroup();
    this.filters.push(control);
  }

  removeFilter(index: number) {
    this.filters.removeAt(index);
  }

  addGroupFilter() {
    let control = this.createFilterFormGroup();
    this.filters.push(control);
  }

  removeGroupFilter(index: number) {
    this.filters.removeAt(index);
  }

  createFilterFormGroup(): FormGroup {
    return new FormGroup({
      column_name: new FormControl('', [Validators.required]),
      operator: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    });
  }

  thresholdFormAttributes(thresholdForm: FormGroup): Threshold {
    let attributes: Threshold = {
      source: `${thresholdForm.get('datasource')?.value.schema}.${
        thresholdForm.get('datasource')?.value.table
      }`,
      name: thresholdForm.get('datasource')?.value.table,
      domain: thresholdForm.get('datasource')?.value.domain,
      resource: thresholdForm.get('datasource')?.value.resource,
      method: thresholdForm.get('method').value as any,
      default: {
        column_name: thresholdForm.get('column').value?.name,
        operator: thresholdForm.get('operator').value.name as any,
        value: thresholdForm.get('thresholdValue')?.value,
      },
      filters_combine_by: thresholdForm.get('combinator').value as any,
      filters: (thresholdForm.get('filters') as FormArray).controls.map(
        (control) => {
          return {
            column_name: control.get('column_name')?.value.name,
            operator: control.get('operator')?.value.name,
            value: control.get('value')?.value,
          };
        }
      ),
    };

    return attributes;
  }

  thresholdAttributesToForm() {
    if (this.threshold == null) return;
    if (this.datasources.length == 0) return;
    let datasource = this.datasources.find(
      (d) => d.resource === this.threshold?.resource
    );
    let column = datasource.columns.find(
      (column) => column.name === this.threshold?.default.column_name
    );

    this.selectedDatasource = datasource;
    this.selectedBaseColumn = column;
    this.thresholdForm.setValue({
      datasource: datasource,
      column: column,
      method: this.threshold.method,
      operator: column.operators.find(
        (op) => op.name === this.threshold.default.operator
      ),
      combinator: this.threshold.filters_combine_by,
      thresholdValue: this.threshold.default.value as any,
      filters: [],
    });

    this.threshold.filters.forEach((filter) => {
      let column = datasource.columns.find(
        (column) => column.name === filter.column_name
      );

      let operator = column.operators.find((op) => op.name === filter.operator);

      let group = new FormGroup({
        column_name: new FormControl(column, [Validators.required]),
        operator: new FormControl(operator, [Validators.required]),
        value: new FormControl(filter.value, [Validators.required]),
      });

      this.filters.push(group);
    });
  }
}
