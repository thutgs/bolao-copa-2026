export interface Usuario {
  id: number;
  nome: string;
  email: string;
  is_global_admin: boolean;
  avatar?: 'masculino' | 'feminino';
  selecao_preferida?: {
    id: number;
    nome: string;
    url_bandeira?: string;
  };
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  avatar?: 'masculino' | 'feminino';
  id_selecao_preferida?: number;
}
