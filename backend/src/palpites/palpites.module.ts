import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalpitesService } from './palpites.service';
import { PalpitesController } from './palpites.controller';
import { Palpite } from './entities/palpite.entity';
import { Jogo } from '../jogos/entities/jogo.entity'; // Importante para a trava de tempo!

@Module({
  imports: [TypeOrmModule.forFeature([Palpite, Jogo])],
  controllers: [PalpitesController],
  providers: [PalpitesService],
})
export class PalpitesModule {}