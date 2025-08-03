import { CrudSort, Pagination } from './query-params';
import { CrudFilter, ConditionalFilter, LogicalFilter } from './query-params';

export const parseSorters = (sorters?: CrudSort[]) => {
  if (!sorters) return [];
  return sorters.map((sorter) => ({ [sorter.field]: sorter.order }));
};

export const parseFilter = (filters?: CrudFilter[]) => {
  const where: Record<string, any> = {};
  if (!filters || filters.length === 0) {
    return where;
  }
  filters.forEach((filter) => {
    if (
      typeof filter === 'object' &&
      'field' in filter &&
      'operator' in filter &&
      'value' in filter
    ) {
      where[filter.field] = { [filter.operator]: filter.value };
    }
  });
  return where;
};

export const parsePagination = (pagination?: Pagination) => {
  return pagination?.current && pagination?.pageSize
    ? (pagination.current - 1) * pagination.pageSize
    : undefined;
};
