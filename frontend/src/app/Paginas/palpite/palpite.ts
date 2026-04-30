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
  todosOsJogos: any[] = [];
  jogosComPalpite: Set<number> = new Set(); // Guarda os IDs dos jogos já palpitados

  ngOnInit(): void {
    this.palpiteService.games$.subscribe(dados => {
      if (dados && dados.length > 0) {
        this.todosOsJogos = dados; // <-- ADICIONE ESTA LINHA
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
          const dataFormatada = dataHora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
          const horaFormatada = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          return {
            id: jogo.id,
            timeA: jogo.selecao_A?.nome || 'A definir',
            siglaA: jogo.selecao_A?.nome?.substring(0, 3).toUpperCase() || 'XXX',
            bandeiraA: jogo.selecao_A?.url_bandeira || 'https://via.placeholder.com/60',
            timeB: jogo.selecao_B?.nome || 'A definir',
            siglaB: jogo.selecao_B?.nome?.substring(0, 3).toUpperCase() || 'XXX',
            bandeiraB: jogo.selecao_B?.url_bandeira || 'https://via.placeholder.com/60',
            data: `${dataFormatada} • ${horaFormatada}`,
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

      // Limpa os jogos que já tem palpite
      this.filtrarJogos();
    } catch (error) {
      console.error('Erro crítico no mapeamento de jogos:', error);
    }
  }

  carregarExtrato() {
    this.palpiteService.getPalpites().subscribe({
      next: (dados) => {
        this.jogosComPalpite = new Set(dados.map(p => p.jogo?.id));

        this.meuExtrato = dados.map(palpite => {
          const jogoCompleto = this.todosOsJogos.find(j => j.id === palpite.jogo?.id);
          const selecaoA = jogoCompleto?.selecao_A || palpite.jogo?.selecao_A;
          const selecaoB = jogoCompleto?.selecao_B || palpite.jogo?.selecao_B;
          const dataJogo = jogoCompleto?.data_hora_inicio || palpite.jogo?.data_hora_inicio;
          
          // NOVA LÓGICA: Verifica se o jogo é no futuro
          const isPendente = dataJogo ? new Date(dataJogo) > new Date() : false;

          return {
            id: palpite.id,
            jogo: palpite.jogo,
            data: dataJogo ? new Date(dataJogo).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase() + ' • ' + new Date(dataJogo).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
            timeA: selecaoA?.nome || 'A definir',
            timeB: selecaoB?.nome || 'A definir',
            siglaA: selecaoA?.nome?.substring(0, 3).toUpperCase() || 'XXX',
            siglaB: selecaoB?.nome?.substring(0, 3).toUpperCase() || 'XXX',
            bandeiraA: selecaoA?.url_bandeira || 'https://via.placeholder.com/60',
            bandeiraB: selecaoB?.url_bandeira || 'https://via.placeholder.com/60',
            golsAReal: jogoCompleto?.gols_A_real !== undefined ? jogoCompleto?.gols_A_real : palpite.jogo?.gols_A_real,
            golsBReal: jogoCompleto?.gols_B_real !== undefined ? jogoCompleto?.gols_B_real : palpite.jogo?.gols_B_real,
            palpiteA: palpite.gols_A_palpite,
            palpiteB: palpite.gols_B_palpite,
            pontos: palpite.pontos_obtidos,
            // NOVAS VARIÁVEIS PARA A EDIÇÃO:
            isPendente: isPendente,
            editando: false, 
            novoPalpiteA: palpite.gols_A_palpite,
            novoPalpiteB: palpite.gols_B_palpite
          };
        });

        this.filtrarJogos();
      },
      error: (err) => console.error('Erro ao carregar extrato:', err)
    });
  }

  filtrarJogos() {
    if (this.listaDeJogos && this.jogosComPalpite) {
      // Deixa na lista apenas os jogos cujo ID NÃO está na lista de palpitados
      this.listaDeJogos = this.listaDeJogos.filter(jogo => !this.jogosComPalpite.has(jogo.id));
    }
  }

  salvarPalpite(jogo: any) {
    if (jogo.palpiteA == null || jogo.palpiteB == null || jogo.palpiteA === '' || jogo.palpiteB === '') {
      alert('Por favor, preencha os dois campos do placar.');
      return;
    }
    
    const palpiteDto = {
      jogo_id: jogo.id,
      gols_A_palpite: Number(jogo.palpiteA),
      gols_B_palpite: Number(jogo.palpiteB)
    };

    this.palpiteService.salvarPalpite(palpiteDto).subscribe({
      next: () => {
        alert('Palpite salvo com sucesso!');
        // Recarregar o extrato fará com que o novo jogo seja adicionado lá e ocultado daqui automaticamente
        this.carregarExtrato(); 
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

  salvarEdicao(palpite: any) {
    const palpiteDto = {
      gols_A_palpite: Number(palpite.novoPalpiteA),
      gols_B_palpite: Number(palpite.novoPalpiteB)
    };

    this.palpiteService.atualizarPalpite(palpite.id, palpiteDto).subscribe({
      next: () => {
        // Atualiza a tela com os novos valores e fecha a edição
        palpite.palpiteA = palpite.novoPalpiteA;
        palpite.palpiteB = palpite.novoPalpiteB;
        palpite.editando = false;
      },
      error: (err) => {
        alert('Erro ao atualizar palpite. Verifique o servidor.');
        console.error('Erro na edição:', err);
      }
    });
  }
}