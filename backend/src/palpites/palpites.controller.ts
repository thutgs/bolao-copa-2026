import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PalpitesService } from './palpites.service';
import { CreatePalpiteDto } from './dto/create-palpite.dto';
import { UpdatePalpiteDto } from './dto/update-palpite.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('palpites')
export class PalpitesController {
  constructor(private readonly palpitesService: PalpitesService) {}

  @Post()
  create(@Body() createPalpiteDto: CreatePalpiteDto, @Request() req) {
    const usuarioId = req.usuario.sub;
    return this.palpitesService.create(createPalpiteDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.palpitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.palpitesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePalpiteDto: UpdatePalpiteDto, @Request() req) {
    const usuarioId = req.usuario.sub;
    return this.palpitesService.update(+id, updatePalpiteDto, usuarioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const usuarioId = req.usuario.sub;
    return this.palpitesService.remove(+id, usuarioId);
  }
}