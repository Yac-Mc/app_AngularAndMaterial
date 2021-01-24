import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { LibroService } from '../../services/libro.service';
import { AutorService } from '../../services/autor.service';
import { Autor } from '../../models/autor.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-libro-nuevo',
  templateUrl: './libro-nuevo.component.html',
  styleUrls: ['./libro-nuevo.component.css']
})
export class LibroNuevoComponent implements OnInit, OnDestroy {
  selectAutor: string;
  selectAutorText: string;
  fechaPublicacion: string;
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;
  autores: Autor[] = [];
  autorSubscription: Subscription;

  constructor(private libroService: LibroService, private autorService: AutorService, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.autorService.obtenerAutores();
    this.autorSubscription = this.autorService.obtenerActualListener().subscribe((autores: Autor[]) => {
      this.autores = autores;
    });
  }

  selected(event: MatSelectChange){
    this.selectAutorText = (event.source.selected as MatOption).viewValue;
  }

  guardarLibro(form: NgForm){

    if(form.valid){

      const autorRequest = {
        id: this.selectAutor,
        nombreCompleto: this.selectAutorText
      }
      const libroRequest = {
        id: null,
        titulo: form.value.titulo,
        descripcion: form.value.descripcion,
        precio: form.value.precio,
        fechaPublicacion: new Date(this.fechaPublicacion),
        autor: autorRequest
      }

      this.libroService.agregarLibro(libroRequest);
      this.autorSubscription = this.libroService.agregarLibroListener().subscribe(() => {
        this.dialogRef.closeAll();
      })
    }
  }

  ngOnDestroy(): void {
    this.autorSubscription.unsubscribe();
  }

}
