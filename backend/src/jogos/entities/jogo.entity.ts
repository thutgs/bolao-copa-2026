import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Selecao } from '../../selecoes/entities/selecao.entity';

@Entity('jogos')
export class Jogo {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Selecao)
  @JoinColumn({ name: 'selecao_a_id' })
  selecao_A!: Selecao;

  @ManyToOne(() => Selecao)
  @JoinColumn({ name: 'selecao_b_id' })
  selecao_B!: Selecao;

  @Column({ type: 'timestamp' })
  data_hora_inicio!: Date;

  @Column()
  fase!: string; // Ex: 'Grupo A', 'Dezesseis-avos', 'Oitavas'

  @Column({ nullable: true })
  gols_A_real!: number;

  @Column({ nullable: true })
  gols_B_real!: number;

  @Column({ default: 'pendente' })
  status!: string; // 'pendente' ou 'finalizado'

  // Auxiliar para a chave do mata-mata caso dê empate no tempo normal
  @ManyToOne(() => Selecao, { nullable: true })
  @JoinColumn({ name: 'selecao_vencedora_penaltis_id' })
  vencedora_penaltis!: Selecao;
}