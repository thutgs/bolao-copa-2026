import { Component, OnInit, inject } from '@angular/core';
import { PalpiteService } from './palpite.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-palpite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './palpite.html',
  styleUrls: ['./palpite.scss']
})
export class PalpiteComponent implements OnInit {
  private palpiteService = inject(PalpiteService);
  listaDeJogos: any[] = [];
  meuExtrato: any[] = [];
  abaAtiva: 'proximos' | 'extrato' = 'proximos';
  carregandoJogos = false;

  ngOnInit(): void {
    // Subscreve ao observable de jogos para carregar dados do cache instantaneamente
    this.palpiteService.games$.subscribe(dados => {
      if (dados && dados.length > 0) {
        this.mapearJogos(dados);
        this.carregandoJogos = false;
      }
    });

    this.carregarJogos();
    this.carregarExtrato();
  }

  carregarJogos() {
    this.carregandoJogos = true;
    this.palpiteService.getJogos().subscribe({
      next: () => this.carregandoJogos = false,
      error: () => this.carregandoJogos = false
    });
  }

  private mapearJogos(dados: any[]) {
    try {
      if (!dados || !Array.isArray(dados)) return;
      
      this.listaDeJogos = dados.map(jogo => {
        try {
          const dataHora = jogo.data_hora_inicio ? new Date(jogo.data_hora_inicio) : new Date();
          return {
            id: jogo.id,
            timeA: jogo.selecao_A?.nome || 'A definir',
            siglaA: jogo.selecao_A?.nome?.substring(0, 3).toUpperCase() || 'XXX',
            bandeiraA: jogo.selecao_A?.url_bandeira || 'https://via.placeholder.com/60',
            timeB: jogo.selecao_B?.nome || 'A definir',
            siglaB: jogo.selecao_B?.nome?.substring(0, 3).toUpperCase() || 'XXX',
            bandeiraB: jogo.selecao_B?.url_bandeira || 'https://via.placeholder.com/60',
            data: dataHora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase(),
            data_hora_inicio: dataHora,
            grupo: jogo.fase || 'Grupo',
            palpiteA: null,
            palpiteB: null
          };
        } catch (e) {
          console.error('Erro ao mapear jogo individual:', e, jogo);
          return null;
        }
      }).filter(j => j !== null);
    } catch (error) {
      console.error('Erro crítico no mapeamento de jogos:', error);
    }
  }

  carregarExtrato() {
    this.palpiteService.getPalpites().subscribe({
      next: (dados) => {
        this.meuExtrato = dados.map(palpite => ({
          id: palpite.id,
          jogo: palpite.jogo,
          data: new Date(palpite.jogo?.data_hora_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase(),
          timeA: palpite.jogo?.selecao_A?.nome,
          timeB: palpite.jogo?.selecao_B?.nome,
          siglaA: palpite.jogo?.selecao_A?.nome?.substring(0, 3).toUpperCase(),
          siglaB: palpite.jogo?.selecao_B?.nome?.substring(0, 3).toUpperCase(),
          bandeiraA: palpite.jogo?.selecao_A?.url_bandeira,
          bandeiraB: palpite.jogo?.selecao_B?.url_bandeira,
          golsAReal: palpite.jogo?.gols_A_real,
          golsBReal: palpite.jogo?.gols_B_real,
          palpiteA: palpite.gols_A_palpite,
          palpiteB: palpite.gols_B_palpite,
          pontos: palpite.pontos_obtidos
        }));
      },
      error: (err) => console.error('Erro ao carregar extrato:', err)
    });
  }

  salvarPalpite(jogo: any) {
    if (jogo.palpiteA == null || jogo.palpiteB == null || jogo.palpiteA === '' || jogo.palpiteB === '') {
      alert('Por favor, preencha os dois campos do placar.');
      return;
    }
    
    const palpiteDto = {
      jogo_id: jogo.id,
      gols_A: Number(jogo.palpiteA),
      gols_B: Number(jogo.palpiteB)
    };

    this.palpiteService.salvarPalpite(palpiteDto).subscribe({
      next: () => {
        alert('Palpite salvo com sucesso!');
        this.carregarExtrato(); // Atualiza a lista
      },
      error: (err) => {
        alert('Erro ao salvar palpite. Verifique se você já palpitou neste jogo.');
        console.error('Erro ao salvar palpite:', err);
      }
    });
  }

  podePalpitar(jogo: any): boolean {
    return jogo.data_hora_inicio > new Date();
  }

  mudarAba(aba: 'proximos' | 'extrato') {
    this.abaAtiva = aba;
  }
}