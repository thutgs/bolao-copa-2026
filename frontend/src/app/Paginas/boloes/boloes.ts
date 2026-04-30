import { Component, OnInit, inject } from '@angular/core';
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

  listaDeBoloes: any[] = [];
  
  // Modals state
  mostrarModalCriar = false;
  mostrarModalConfirmar = false;

  // Forms
  novoBolaoNome = '';
  novoBolaoDescricao = '';
  codigoBusca = '';
  bolaoEncontrado: any = null;

  ngOnInit() {
    this.carregarMeusBoloes();
    
    // Check for Deep Link (WhatsApp)
    this.route.queryParams.subscribe(params => {
      if (params['codigo']) {
        this.codigoBusca = params['codigo'];
        this.buscarBolao();
      }
    });
  }

  carregarMeusBoloes() {
    this.boloesService.getMeusBoloes().subscribe({
      next: (dados) => this.listaDeBoloes = dados,
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
        alert('Você entrou no bolão com sucesso!');
        this.fecharModalConfirmar();
        this.carregarMeusBoloes();
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
}