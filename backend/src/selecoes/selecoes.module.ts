import { Module } from '@nestjs/common';
import { SelecoesService } from './selecoes.service';
import { SelecoesController } from './selecoes.controller';

@Module({
  controllers: [SelecoesController],
  providers: [SelecoesService],
})
export class SelecoesModule {}
