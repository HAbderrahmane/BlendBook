export interface PaginationMeta {
  page: number;
  perPage: number;
  totalItems?: number;
  totalPages?: number;
}

export interface PaginationApi {
  count: number;
  pages: number;
}

export interface PagedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
  pagination?: PaginationApi;
}
