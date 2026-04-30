import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BoloesService } from '../../services/boloes.service';

@Component({
  selector: 'app-boloes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boloes.html',
  styleUrls: ['./boloes.scss']
})
export class BoloesComponent implements OnInit {
  private boloesService = inject(BoloesService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  listaDeBoloes: any[] = [];
  
  // Modals state
  mostrarModalCriar = false;
  mostrarModalConfirmar = false;
  mostrarModalRanking = false;
  menuAbertoId: number | null = null;
  rankingAtual: any[] = [];
  bolaoSelecionadoNome = '';

  // Forms
  novoBolaoNome = '';
  novoBolaoDescricao = '';
  codigoBusca = '';
  bolaoEncontrado: any = null;
  sucessoEntrada = false;

  ngOnInit() {
    this.carregarMeusBoloes();
    
    this.route.queryParams.subscribe(params => {
      if (params['codigo']) {
        this.codigoBusca = params['codigo'];
        this.buscarBolao();
      }
    });
  }

  carregarMeusBoloes() {
    this.boloesService.getMeusBoloes().subscribe({
      next: (dados) => {
        this.listaDeBoloes = dados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar bolões', err)
    });
  }

  abrirModalCriar() {
    this.mostrarModalCriar = true;
  }

  fecharModalCriar() {
    this.mostrarModalCriar = false;
    this.novoBolaoNome = '';
    this.novoBolaoDescricao = '';
    this.cdr.detectChanges();
  }

  criarBolao() {
    if (!this.novoBolaoNome.trim()) return;
    
    this.boloesService.criarBolao({ nome: this.novoBolaoNome, descricao: this.novoBolaoDescricao }).subscribe({
      next: () => {
        alert('Bolão criado com sucesso!');
        this.fecharModalCriar();
        this.carregarMeusBoloes();
      },
      error: (err) => console.error('Erro ao criar bolão', err)
    });
  }

  buscarBolao() {
    if (!this.codigoBusca.trim()) return;

    this.boloesService.buscarPorCodigo(this.codigoBusca).subscribe({
      next: (bolao) => {
        this.bolaoEncontrado = bolao;
        this.mostrarModalConfirmar = true;
      },
      error: (err) => {
        alert('Bolão não encontrado ou código inválido.');
        console.error(err);
      }
    });
  }

  fecharModalConfirmar() {
    this.mostrarModalConfirmar = false;
    this.bolaoEncontrado = null;
    this.codigoBusca = '';
  }

  entrarNoBolao() {
    if (!this.bolaoEncontrado) return;

    this.boloesService.entrarBolao(this.bolaoEncontrado.codigo_convite).subscribe({
      next: () => {
        this.sucessoEntrada = true;
        this.cdr.detectChanges();
        
        // Espera 2 segundos para o usuário ver a mensagem e depois fecha
        setTimeout(() => {
          this.fecharModalConfirmar();
          this.carregarMeusBoloes();
          this.sucessoEntrada = false;
        }, 2000);
      },
      error: (err) => console.error('Erro ao entrar no bolão', err)
    });
  }

  copiarCodigo(codigo: string) {
    navigator.clipboard.writeText(codigo).then(() => {
      alert('Código copiado!');
    });
  }

  compartilharWhatsApp(codigo: string) {
    const url = `http://localhost:4200/boloes?codigo=${codigo}`;
    const texto = `Vem participar do meu bolão da Copa 2026! Clique no link: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  }

  deletarBolao(id: number) {
    if (confirm('Tem certeza que deseja excluir este bolão? Esta ação não pode ser desfeita.')) {
      this.boloesService.deletarBolao(id).subscribe({
        next: () => {
          this.listaDeBoloes = this.listaDeBoloes.filter(b => b.id !== id);
          this.menuAbertoId = null;
          this.cdr.detectChanges();
          alert('Bolão excluído com sucesso!');
        },
        error: (err) => {
          alert('Erro ao excluir bolão. Verifique se você é o administrador.');
          console.error(err);
        }
      });
    }
  }

  toggleMenu(id: number, event: Event) {
    event.stopPropagation();
    this.menuAbertoId = this.menuAbertoId === id ? null : id;
  }

  verRanking(bolao: any) {
    this.bolaoSelecionadoNome = bolao.nome;
    this.boloesService.getRanking(bolao.id).subscribe({
      next: (dados) => {
        this.rankingAtual = dados;
        this.mostrarModalRanking = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Erro ao carregar ranking.');
        console.error(err);
      }
    });
  }

  fecharModalRanking() {
    this.mostrarModalRanking = false;
    this.rankingAtual = [];
    this.bolaoSelecionadoNome = '';
  }
}