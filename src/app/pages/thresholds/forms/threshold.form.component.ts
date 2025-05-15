import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Threshold,
  ThresholdColumn,
  ThresholdColumnOperator,
  ThresholdColumnValue,
  ThresholdDatasource,
  ThresholdFilter,
} from 'src/app/interfaces/IThreshold.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';

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
  thresholdName: null | string = null;
  thresholdFilter: ThresholdFilter | null = null;
  thresholdForm!: FormGroup;

  selectableColumns: ThresholdColumn[] = [];
  selectableDimensions: ThresholdColumn[] = [];

  @Input() datasources: ThresholdDatasource[] = [];
  @Input() threshold: Threshold | null;
  @Input() buttonLabel: string = 'Create';

  @Output() formSubmit = new EventEmitter<Threshold>();
  @Output() showLoader = new EventEmitter<boolean>();

  distinctColumnValues: Record<string, ThresholdColumnValue[]> = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDatasources();

    this.thresholdForm = new FormGroup({
      datasource: new FormControl(
        {
          value: this.selectedDatasource,
          disabled: true,
        },
        [Validators.required],
      ),
      column: new FormControl(
        {
          value: this.selectedBaseColumn,
          disabled: true,
        },
        [Validators.required],
      ),

      method: new FormControl(
        {
          value: this.selectedBaseMethod,
          disabled: true,
        },
        [Validators.required],
      ),
      operator: new FormControl(
        {
          value: this.selectedBaseColumnOperator,
          disabled: true,
        },
        [Validators.required],
      ),
      combinator: new FormControl(this.selectedFiltersCombinator, [
        Validators.required,
      ]),
      thresholdValue: new FormControl(this.thresholdValue, [
        Validators.required,
      ]),
      thresholdName: new FormControl(this.thresholdName, [Validators.required]),
      filters: new FormArray([]),
    });

    this.thresholdForm
      .get('column')
      .valueChanges.pipe(
        filter((column) => column !== null),
        tap((column) => {
          this.thresholdForm.get('operator').reset();
          this.selectedBaseColumn = column as ThresholdColumn;
          this.thresholdForm.get('operator').enable();
        }),
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

          this.selectableColumns = this.selectedDatasource.columns.filter(
            (column) => column.is_dimension == false,
          );

          this.selectableDimensions = this.selectedDatasource.columns.filter(
            (column) => column.is_dimension == true,
          );

          this.thresholdForm.get('column').enable();
          this.thresholdForm.get('method').enable();
          this.thresholdForm.get('operator').disable();
        }),
      )
      .subscribe();

    (this.thresholdForm.get('filters') as FormArray).valueChanges
      .pipe(
        filter((filters) => filters !== null),

        tap((filters) => {
          filters.forEach((filter) => {
            if (filter.column_name == '') return;
            if (this.distinctColumnValues[filter.column_name.name] != null)
              return;

            this.loadDistinctColumnValues(filter.column_name);
          });
        }),
      )
      .subscribe();

    this.thresholdAttributesToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasources'] && changes['threshold'].currentValue) {
      this.datasources = changes['datasources'].currentValue;
    }
    if (changes['threshold'] && changes['threshold'].currentValue) {
      this.threshold = changes['threshold'].currentValue;
    }

    this.thresholdAttributesToForm();
  }

  loadDatasources() {
    this.showLoader.emit(true);

    const url = `thresholds/datasources`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.datasources = res.map((item) => item as ThresholdDatasource);
        this.thresholdAttributesToForm();
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
      name: thresholdForm.get('thresholdName')?.value,
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
        },
      ),
    };

    return attributes;
  }

  thresholdAttributesToForm() {
    if (this.threshold == null) return;
    if (this.datasources.length == 0) return;
    let datasource = this.datasources.find(
      (d) => d.resource === this.threshold?.resource,
    );
    let column = datasource.columns.find(
      (column) => column.name === this.threshold?.default.column_name,
    );

    let filters = [];
    this.selectedDatasource = datasource;
    this.selectedBaseColumn = column;

    this.threshold.filters.forEach((filter) => {
      let column = datasource.columns.find(
        (column) => column.name === filter.column_name,
      );

      let operator = column.operators.find((op) => op.name === filter.operator);

      let group = new FormGroup({
        column_name: new FormControl(column, [Validators.required]),
        operator: new FormControl(operator, [Validators.required]),
        value: new FormControl(filter.value, [Validators.required]),
      });

      filters.push({ column_name: column, operator, value: filter.value });

      this.filters.push(group);
    });

    this.thresholdForm.setValue({
      datasource: datasource,
      column: column,
      method: this.threshold.method,
      operator: column.operators.find(
        (op) => op.name === this.threshold.default.operator,
      ),
      combinator: this.threshold.filters_combine_by,
      thresholdValue: this.threshold.default.value as any,
      thresholdName: this.threshold.name as any,
      filters: filters,
    });
  }

  loadDistinctColumnValues(column: ThresholdColumn) {
    this.showLoader.emit(true);
    const url = `thresholds/datasources/distinct`;

    this.apiService
      .postRequest(url, {
        data: {
          column_name: column.dimension?.destination_attribute,
          resource: column.dimension?.resource,
        },
      })
      .subscribe({
        next: (res) => {
          let concat_value_with = column.dimension?.concat_value_with;

          let values = res.map((item: ThresholdColumnValue) => {
            if (concat_value_with) {
              let newItem = {
                ...item,
                ...{
                  value:
                    item.value +
                    concat_value_with.separator +
                    concat_value_with.name,
                },
              };
              return newItem as ThresholdColumnValue;
            }
            return item as ThresholdColumnValue;
          });

          let sorted_values = values.sort((a, b) => {
            if (a.type == 'Float' || a.type == 'Integer') {
              return a.value - b.value;
            } else if (a.type == 'String') {
              return ('' + a.value).localeCompare(b.value);
            } else {
              return a.value > b.value;
            }
          });

          this.distinctColumnValues[column.name] = sorted_values;

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

  castValueFromType(type, value) {
    let cast_value = value;
    switch (type) {
      case 'Float':
        Number.parseFloat(value.toString());
        break;

      default:
        break;
    }
  }
}
