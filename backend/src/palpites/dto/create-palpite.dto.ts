import { IsInt, Min } from 'class-validator';

export class CreatePalpiteDto {
  @IsInt()
  jogo_id!: number;

  @IsInt()
  @Min(0, { message: 'O número de gols não pode ser negativo.' })
  gols_A_palpite!: number;

  @IsInt()
  @Min(0, { message: 'O número de gols não pode ser negativo.' })
  gols_B_palpite!: number;
}