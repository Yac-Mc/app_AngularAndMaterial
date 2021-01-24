import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.model';
import { LoginData } from '../models/login-data.model';

@Injectable({
  providedIn: 'root',
})
export class SeguridadService {
  token: string;
  baseUrl = environment.baseUrl;
  private usuario: Usuario;
  seguridadCambio = new Subject<boolean>();

  cargarUsuario() {
    const tokenBrowser = localStorage.getItem('token');
    if (!tokenBrowser) {
      return;
    }

    this.token = tokenBrowser;
    this.seguridadCambio.next(true);

    this.http
      .get<Usuario>(`${this.baseUrl}usuario`)
      .subscribe((response: any) => {
        this.token = response.token;
        this.usuario = response;
        this.seguridadCambio.next(true);
        localStorage.setItem('token', response.token);
      });
  }

  obtenerToken() {
    return this.token;
  }

  constructor(private router: Router, private http: HttpClient) {}

  registrarUsuario(usr: Usuario) {
    this.http
      .post<Usuario>(`${this.baseUrl}usuario/registrar`, usr)
      .subscribe((response: any) => {
        console.log(response);
        this.token = response.token;
        this.usuario = response;
        this.seguridadCambio.next(true);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      });
  }

  login(loginData: LoginData) {
    this.http
      .post<Usuario>(`${this.baseUrl}usuario/login`, loginData)
      .subscribe((response: any) => {
        this.token = response.token;
        this.usuario = response;
        this.seguridadCambio.next(true);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      });
  }

  salirSesion() {
    this.usuario = null;
    this.seguridadCambio.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  obtenerUsuario() {
    return { ...this.usuario };
  }

  onSesion() {
    return this.token != null;
  }
}
