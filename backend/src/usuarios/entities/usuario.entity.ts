import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Selecao } from '../../selecoes/entities/selecao.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha_hash!: string;

  @Column({ default: false })
  is_global_admin!: boolean;

  // Relacionamento: Vários usuários podem torcer para a mesma seleção
  @ManyToOne(() => Selecao, { nullable: true })
  @JoinColumn({ name: 'id_selecao_preferida' })
  selecao_preferida!: Selecao;
}