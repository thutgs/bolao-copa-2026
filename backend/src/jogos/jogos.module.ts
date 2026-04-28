import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JogosService } from './jogos.service';
import { JogosController } from './jogos.controller';
import { Jogo } from './entities/jogo.entity';
import { Selecao } from '../selecoes/entities/selecao.entity';
// Novas importações:
import { Palpite } from '../palpites/entities/palpite.entity';
import { UsuarioBolao } from '../boloes/entities/usuario-bolao.entity';

@Module({
  // Adicione Palpite e UsuarioBolao no array do forFeature
  imports: [TypeOrmModule.forFeature([Jogo, Selecao, Palpite, UsuarioBolao])],
  controllers: [JogosController],
  providers: [JogosService],
})
export class JogosModule {}