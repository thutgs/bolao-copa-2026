import { PartialType } from '@nestjs/mapped-types';
import { CreateSelecoeDto } from './create-selecoe.dto';

export class UpdateSelecoeDto extends PartialType(CreateSelecoeDto) {}
