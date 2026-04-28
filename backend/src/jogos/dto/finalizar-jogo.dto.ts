import { IsInt, IsOptional, Min } from 'class-validator';

export class FinalizarJogoDto {
  @IsInt()
  @Min(0)
  gols_A_real!: number;

  @IsInt()
  @Min(0)
  gols_B_real!: number;

  // NOVO: ID da equipa que venceu nos penáltis (se aplicável)
  @IsOptional()
  @IsInt()
  selecao_vencedora_penaltis_id?: number;
}