import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { LibroService } from '../../services/libro.service';
import { Libros } from '../../models/libros.model';
import { LibroNuevoComponent } from '../libro-nuevo/libro-nuevo.component';
import { Subscription } from 'rxjs';
import { PaginacionLibros } from '../../models/pagination-libros.model';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css'],
})
export class LibrosComponent implements OnInit, AfterViewInit, OnDestroy {
  lstLibros: Libros[] = [];
  desplegarColumnas = ['titulo', 'descripcion', 'autor', 'precio'];
  dataSource = new MatTableDataSource<Libros>();
  @ViewChild(MatSort) order: MatSort;
  @ViewChild(MatPaginator) paginacion: MatPaginator;
  private libroNuevoSubscription: Subscription;
  totalLibros = 0;
  librosPorPagina = 2;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'titulo';
  sorDirection = 'asc';
  filterValue = null;
  timeout: any = null;

  constructor(private libroService: LibroService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.libroService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sorDirection, this.filterValue);
    this.libroNuevoSubscription = this.libroService.obtenerActualListener().subscribe((paginacion: PaginacionLibros) => {
      this.dataSource = new MatTableDataSource<Libros>(paginacion.data);
      this.totalLibros = paginacion.totalRows;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.order;
    this.dataSource.paginator = this.paginacion;
  }

  filtro(event: any) {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(() => {
      if(event.keyCode != 13){
        const filterValueLocal = {
          propiedad: 'titulo',
          valor: event.target.value
        };

        $this.filterValue = filterValueLocal;
        $this.libroService.obtenerLibros($this.librosPorPagina, $this.paginaActual, $this.sort, $this.sorDirection, $this.filterValue);
      }
    }, 1000)
  }

  abrirDialog() {
    const dialogRef = this.dialog.open(LibroNuevoComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.libroService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sorDirection, this.filterValue);
    })
  }

  eventoPaginador(event: PageEvent){
    this.librosPorPagina = event.pageSize;
    this.paginaActual = (event.pageIndex + 1);
    this.libroService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sorDirection, this.filterValue);
  }

  ordenarColumna(event: any){
    this.sort = event.active;
    this.sorDirection = event.direction;
    this.libroService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sorDirection, this.filterValue);
  }

  ngOnDestroy(): void {
    this.libroNuevoSubscription.unsubscribe();
  }
}
