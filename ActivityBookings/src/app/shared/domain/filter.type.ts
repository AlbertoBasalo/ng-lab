/** Sort order */
export type SortOrders = 'asc' | 'desc';

/** The filter criteria and sort result */
export type Filter = {
  search: string;
  sortBy: string;
  order: SortOrders;
};

/** The default filter values*/
export const DEFAULT_FILTER: Filter = {
  search: '',
  sortBy: 'id',
  order: 'asc',
};
