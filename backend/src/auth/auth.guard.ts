import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Acesso negado. Nenhum token foi fornecido.');
    }
    
    try {
      // Tenta abrir o token com a nossa chave mestra
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'CHAVE_SECRETA_SUPER_SEGURA_DO_BOLAO_2026', // Tem que ser a mesma chave do auth.module.ts
      });
      
      // Se deu certo, penduramos os dados do usuário na requisição.
      // Assim, qualquer rota protegida vai saber exatamente QUEM está fazendo a requisição.
      request['usuario'] = payload;
    } catch {
      throw new UnauthorizedException('Acesso negado. Token inválido ou expirado.');
    }
    
    return true; // Catraca liberada!
  }

  // Função auxiliar para pegar o token que vem no formato "Bearer ashd123..."
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}