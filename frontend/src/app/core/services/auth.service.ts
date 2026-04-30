import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { Usuario, LoginRequest, CadastroRequest } from '../models/usuario.model';

interface LoginResponse {
  access_token: string;
  usuario: {
    sub: number;
    email: string;
    nome: string;
    isAdmin: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user_data';

  currentUser = signal<Usuario | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkStoredUser();
  }

  private checkStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        // Salvar o token JWT
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        
        // Avatar do backend ou do cache local do cadastro
        const tempAvatar = localStorage.getItem('temp_avatar') as 'masculino' | 'feminino' | null;
        
        // Criar objeto Usuario a partir da resposta
        const user: Usuario = {
          id: response.usuario.sub,
          email: response.usuario.email,
          nome: response.usuario.nome,
          is_global_admin: response.usuario.isAdmin,
          avatar: (response.usuario as any).avatar || tempAvatar || 'masculino'
        };
        
        // Salvar dados do usuário
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
      catchError((error: { error?: { message?: string } }) => {
        return throwError(() => new Error(error.error?.message || 'Erro ao fazer login'));
      })
    );
  }

  cadastro(data: CadastroRequest): Observable<LoginResponse> {
    return this.http.post<Usuario>(`${this.API_URL}/usuarios`, {
      nome: data.nome,
      email: data.email,
      senha_hash: data.senha,
      avatar: data.avatar,
      id_selecao_preferida: data.id_selecao_preferida
    }).pipe(
      switchMap((user: Usuario) => {
        // Após cadastro, fazer login automático e aguardar a conclusão
        return this.login({ email: data.email, senha: data.senha });
      }),
      catchError((error: { error?: { message?: string } }) => {
        return throwError(() => new Error(error.error?.message || 'Erro ao criar conta'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): Usuario | null {
    return this.currentUser();
  }
}
