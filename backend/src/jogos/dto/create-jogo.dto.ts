import { IsInt, IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateJogoDto {
  @IsInt()
  selecao_a_id!: number;

  @IsInt()
  selecao_b_id!: number;

  @IsDateString({}, { message: 'A data e hora devem estar no formato ISO 8601 (ex: 2026-06-11T15:00:00Z)' })
  data_hora!: string;

  // NOVO CAMPO OBRIGATÓRIO
  @IsString()
  @IsNotEmpty({ message: 'A fase do jogo não pode estar vazia (Ex: Grupo A, Oitavas).' })
  fase!: string;
}