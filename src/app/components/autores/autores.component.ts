import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Autor } from '../../models/autor.model';
import { AutorService } from '../../services/autor.service';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css']
})
export class AutoresComponent implements OnInit, OnDestroy {
  desplegarColumnas = ['nombre', 'apellido', 'gradoAcademico'];
  dataSource = new MatTableDataSource<Autor>();
  private autorSubscription: Subscription;

  constructor(private autorService: AutorService) { }

  ngOnInit(): void {
    this.autorService.obtenerAutores();
    this.autorSubscription = this.autorService.obtenerActualListener().subscribe((autores: Autor[]) => {
      this.dataSource.data = autores;
    })
  }

  ngOnDestroy(): void {
    this.autorSubscription.unsubscribe();
  }

}
