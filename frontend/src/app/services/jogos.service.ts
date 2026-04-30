import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/jogos'; 

  // Este método apenas busca os dados
  listarJogos(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }
}