/** Sort order */
export type SortOrders = 'asc' | 'desc';

/** The filter criteria and sort result */
export type Filter = {
  search: string;
  orderBy: string;
  sort: SortOrders;
};

/** The default filter values*/
export const DEFAULT_FILTER: Filter = {
  search: '',
  orderBy: 'id',
  sort: 'asc',
};
