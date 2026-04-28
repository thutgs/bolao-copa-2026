import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SelecoesService } from './selecoes.service';
import { CreateSelecoeDto } from './dto/create-selecoe.dto';
import { UpdateSelecoeDto } from './dto/update-selecoe.dto';

@Controller('selecoes')
export class SelecoesController {
  constructor(private readonly selecoesService: SelecoesService) {}

  @Post()
  create(@Body() createSelecoeDto: CreateSelecoeDto) {
    return this.selecoesService.create(createSelecoeDto);
  }

  @Get()
  findAll() {
    return this.selecoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.selecoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSelecoeDto: UpdateSelecoeDto) {
    return this.selecoesService.update(+id, updateSelecoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.selecoesService.remove(+id);
  }
}
