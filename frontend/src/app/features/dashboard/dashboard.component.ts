import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DonutChartComponent, DonutChartData } from '../../shared/donut-chart/donut-chart.component';
import { AuthService } from '../../core/services/auth.service';
import { MatchesService, Match } from '../../core/services/matches.service';

// Models
interface Jogo {
  id: number;
  teamA: string;
  teamB: string;
  flagAUrl: string;
  flagBUrl: string;
  date: string;
  time: string;
  estadio: string;
  placarA?: number;
  placarB?: number;
  status: 'futuro' | 'iniciado' | 'finalizado';
  // Campos para compatibilidade com template atual
  selecaoA: string;
  selecaoB: string;
  bandeiraA: string;
  bandeiraB: string;
  data: string;
  hora: string;
}

interface RankingItem {
  posicao: number;
  nome: string;
  pontos: number;
  totalPalpites: number; // Nova propriedade
  acertosExatos: number; // Nova propriedade
  isUsuario: boolean;
}

interface Bolao {
  id: number;
  nome: string;
  participantes: number;
}

interface Usuario {
  nome: string;
  pontos: number;
  posicao: number;
  acertosExatos: number;
  avatar?: 'masculino' | 'feminino';
  acertosTendencia: number;
  erros: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DonutChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private matchesService = inject(MatchesService);

  private readonly API_URL = 'http://localhost:3000';

  private readonly isMockMode = false;

  // Estado principal
  bolaoSelecionado = signal<number>(1);
  jogos = signal<Jogo[]>([]);
  ranking = signal<RankingItem[]>([]);
  usuario = signal<Usuario | null>(null);
  boloes = signal<Bolao[]>([]);
  isLoading = signal(true);
  mostrarRankingModal = signal(false);

  // Computed values
  saudacao = computed(() => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  aproveitamento = computed(() => {
    const user = this.usuario();
    if (!user) return 0;
    const totalAcertos = user.acertosExatos + user.acertosTendencia;
    return Math.round((totalAcertos / user.total) * 100);
  });

  bolaoAtual = computed(() => {
    return this.boloes().find(b => b.id === this.bolaoSelecionado()) || this.boloes()[0];
  });

  donutChartData = computed<DonutChartData>(() => {
    const user = this.usuario();
    if (!user) {
      return { acertosExatos: 0, acertosTendencia: 0, erros: 0 };
    }
    return {
      acertosExatos: user.acertosExatos,
      acertosTendencia: user.acertosTendencia,
      erros: user.erros
    };
  });

  mediaBolao = computed(() => {
    const r = this.ranking();
    if (r.length === 0) return 0;
    const total = r.reduce((acc, item) => acc + item.pontos, 0);
    return total / r.length;
  });

  feedbackDesempenho = computed(() => {
    const user = this.usuario();
    if (!user) return null;
    const media = this.mediaBolao();
    if (user.pontos > media) {
      return { status: 'acima', texto: 'Você está acima da média do bolão!', corTexto: 'text-[#b3ca45]', corBg: 'bg-[#b3ca45]/10' };
    } else if (user.pontos < media) {
      return { status: 'abaixo', texto: 'Você está abaixo da média, hora de reagir!', corTexto: 'text-red-500', corBg: 'bg-red-50' };
    } else {
      return { status: 'media', texto: 'Você está na média do bolão, continue evoluindo!', corTexto: 'text-orange-500', corBg: 'bg-orange-50' };
    }
  });

  temJogosPendentes = computed(() => {
    return this.jogos().some(j => j.status === 'futuro');
  });

  ngOnInit(): void {
    this.carregarDados();
  }

  async carregarDados(): Promise<void> {
    this.isLoading.set(true);

    try {
      // 1º PASSO: Carrega os bolões que o usuário participa PRIMEIRO
      await this.carregarBoloes();

      // Pega a lista de bolões que acabou de chegar do banco
      const listaBoloes = this.boloes();

      // Se a lista não estiver vazia, garante que o ID selecionado é válido
      if (listaBoloes.length > 0) {
        // Verifica se o bolão atualmente selecionado (ex: 1) existe na lista real
        const bolaoValido = listaBoloes.find(b => b.id === this.bolaoSelecionado());
        
        // Se não existir, forçamos o signal a usar o ID do primeiro bolão do banco (o seu ID 3)
        if (!bolaoValido) {
          this.bolaoSelecionado.set(listaBoloes[0].id);
        }
      }

      // 2º PASSO: AGORA SIM! Com o ID correto (3) no signal, buscamos o resto
      await Promise.all([
        this.carregarJogos(),
        this.carregarRanking(),
        this.carregarUsuario()
      ]);

    } catch (error) {
      console.error('Erro no carregamento do dashboard:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  carregarDadosMock(): void {
    // Método removido - usando apenas API real
    this.isLoading.set(false);
  }

  carregarBoloes(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<Bolao[]>(`${this.API_URL}/boloes`).subscribe({
        next: (boloes) => {
          this.boloes.set(boloes);
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar bolões:', error);
          this.boloes.set([]);
          resolve();
        }
      });
    });
  }

  carregarJogos(): Promise<void> {
    return new Promise((resolve) => {
      this.matchesService.getNextMatches(4).subscribe({
        next: (jogos) => {
          const jogosMapeados = jogos.map(jogo => ({
            ...jogo,
            selecaoA: jogo.teamA,
            selecaoB: jogo.teamB,
            bandeiraA: jogo.flagAUrl,
            bandeiraB: jogo.flagBUrl,
            data: jogo.date,
            hora: jogo.time,
            status: jogo.status === 'pendente' ? 'futuro' as const : jogo.status === 'finalizado' ? 'finalizado' as const : 'iniciado' as const
          }));
          this.jogos.set(jogosMapeados);
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar jogos:', error);
          this.jogos.set([]);
          resolve();
        }
      });
    });
  }

  carregarRanking(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<RankingItem[]>(`${this.API_URL}/boloes/bolao/ranking?bolaoId=${this.bolaoSelecionado()}`).subscribe({
        next: (ranking) => {
          this.ranking.set(ranking);
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar ranking:', error);
          this.ranking.set([]);
          resolve();
        }
      });
    });
  }

  carregarUsuario(): Promise<void> {
    return new Promise((resolve) => {
      const currentUser = this.authService.getUser();
      if (!currentUser) {
        this.usuario.set(null);
        resolve();
        return;
      }

      this.http.get<Usuario>(`${this.API_URL}/usuarios/${currentUser.id}?stats=true`).subscribe({
        next: (usuario) => {
          // Garante que o avatar existe puxando do próprio storage do AuthService
          const tempAvatar = localStorage.getItem('temp_avatar') as 'masculino' | 'feminino' | null;
          const avatarToUse = usuario.avatar || currentUser.avatar || tempAvatar || 'masculino';
          this.usuario.set({...usuario, avatar: avatarToUse});
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar usuário:', error);
          this.usuario.set(null);
          resolve();
        }
      });
    });
  }

  selecionarBolao(id: number): void {
    this.bolaoSelecionado.set(id);
    this.carregarDados();
  }

  fazerPalpite(jogoId: number): void {
    // Navegar para tela de palpites
    this.router.navigate(['/palpites', jogoId]);
  }

  verTodosJogos(): void {
    // Navegar para tela de todos os jogos
    this.router.navigate(['/jogos']);
  }

  getMedalha(posicao: number): string {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return '';
  }

  getTempoParaJogo(data: string, hora: string): string {
    const jogoDate = new Date(`${data}T${hora}`);
    const agora = new Date();
    const diff = jogoDate.getTime() - agora.getTime();

    if (diff < 0) return 'Em andamento';

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (dias > 0) {
      return `Começa em ${dias}d ${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `Começa em ${horas}h ${minutos}min`;
    } else {
      return `Começa em ${minutos}min`;
    }
  }

  formatarDataJogo(data: string, hora: string): string {
    const jogoDate = new Date(`${data}T${hora}`);
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dia = jogoDate.getDate();
    const mes = meses[jogoDate.getMonth()];
    const horaFormatada = jogoDate.getHours().toString().padStart(2, '0');
    const minutoFormatado = jogoDate.getMinutes().toString().padStart(2, '0');
    return `${dia} ${mes} - ${horaFormatada}:${minutoFormatado}`;
  }

  formatarDia(data: string): string {
    if (!data) return '';
    return new Date(`${data}T00:00:00`).getDate().toString().padStart(2, '0');
  }

  formatarMes(data: string): string {
    if (!data) return '';
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return meses[new Date(`${data}T00:00:00`).getMonth()];
  }

  formatarApenasHora(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5); // "16:00:00" -> "16:00"
  }

  getSigla(nome: string): string {
    const siglas: { [key: string]: string } = {
      'Brasil': 'BRA',
      'Alemanha': 'GER',
      'Argentina': 'ARG',
      'França': 'FRA',
      'Espanha': 'ESP',
      'Inglaterra': 'ENG',
      'Itália': 'ITA',
      'Portugal': 'POR',
      'Holanda': 'NED',
      'Bélgica': 'BEL',
      'Croácia': 'CRO',
      'Uruguai': 'URU',
      'México': 'MEX',
      'Estados Unidos': 'USA',
      'Japão': 'JPN',
      'Coreia do Sul': 'KOR',
      'Austrália': 'AUS',
      'Suíça': 'SUI',
      'Polônia': 'POL',
      'Senegal': 'SEN',
      'Marrocos': 'MAR',
      'Arábia Saudita': 'KSA',
      'Irã': 'IRN',
      'Tunísia': 'TUN',
      'Gana': 'GHA',
      'Camarões': 'CMR',
      'Sérvia': 'SRB',
      'Equador': 'ECU',
      'Qatar': 'QAT',
      'Canadá': 'CAN',
      'Costa Rica': 'CRC',
      'Gales': 'WAL',
      'Dinamarca': 'DEN'
    };
    return siglas[nome] || nome.substring(0, 3).toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('user_id');
    this.router.navigate(['/auth']);
  }
}
