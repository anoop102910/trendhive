export interface QueryParams {
  pagination?: Pagination;
  sorters?: CrudSort[];
  filters?: CrudFilter[];
}

export interface Pagination {
  /**
   * Initial page index
   * @default 1
   */
  current?: number;
  /**
   * Initial number of items per page
   * @default 10
   */
  pageSize?: number;
  /**
   * Whether to use server side pagination or not.
   * @default "server"
   */
  mode?: 'client' | 'server' | 'off';
}

export type CrudOperators =
  | 'eq'
  | 'ne'
  | 'lt'
  | 'gt'
  | 'lte'
  | 'gte'
  | 'in'
  | 'nin'
  | 'ina'
  | 'nina'
  | 'contains'
  | 'ncontains'
  | 'containss'
  | 'ncontainss'
  | 'between'
  | 'nbetween'
  | 'null'
  | 'nnull'
  | 'startswith'
  | 'nstartswith'
  | 'startswiths'
  | 'nstartswiths'
  | 'endswith'
  | 'nendswith'
  | 'endswiths'
  | 'nendswiths'
  | 'or'
  | 'and';

export type SortOrder = 'desc' | 'asc' | null;

export type LogicalFilter = {
  field: string;
  operator: Exclude<CrudOperators, 'or' | 'and'>;
  value: any;
};

export type ConditionalFilter = {
  key?: string;
  operator: Extract<CrudOperators, 'or' | 'and'>;
  value: (LogicalFilter | ConditionalFilter)[];
};

export type CrudFilter = LogicalFilter | ConditionalFilter;
export type CrudSort = {
  field: string;
  order: 'asc' | 'desc';
};

export type CrudFilters = CrudFilter[];
export type CrudSorting = CrudSort[];
