import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JogosService } from '../../services/jogos.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent implements OnInit {
  private jogosService = inject(JogosService);

  jogos = signal<any[]>([]);
  terceirosColocados = signal<any[]>([]);

  // Sistema de Abas
  abaAtiva = signal<'resultados' | 'alocacao'>('resultados');

  // Filtros Unificados
  filtroStatus = signal<string>('todos');
  filtroFase = signal<string>('todas');
  termoBusca = signal<string>('');

  // Paginação
  paginaAtual = signal<number>(1);
  itensPorPagina = 15;

  // Extrai opções únicas para as fases e ordena alfabeticamente
  fasesDisponiveis = computed(() => {
    const fases = this.jogos().map(j => j.fase).filter(Boolean);
    return [...new Set(fases)].sort((a, b) => a.localeCompare(b));
  });

  // Lógica principal de Filtro e Busca
  jogosFiltrados = computed(() => {
    let lista = this.jogos().filter(j => j.selecao_A && j.selecao_B); // Exige times definidos

    // Filtro de Status
    if (this.filtroStatus() === 'pendentes') lista = lista.filter(j => j.status !== 'finalizado');
    if (this.filtroStatus() === 'finalizados') lista = lista.filter(j => j.status === 'finalizado');

    // Filtro de Fase Unificado (Serve para Grupos e Mata-mata)
    if (this.filtroFase() !== 'todas') lista = lista.filter(j => j.fase === this.filtroFase());

    // Busca por texto (Nome das seleções)
    const busca = this.termoBusca().toLowerCase().trim();
    if (busca) {
      lista = lista.filter(j => 
        j.selecao_A.nome.toLowerCase().includes(busca) || 
        j.selecao_B.nome.toLowerCase().includes(busca)
      );
    }

    return lista;
  });

  // Lógica de Paginação
  totalPaginas = computed(() => Math.ceil(this.jogosFiltrados().length / this.itensPorPagina));
  
  jogosPaginados = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.jogosFiltrados().slice(inicio, fim);
  });

  // Reseta a página sempre que um filtro for alterado
  atualizarFiltro() {
    this.paginaAtual.set(1);
  }

  // Filtra as vagas em aberto para a aba de alocação
  vagasAbertas = computed(() => {
    return this.jogos().filter(j => j.fase === 'Dezesseis-avos' && !j.selecao_B);
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.jogosService.getJogos().subscribe(res => this.jogos.set(res));
    this.jogosService.getMelhoresTerceiros().subscribe(res => {
      this.terceirosColocados.set(res.slice(0, 8));
    });
  }

  gerarMataMata() {
    if(confirm('Tem certeza? Isso irá montar a base da chave de mata-mata.')) {
      this.jogosService.gerarMataMata().subscribe(() => {
        alert('Chave gerada com sucesso!');
        this.carregarDados();
      });
    }
  }

  salvarResultado(jogo: any, golsA: string, golsB: string, penaltisId: string) {
    if (!golsA || !golsB) return alert('Preencha os dois placares.');
    
    this.jogosService.finalizarJogo(jogo.id, +golsA, +golsB, penaltisId ? +penaltisId : undefined)
      .subscribe({
        next: () => {
          alert('Jogo salvo com sucesso!');
          this.carregarDados();
        },
        error: () => alert('Erro ao finalizar jogo.')
      });
  }

  alocarVaga(jogoId: number, selecaoBId: string) {
    if(!selecaoBId) return;
    this.jogosService.alocarTerceiro(jogoId, +selecaoBId).subscribe(() => {
      alert('Vaga alocada com sucesso!');
      this.carregarDados();
    });
  }
}