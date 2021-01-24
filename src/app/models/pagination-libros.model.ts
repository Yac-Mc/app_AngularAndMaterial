import { Libros } from './libros.model';
export interface PaginacionLibros {
  pageSize: number;
  page: number;
  sort: string;
  sortDirection: string;
  pageQuantity: number;
  data: Libros[];
  filterValue: {};
  totalRows: number;
}
