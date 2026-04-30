import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; // Importação nova
import { AuthGuard } from '../auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // Substitua o GET ':id' atual por este:
  @Get(':id')
  findOne(@Param('id') id: string, @Query('stats') stats: string) {
    if (stats === 'true') {
       return this.usuariosService.getEstatisticas(+id);
    }
    return this.usuariosService.findOne(+id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}