import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/jogos'; // A URL do nosso NestJS

  getClassificacaoGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classificacao/grupos`);
  }

  getMelhoresTerceiros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classificacao/terceiros`);
  }

  getJogos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  finalizarJogo(id: number, gols_A_real: number, gols_B_real: number, selecao_vencedora_penaltis_id?: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/finalizar`, {
      gols_A_real,
      gols_B_real,
      selecao_vencedora_penaltis_id
    });
  }

  gerarMataMata(): Observable<any> {
    return this.http.post(`${this.apiUrl}/gerar-mata-mata`, {});
  }

  // Rota auxiliar que você precisará criar no backend para atualizar a vaga em aberto
  alocarTerceiro(jogoId: number, selecaoId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${jogoId}/alocar`, { selecao_b_id: selecaoId });
  }
}