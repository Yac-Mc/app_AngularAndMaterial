import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Autor } from '../models/autor.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutorService {
  baseUrl = environment.baseUrl;
  private lstAutores: Autor[] = [];
  private autoresSubject = new Subject<Autor[]>();

  constructor(private http: HttpClient) {}

  obtenerAutores(){
    this.http.get<Autor[]>(`${this.baseUrl}autor`).subscribe((data) => {
      this.lstAutores = data;
      this.autoresSubject.next([...this.lstAutores]);
    })
  }

  obtenerActualListener(){
    return this.autoresSubject.asObservable();
  }
}
