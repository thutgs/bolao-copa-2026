import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuarioBolao } from '../boloes/entities/usuario-bolao.entity';
import { Palpite } from '../palpites/entities/palpite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Palpite, UsuarioBolao])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Adicione esta linha!
})
export class UsuariosModule {}