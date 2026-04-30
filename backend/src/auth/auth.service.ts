import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async login(email: string, senhaPlana: string) {
    // 1. Busca o usuário pelo e-mail (precisamos criar esse método no UsuariosService em seguida)
    const usuario = await this.usuariosService.findByEmail(email);
    
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 2. Compara a senha digitada no login com o Hash salvo no banco
    const senhaValida = await bcrypt.compare(senhaPlana, usuario.senha_hash);
    
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Senha correta! Monta o "crachá" (Payload) do usuário
    const payload = { 
      sub: usuario.id, 
      email: usuario.email, 
      nome: usuario.nome,
      isAdmin: usuario.is_global_admin,
      avatar: usuario.avatar 
    };

    // 4. Retorna o Token JWT
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: payload // Mandamos os dados básicos pro front-end exibir o nome dele na tela
    };
  }
}