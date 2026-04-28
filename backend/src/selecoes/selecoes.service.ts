import { Injectable } from '@nestjs/common';
import { CreateSelecoeDto } from './dto/create-selecoe.dto';
import { UpdateSelecoeDto } from './dto/update-selecoe.dto';

@Injectable()
export class SelecoesService {
  create(createSelecoeDto: CreateSelecoeDto) {
    return 'This action adds a new selecoe';
  }

  findAll() {
    return `This action returns all selecoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} selecoe`;
  }

  update(id: number, updateSelecoeDto: UpdateSelecoeDto) {
    return `This action updates a #${id} selecoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} selecoe`;
  }
}
