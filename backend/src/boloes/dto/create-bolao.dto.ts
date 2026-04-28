import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateBolaoDto {
  @IsString()
  @MaxLength(100)
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}