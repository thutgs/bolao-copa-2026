import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, of, catchError } from 'rxjs';
import { Selecao } from '../models/selecao.model';

@Injectable({
  providedIn: 'root'
})
export class SelecoesService {
  private readonly API_URL = 'http://localhost:3000';

  private selecoesCache$?: Observable<Selecao[]>;
  selecoes = signal<Selecao[]>([]);

  // Seleções mockadas para quando o backend não estiver disponível
  private mockSelecoes: Selecao[] = [
    { id: 1, nome: 'Brasil', grupo: 'A' },
    { id: 2, nome: 'Argentina', grupo: 'A' },
    { id: 3, nome: 'Alemanha', grupo: 'B' },
    { id: 4, nome: 'França', grupo: 'B' },
    { id: 5, nome: 'Espanha', grupo: 'C' },
    { id: 6, nome: 'Portugal', grupo: 'C' },
    { id: 7, nome: 'Inglaterra', grupo: 'D' },
    { id: 8, nome: 'Itália', grupo: 'D' },
    { id: 9, nome: 'Holanda', grupo: 'E' },
    { id: 10, nome: 'Bélgica', grupo: 'E' },
    { id: 11, nome: 'Uruguai', grupo: 'F' },
    { id: 12, nome: 'Croácia', grupo: 'F' }
  ];

  constructor(private http: HttpClient) {}

  getSelecoes(): Observable<Selecao[]> {
    if (!this.selecoesCache$) {
      this.selecoesCache$ = this.http.get<Selecao[]>(`${this.API_URL}/selecoes`).pipe(
        catchError(() => {
          console.log('Backend não disponível, usando seleções mockadas');
          return of(this.mockSelecoes);
        }),
        shareReplay(1)
      );
    }
    return this.selecoesCache$;
  }

  loadSelecoes(): void {
    this.getSelecoes().subscribe({
      next: (selecoes: Selecao[]) => this.selecoes.set(selecoes)
    });
  }
}
