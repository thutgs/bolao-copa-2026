import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JogosService } from './jogos.service';
import { CreateJogoDto } from './dto/create-jogo.dto';
import { UpdateJogoDto } from './dto/update-jogo.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FinalizarJogoDto } from './dto/finalizar-jogo.dto'; 

@UseGuards(AuthGuard)
@Controller('jogos')
export class JogosController {
  constructor(private readonly jogosService: JogosService) {}

  @Post()
  create(@Body() createJogoDto: CreateJogoDto, @Request() req) {
    if (!req.usuario.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem cadastrar jogos.');
    }
    return this.jogosService.create(createJogoDto);
  }

  @Get()
  findAll() {
    return this.jogosService.findAll();
  }

  @Get('classificacao/grupos')
  getClassificacao() {
    return this.jogosService.getClassificacaoGrupos();
  }

  // Coloque esta rota ANTES do @Get(':id')
  @Get('classificacao/terceiros')
  getMelhoresTerceiros() {
    return this.jogosService.getMelhoresTerceiros();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jogosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJogoDto: UpdateJogoDto, @Request() req) {
    if (!req.usuario.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem editar jogos.');
    }
    return this.jogosService.update(+id, updateJogoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (!req.usuario.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem excluir jogos.');
    }
    return this.jogosService.remove(+id);
  }

  @Patch(':id/finalizar')
  finalizar(@Param('id') id: string, @Body() finalizarJogoDto: FinalizarJogoDto, @Request() req) {
    if (!req.usuario.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem finalizar um jogo.');
    }
    // Passamos o DTO completo para o Service
    return this.jogosService.finalizarJogo(+id, finalizarJogoDto);
  }

  // Rota de Admin para gerar a fase de mata-mata
  @Post('gerar-mata-mata')
  gerarMataMata(@Request() req) {
    if (!req.usuario.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem gerar a chave de mata-mata.');
    }
    return this.jogosService.gerarDezesseisAvos();
  }
}