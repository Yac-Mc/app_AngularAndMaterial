import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeguridadService } from '../../../services/seguridad.service';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: [
    './barra.component.css',
    '../menu-lista/menu-lista.component.css'
  ]
})
export class BarraComponent implements OnInit, OnDestroy {
  @Output() menuToggle = new EventEmitter<void>();
  estadoUsuario: boolean;
  usuarioSubscription: Subscription;

  constructor(private seguridadService: SeguridadService) { }

  ngOnInit(): void {
    this.usuarioSubscription = this.seguridadService.seguridadCambio.subscribe(status => {
      this.estadoUsuario = status;
    })
  }

  salirSesion(){
    this.seguridadService.salirSesion();
  }

  onMenuToggle(){
    this.menuToggle.emit();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription.unsubscribe();
  }

}
