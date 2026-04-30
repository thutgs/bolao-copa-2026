import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { BoloesService } from './boloes.service';
import { CreateBolaoDto } from './dto/create-bolao.dto';
import { UpdateBolaoDto } from './dto/update-bolao.dto';
import { AuthGuard } from '../auth/auth.guard';
import { EntrarBolaoDto } from './dto/entrar-bolao.dto';

@UseGuards(AuthGuard)
@Controller('boloes')
export class BoloesController {
  constructor(private readonly boloesService: BoloesService) {}

  @Post()
  create(@Body() createBolaoDto: CreateBolaoDto, @Request() req) {
    const criadorId = req.usuario.sub;
    return this.boloesService.create(createBolaoDto, criadorId);
  }

  // NOVA ROTA AQUI!
  @Post('entrar')
  entrar(@Body() entrarBolaoDto: EntrarBolaoDto, @Request() req) {
    const usuarioId = req.usuario.sub; // Pega o ID de quem está tentando entrar
    return this.boloesService.entrarBolao(entrarBolaoDto.codigo_convite, usuarioId);
  }

  @Get()
  findAll() {
    return this.boloesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boloesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBolaoDto: UpdateBolaoDto, @Request() req) {
    const usuarioId = req.usuario.sub; // Pegamos quem está logado
    return this.boloesService.update(+id, updateBolaoDto, usuarioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const usuarioId = req.usuario.sub; // Pegamos quem está logado
    return this.boloesService.remove(+id, usuarioId);
  }

  @Get('codigo/:codigo')
  buscarPorCodigo(@Param('codigo') codigo: string) {
    return this.boloesService.buscarPorCodigo(codigo);
  }

  // Adicione esta rota (preferencialmente ANTES do @Get(':id') para não conflitar)
  @Get('bolao/ranking')
  getRanking(@Query('bolaoId') bolaoId: string, @Request() req) {
    const usuarioLogadoId = req.usuario.sub;
    return this.boloesService.getRanking(+bolaoId, usuarioLogadoId);
  }
}