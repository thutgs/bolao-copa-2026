import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SelecoesService } from '../../core/services/selecoes.service';
import { ConfigService } from '../../core/services/config.service';
import { LoginRequest, CadastroRequest } from '../../core/models/usuario.model';
import { Selecao } from '../../core/models/selecao.model';

type AuthMode = 'login' | 'cadastro';

type SelecaoOption = { id: number; nome: string } | { id: 'outra'; nome: 'Outra (digite)' };

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private selecoesService = inject(SelecoesService);
  private configService = inject(ConfigService);
  private router = inject(Router);

  mode = signal<AuthMode>('login');

  // Contador regressivo
  countdown = signal({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  copaIniciada = signal(false);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  // Login
  loginEmail = signal('');
  loginSenha = signal('');
  mostrarSenhaLogin = signal(false);

  // Cadastro
  cadastroNome = signal('');
  cadastroEmail = signal('');
  cadastroSenha = signal('');
  cadastroConfirmarSenha = signal('');
  mostrarSenhaCadastro = signal(false);
  mostrarConfirmarSenha = signal(false);
  cadastroSelecaoId = signal<number | null>(null);
  cadastroOutraSelecao = signal('');
  mostrarOutraSelecao = signal(false);
  avatarSelecionado = signal<'masculino' | 'feminino' | null>(null);

  // Seleções mais famosas (top 30)
  selecoesPopulares: Selecao[] = [
    { id: 1, nome: 'Alemanha', grupo: 'A' },
    { id: 2, nome: 'Argentina', grupo: 'A' },
    { id: 3, nome: 'Bélgica', grupo: 'A' },
    { id: 4, nome: 'Brasil', grupo: 'A' },
    { id: 5, nome: 'Croácia', grupo: 'A' },
    { id: 6, nome: 'Dinamarca', grupo: 'B' },
    { id: 7, nome: 'Espanha', grupo: 'B' },
    { id: 8, nome: 'Estados Unidos', grupo: 'B' },
    { id: 9, nome: 'França', grupo: 'B' },
    { id: 10, nome: 'Holanda', grupo: 'C' },
    { id: 11, nome: 'Inglaterra', grupo: 'C' },
    { id: 12, nome: 'Itália', grupo: 'C' },
    { id: 13, nome: 'Japão', grupo: 'C' },
    { id: 14, nome: 'México', grupo: 'D' },
    { id: 15, nome: 'Polônia', grupo: 'D' },
    { id: 16, nome: 'Portugal', grupo: 'D' },
    { id: 17, nome: 'Coreia do Sul', grupo: 'D' },
    { id: 18, nome: 'Suíça', grupo: 'E' },
    { id: 19, nome: 'Uruguai', grupo: 'E' },
    { id: 20, nome: 'Austrália', grupo: 'E' },
    { id: 21, nome: 'Canadá', grupo: 'E' },
    { id: 22, nome: 'Chile', grupo: 'F' },
    { id: 23, nome: 'Colômbia', grupo: 'F' },
    { id: 24, nome: 'Equador', grupo: 'F' },
    { id: 25, nome: 'Marrocos', grupo: 'F' },
    { id: 26, nome: 'Senegal', grupo: 'G' },
    { id: 27, nome: 'Sérvia', grupo: 'G' },
    { id: 28, nome: 'Ucrânia', grupo: 'G' },
    { id: 29, nome: 'Turquia', grupo: 'G' },
    { id: 30, nome: 'Irã', grupo: 'H' },
    { id: 31, nome: 'Arábia Saudita', grupo: 'H' },
    { id: 32, nome: 'Outra (digite)', grupo: 'Z' }
  ];

  selecoes = signal<Selecao[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Usar seleções populares locais, não mock do service
    this.selecoes.set(this.selecoesPopulares);

    // Buscar data da Copa e iniciar contador
    this.configService.getWorldCupDate().subscribe({
      next: (config) => {
        this.startCountdown(new Date(config.startDate));
      },
      error: () => {
        // Fallback: 11/06/2026
        this.startCountdown(new Date('2026-06-11T00:00:00Z'));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(targetDate: Date): void {
    const update = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        this.copaIniciada.set(true);
        this.countdown.set({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
        }
        return;
      }

      this.countdown.set({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  onSelecaoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    if (value === 'outra') {
      this.mostrarOutraSelecao.set(true);
      this.cadastroSelecaoId.set(null);
    } else {
      this.mostrarOutraSelecao.set(false);
      this.cadastroOutraSelecao.set('');
      this.cadastroSelecaoId.set(value ? parseInt(value, 10) : null);
    }
  }

  validarOutraSelecao(): boolean {
    const nome = this.cadastroOutraSelecao().trim();
    if (!nome) {
      this.errorMessage.set('Digite o nome da seleção');
      return false;
    }
    
    // Lista de seleções válidas (aproximadamente 80 seleções FIFA)
    const selecoesValidas = [
      'afeganistão', 'áfrica do sul', 'albânia', 'alemanha', 'andorra', 'angola', 'antígua e barbuda',
      'arábia saudita', 'argélia', 'argentina', 'armênia', 'aruba', 'austrália', 'áustria', 'azerbaijão',
      'bahamas', 'bangladesh', 'barbados', 'barein', 'bélgica', 'belize', 'benim', 'bermuda', 'bielorrússia',
      'bolívia', 'bósnia e herzegovina', 'botsuana', 'brasil', 'bulgária', 'burkina faso', 'burundi',
      'butão', 'cabo verde', 'camarões', 'camboja', 'canadá', 'catar', 'cazaquistão', 'chade', 'chile',
      'china', 'chipre', 'colômbia', 'comores', 'congo', 'congo (rdc)', 'coreia do norte', 'coreia do sul',
      'costa do marfim', 'costa rica', 'croácia', 'cuba', 'curaçao', 'dinamarca', 'djibuti', 'dominica',
      'el salvador', 'emirados árabes unidos', 'equador', 'escócia', 'eslováquia', 'eslovênia', 'espanha',
      'estados unidos', 'estônia', 'etiópia', 'fiji', 'filipinas', 'finlândia', 'frança', 'gabão', 'gâmbia',
      'geórgia', 'gana', 'gibraltar', 'granada', 'grécia', 'guatemala', 'guiana', 'guiana francesa',
      'guiné', 'guiné-bissau', 'guiné equatorial', 'haiti', 'holanda', 'honduras', 'hong kong', 'hungria',
      'iêmen', 'ilhas cayman', 'ilhas cook', 'ilhas feroe', 'ilhas salomão', 'índia', 'indonésia', 'inglaterra',
      'irã', 'iraque', 'irlanda do norte', 'islândia', 'israel', 'itália', 'jamaica', 'japão', 'jordânia',
      'kiribati', 'kosovo', 'kuwait', 'laos', 'lesoto', 'letônia', 'líbano', 'libéria', 'líbia', 'liechtenstein',
      'lituania', 'luxemburgo', 'macau', 'madagascar', 'malásia', 'malawi', 'maldivas', 'mali', 'malta',
      'marrocos', 'maurício', 'mauritânia', 'méxico', 'mianmar', 'micronésia', 'moçambique', 'moldávia',
      'mônaco', 'mongólia', 'montenegro', 'namíbia', 'nepal', 'nicarágua', 'níger', 'nigéria', 'noruega',
      'nova caledônia', 'nova zelândia', 'oma', 'país de gales', 'paquistão', 'palau', 'palestina', 'panamá',
      'papua nova guiné', 'paraguai', 'peru', 'polinésia francesa', 'polônia', 'porto rico', 'portugal',
      'quênia', 'quirguistão', 'reino unido', 'república centro-africana', 'república dominicana', 'república tcheca',
      'romênia', 'ruanda', 'rússia', 'samoa', 'san marino', 'santa lúcia', 'são tomé e príncipe', 'são vicente e granadinas',
      'senegal', 'serra leoa', 'sérvia', 'singapura', 'síria', 'somália', 'sri lanka', 'sudão', 'sudão do sul',
      'suécia', 'suíça', 'suriname', 'tadjiquistão', 'tailândia', 'taiwan', 'tanzânia', 'timor-leste', 'togo',
      'tonga', 'trinidad e tobago', 'tunísia', 'turcas e caicos', 'turquia', 'turcomenistão', 'tuvalu', 'ucrânia',
      'uganda', 'uruguai', 'uzbequistão', 'vanuatu', 'vaticano', 'venezuela', 'vietnã', 'zâmbia', 'zimbábue'
    ];
    
    const nomeNormalizado = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (!selecoesValidas.includes(nomeNormalizado)) {
      this.errorMessage.set('Seleção não reconhecida. Verifique o nome digitado.');
      return false;
    }
    
    return true;
  }

  toggleMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.errorMessage.set(null);
    this.limparFormularios();
  }

  limparFormularios(): void {
    // Limpar login
    this.loginEmail.set('');
    this.loginSenha.set('');
    this.mostrarSenhaLogin.set(false);

    // Limpar cadastro
    this.cadastroNome.set('');
    this.cadastroEmail.set('');
    this.cadastroSenha.set('');
    this.cadastroConfirmarSenha.set('');
    this.mostrarSenhaCadastro.set(false);
    this.mostrarConfirmarSenha.set(false);
    this.cadastroSelecaoId.set(null);
    this.cadastroOutraSelecao.set('');
    this.mostrarOutraSelecao.set(false);
    this.avatarSelecionado.set(null);
  }

  toggleSenhaLogin(): void {
    this.mostrarSenhaLogin.update(v => !v);
  }

  toggleSenhaCadastro(): void {
    this.mostrarSenhaCadastro.update(v => !v);
  }

  toggleConfirmarSenha(): void {
    this.mostrarConfirmarSenha.update(v => !v);
  }

  selecionarAvatar(tipo: 'masculino' | 'feminino'): void {
    this.avatarSelecionado.set(tipo);
  }

  onLogin(): void {
    if (!this.loginEmail() || !this.loginSenha()) {
      this.errorMessage.set('Preencha email e senha');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: LoginRequest = {
      email: this.loginEmail(),
      senha: this.loginSenha()
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message);
      }
    });
  }

  onCadastro(): void {
    if (!this.cadastroNome() || !this.cadastroEmail() || !this.cadastroSenha()) {
      this.errorMessage.set('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.cadastroSenha().length < 8) {
      this.errorMessage.set('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (this.cadastroSenha() !== this.cadastroConfirmarSenha()) {
      this.errorMessage.set('As senhas não coincidem');
      return;
    }

    // Validar seleção "Outra" se estiver selecionada
    if (this.mostrarOutraSelecao() && !this.validarOutraSelecao()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const data: CadastroRequest = {
      nome: this.cadastroNome(),
      email: this.cadastroEmail(),
      senha: this.cadastroSenha(),
      avatar: this.avatarSelecionado() ?? 'masculino',
      id_selecao_preferida: this.cadastroSelecaoId() ?? undefined
    };

    this.authService.cadastro(data).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message);
      }
    });
  }

  compareSelecoes(s1: Selecao, s2: Selecao): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }
}
