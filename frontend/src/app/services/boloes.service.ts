import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoloesService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/boloes';

  getMeusBoloes(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  buscarPorCodigo(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.API}/codigo/${codigo}`);
  }

  entrarBolao(codigoConvite: string): Observable<any> {
    return this.http.post<any>(`${this.API}/entrar`, { codigo_convite: codigoConvite });
  }

  criarBolao(dados: { nome: string; descricao?: string }): Observable<any> {
    return this.http.post<any>(this.API, dados);
  }
}
