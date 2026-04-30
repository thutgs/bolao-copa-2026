import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { BoloesModule } from './boloes/boloes.module';
import { SelecoesModule } from './selecoes/selecoes.module';
import { JogosModule } from './jogos/jogos.module';
import { PalpitesModule } from './palpites/palpites.module';
import { AuthModule } from './auth/auth.module';
import { PostgresDriver } from 'typeorm/browser/platform/BrowserDisabledDriversDummy.js';

@Module({
  imports: [
    // 1. Carrega as variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Configura o TypeORM com o PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, 
      username: 'postgres',
      password: '',
      database:'bolao_copa_2026',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // APENAS PARA DESENVOLVIMENTO: cria as tabelas automaticamente
    }),
    UsuariosModule,
    BoloesModule,
    SelecoesModule,
    JogosModule,
    PalpitesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}