import { Injectable } from '@angular/core';
import { Libros } from '../models/libros.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginacionLibros } from '../models/pagination-libros.model';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  baseUrl = environment.baseUrl;
  private lstLibros: Libros[] = [];
  libroSubject = new Subject();
  librosPaginacion: PaginacionLibros;
  libroPaginacionSubject = new Subject<PaginacionLibros>();

  constructor(private http: HttpClient) { }

  obtenerLibros(librosPorPagina: number, paginaActual: number, sort: string, sortDirection: string, filterValue: any){
    const request = {
      pageSize: librosPorPagina,
      page: paginaActual,
      sort,
      sortDirection,
      filterValue
    }
    this.http.post<PaginacionLibros>(`${this.baseUrl}libro/pagination`, request).subscribe(data =>{
      this.librosPaginacion = data;
      this.libroPaginacionSubject.next(this.librosPaginacion);
    })
  }

  obtenerActualListener(){
    return this.libroPaginacionSubject.asObservable();
  }

  agregarLibro(libro: Libros){

    this.http.post(`${this.baseUrl}libro`,libro).subscribe(response => {
      this.libroSubject.next();
    })

  }

  agregarLibroListener(){
    return this.libroSubject.asObservable();
  }
}
