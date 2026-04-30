import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JogosService } from '../../services/jogos.service';

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela.html'
})
export class TabelaComponent implements OnInit {
  private jogosService = inject(JogosService);

  abaAtiva = signal<'grupos' | 'eliminatorias'>('grupos');
  classificacaoCrua = signal<any[]>([]);
  melhoresTerceiros = signal<any[]>([]);
  jogosEliminatorias = signal<any[]>([]);

  // Array ordenado dos grupos para o @for manter a ordem exata do A ao L
  letrasGrupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  tabelasPorGrupo = computed(() => {
    const dados = this.classificacaoCrua();
    const agrupado: Record<string, any[]> = {};
    dados.forEach(time => {
      if (!agrupado[time.grupo]) agrupado[time.grupo] = [];
      agrupado[time.grupo].push(time);
    });
    return agrupado;
  });

  // Array com a ordem exata das fases para renderizar as colunas da esquerda para a direita
  ordemFases = ['Dezesseis-avos', 'Oitavas de final', 'Quartas de final', 'Semifinal', 'Final'];

  // Agrupa os jogos eliminatórios oficiais que já vieram do banco
  chaveamentoPorFase = computed(() => {
    const jogos = this.jogosEliminatorias();
    const agrupado: Record<string, any[]> = {
      'Dezesseis-avos': [],
      'Oitavas de final': [],
      'Quartas de final': [],
      'Semifinal': [],
      'Final': []
    };
    
    jogos.forEach(jogo => {
      if (agrupado[jogo.fase]) {
        agrupado[jogo.fase].push(jogo);
      }
    });
    return agrupado;
  });

  // Gera uma projeção em tempo real baseada nos líderes atuais dos grupos
  dezesseisAvosProjetados = computed(() => {
    const grupos = this.tabelasPorGrupo();
    const terceiros = this.melhoresTerceiros();
    
    if (Object.keys(grupos).length === 0) return [];

    type ReferenciaSelecao =
      | { pos: number; grp: string; lbl: string }
      | { pos: 2; idx: number; lbl: string };

    const isTerceiro = (ref: ReferenciaSelecao): ref is { pos: 2; idx: number; lbl: string } => {
      return ref.pos === 2;
    };

    const confrontosMock: Array<{ a: ReferenciaSelecao; b: ReferenciaSelecao }> = [
      { a: { pos: 0, grp: 'A', lbl: '1º A' }, b: { pos: 1, grp: 'C', lbl: '2º C' } },
      { a: { pos: 0, grp: 'B', lbl: '1º B' }, b: { pos: 2, idx: 0, lbl: '3º Mel. 1' } },
      { a: { pos: 0, grp: 'C', lbl: '1º C' }, b: { pos: 1, grp: 'F', lbl: '2º F' } },
      { a: { pos: 0, grp: 'D', lbl: '1º D' }, b: { pos: 1, grp: 'E', lbl: '2º E' } },
      { a: { pos: 0, grp: 'E', lbl: '1º E' }, b: { pos: 1, grp: 'G', lbl: '2º G' } },
      { a: { pos: 0, grp: 'F', lbl: '1º F' }, b: { pos: 2, idx: 1, lbl: '3º Mel. 2' } },
      { a: { pos: 0, grp: 'G', lbl: '1º G' }, b: { pos: 1, grp: 'I', lbl: '2º I' } },
      { a: { pos: 0, grp: 'H', lbl: '1º H' }, b: { pos: 2, idx: 2, lbl: '3º Mel. 3' } },
      { a: { pos: 0, grp: 'I', lbl: '1º I' }, b: { pos: 2, idx: 3, lbl: '3º Mel. 4' } },
      { a: { pos: 0, grp: 'J', lbl: '1º J' }, b: { pos: 2, idx: 4, lbl: '3º Mel. 5' } },
      { a: { pos: 0, grp: 'K', lbl: '1º K' }, b: { pos: 2, idx: 5, lbl: '3º Mel. 6' } },
      { a: { pos: 0, grp: 'L', lbl: '1º L' }, b: { pos: 2, idx: 6, lbl: '3º Mel. 7' } },
      { a: { pos: 1, grp: 'A', lbl: '2º A' }, b: { pos: 1, grp: 'B', lbl: '2º B' } },
      { a: { pos: 1, grp: 'D', lbl: '2º D' }, b: { pos: 1, grp: 'H', lbl: '2º H' } },
      { a: { pos: 1, grp: 'J', lbl: '2º J' }, b: { pos: 1, grp: 'K', lbl: '2º K' } },
      { a: { pos: 1, grp: 'L', lbl: '2º L' }, b: { pos: 2, idx: 7, lbl: '3º Mel. 8' } }
    ];

    return confrontosMock.map((c, i) => {
      const timeA = isTerceiro(c.a) ? terceiros[c.a.idx] : (grupos[c.a.grp] ? grupos[c.a.grp][c.a.pos] : null);
      const timeB = isTerceiro(c.b) ? terceiros[c.b.idx] : (grupos[c.b.grp] ? grupos[c.b.grp][c.b.pos] : null);

      return {
        id: `Proj-${i + 1}`,
        isParcial: true,
        selecao_A: timeA,
        selecao_B: timeB,
        placeholder_A: c.a.lbl,
        placeholder_B: c.b.lbl
      };
    });
  });

  // GERA A ÁRVORE COMPLETA (Oficiais + Projeções + Placeholders Futuros)
// GERA A ÁRVORE COMPLETA
  estruturaMataMata = computed(() => {
    const oficiais = this.chaveamentoPorFase();
    const arvore: Record<string, any[]> = {};
    
    const configFases = [
      { nome: 'Dezesseis-avos', qtd: 16, prev: '' },
      // Usamos o nome visual completo do placeholders: 'Venc. Segunda Fase '
      { nome: 'Oitavas de final', qtd: 8, prev: 'Segunda Fase ' }, 
      { nome: 'Quartas de final', qtd: 4, prev: 'Oitavas ' },
      { nome: 'Semifinal', qtd: 2, prev: 'Quartas ' },
      { nome: 'Final', qtd: 1, prev: 'Semi ' }
    ];

    configFases.forEach(fase => {
      if (oficiais[fase.nome] && oficiais[fase.nome].length > 0) {
        arvore[fase.nome] = oficiais[fase.nome];
      } else if (fase.nome === 'Dezesseis-avos') {
        arvore[fase.nome] = this.dezesseisAvosProjetados();
      } else {
        const placeholders = [];
        for (let i = 0; i < fase.qtd; i++) {
          placeholders.push({
            id: `PH-${fase.nome}-${i}`,
            isPlaceholder: true,
            // Texto do placeholder completo, como sugerido: 'Venc. Segunda Fase 1'
            placeholder_A: `Venc. ${fase.prev}${ (i * 2) + 1 }`,
            placeholder_B: `Venc. ${fase.prev}${ (i * 2) + 2 }`
          });
        }
        arvore[fase.nome] = placeholders;
      }
    });

    return arvore;
  });

  // Funções para traduzir o nome do banco para a UI
  getNomeFaseVisual(fase: string): string {
    if (fase === 'Dezesseis-avos') return 'Segunda Fase';
    return fase;
  }

  getShortNomeFase(fase: string): string {
    if (fase === 'Dezesseis-avos') return 'Segunda Fase';
    if (fase === 'Oitavas de final') return 'Oitavas';
    if (fase === 'Quartas de final') return 'Quartas';
    if (fase === 'Semifinal') return 'Semi';
    return fase;
  }

  // Extrai os IDs dos 8 melhores terceiros para podermos pintá-los de verde na fase de grupos
  idsTerceirosClassificados = computed(() => {
    return this.melhoresTerceiros().slice(0, 8).map(t => t.id);
  });
  
  ngOnInit() {
    this.carregarDados();
  }

  // Retorna quantas linhas do Grid cada fase deve ocupar para a matemática ficar perfeita
  getSpan(fase: string): number {
    switch (fase) {
      case 'Dezesseis-avos': return 1;
      case 'Oitavas de final': return 2;
      case 'Quartas de final': return 4;
      case 'Semifinal': return 8;
      case 'Final': return 16;
      default: return 1;
    }
  }

  carregarDados() {
    this.jogosService.getClassificacaoGrupos().subscribe(dados => this.classificacaoCrua.set(dados));
    this.jogosService.getMelhoresTerceiros().subscribe(dados => this.melhoresTerceiros.set(dados));
    this.jogosService.getJogos().subscribe(jogos => {
      this.jogosEliminatorias.set(jogos.filter(j => j.fase !== 'Fase de Grupos' && !j.fase.includes('Grupo')));
    });
  }
}