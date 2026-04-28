import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoloesService } from './boloes.service';
import { BoloesController } from './boloes.controller';
import { Bolao } from './entities/bolao.entity';
import { UsuarioBolao } from './entities/usuario-bolao.entity'; // A nossa tabela pivô

@Module({
  imports: [TypeOrmModule.forFeature([Bolao, UsuarioBolao])],
  controllers: [BoloesController],
  providers: [BoloesService],
})
export class BoloesModule {}