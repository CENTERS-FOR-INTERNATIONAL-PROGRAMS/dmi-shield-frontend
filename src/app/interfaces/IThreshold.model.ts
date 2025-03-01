export type ThresholdDatasource = {
  resource: string;
  table: string;
  schema: string;
  domain: string;
  columns: ThresholdColumn[];
};

export type ThresholdColumnOperator = {
  name: string;
  operator: string;
};

export type ThresholdColumn = {
  name: string;
  type: string;
  primary_key: boolean;
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
};
