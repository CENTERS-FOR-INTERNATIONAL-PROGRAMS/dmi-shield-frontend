export type ThresholdColumnValue = {
  value: string;
  type: string;
};

export type ConcatValueWith = {
  name: string;
  separator?: string;
};

export type ThresholdDatasource = {
  resource: string;
  table: string;
  schema: string;
  domain: string;
  columns: ThresholdColumn[];
  dimensions: ThresholdDimension[];
  aggregate_by: ThresholdAggregateBy[];
};

export type ThresholdDimension = {
  resource: string;
  source_attribute: string;
  destination_attribute: string;
  concat_value_with: ConcatValueWith | null;
};

export type ThresholdColumnOperator = {
  name: string;
  operator: string;
};

export type ThresholdAggregateBy = {
  source_attribute: string;
  frequency: string;
};

export type ThresholdColumn = {
  name: string;
  type: string;
  is_primary_key: boolean;
  is_dimension: boolean;
  dimension?: ThresholdDimension;
  operators: ThresholdColumnOperator[];
};

export type ThresholdFilter = {
  column_name: string;
  operator:
    | 'is_nil'
    | 'eq'
    | 'not_eq'
    | 'in'
    | 'less_than'
    | 'less_than_or_equal'
    | 'greater_than'
    | 'greater_than_or_equal'
    | 'like'
    | 'ilike'
    | 'has';
  value: string | number | boolean;
};

export type ThresholdAlert = {
  id?: string;
  threshold_id?: string;
  user_ids?: string[];
};

export type Threshold = {
  id?: string;
  source: string;
  name: string;
  domain: string;
  resource: string;
  method: 'sum' | 'avg' | 'max' | 'min' | 'count' | 'mean';
  default: ThresholdFilter;
  threshold?: string | number;
  filters_combine_by: 'and' | 'or';
  filters: ThresholdFilter[];
  user_id?: string;
  sql?: string;
  value?: string | string[];
  alert?: ThresholdAlert;
};
