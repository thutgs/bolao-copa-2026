import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Jogo } from '../../jogos/entities/jogo.entity';

@Entity('palpites')
export class Palpite {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Jogo)
  @JoinColumn({ name: 'jogo_id' })
  jogo!: Jogo;

  @Column()
  gols_A_palpite!: number;

  @Column()
  gols_B_palpite!: number;

  @Column({ nullable: true })
  pontos_obtidos!: number; // 3 (Cravo), 1 (Tendência), 0 (Erro)
}