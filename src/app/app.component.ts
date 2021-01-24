import { Component } from '@angular/core';
import { SeguridadService } from './services/seguridad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  openMenu = false;

  constructor(private seguridadService: SeguridadService){
    this.seguridadService.cargarUsuario();
  }
}
