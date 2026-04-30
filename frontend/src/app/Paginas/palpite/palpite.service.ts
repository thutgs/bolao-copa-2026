import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PalpiteService {
  private http = inject(HttpClient);
  private readonly API_JOGOS = 'http://localhost:3000/jogos';
  private readonly API_PALPITES = 'http://localhost:3000/palpites';

  private gamesSubject = new BehaviorSubject<any[]>(this.carregarCache());
  public games$ = this.gamesSubject.asObservable();

  private carregarCache(): any[] {
    try {
      const cache = localStorage.getItem('cache_jogos');
      return cache ? JSON.parse(cache) : [];
    } catch {
      return [];
    }
  }

  getJogos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_JOGOS).pipe(
      tap(jogos => {
        this.gamesSubject.next(jogos);
        localStorage.setItem('cache_jogos', JSON.stringify(jogos));
      })
    );
  }

  getPalpites(): Observable<any[]> {
    return this.http.get<any[]>(this.API_PALPITES);
  }

  salvarPalpite(palpite: any): Observable<any> {
    return this.http.post<any>(this.API_PALPITES, palpite);
  }
}