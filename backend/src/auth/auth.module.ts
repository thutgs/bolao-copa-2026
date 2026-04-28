import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module'; // Importa o módulo de usuários

@Module({
  imports: [
    UsuariosModule,
    // Configura o gerador de Tokens
    JwtModule.register({
      global: true,
      secret: 'CHAVE_SECRETA_SUPER_SEGURA_DO_BOLAO_2026', // Em produção, isso iria para o .env!
      signOptions: { expiresIn: '12h' }, // O usuário é deslogado após 12 horas
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}