import { IsString, Length } from 'class-validator';

export class EntrarBolaoDto {
  @IsString()
  @Length(6, 6, { message: 'O código de convite deve ter exatamente 6 caracteres.' })
  codigo_convite!: string;
}