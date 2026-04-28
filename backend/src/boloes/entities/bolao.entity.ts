import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('boloes')
export class Bolao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nome!: string;

  @Column({ nullable: true })
  descricao!: string;

  @Column({ unique: true, length: 6 })
  codigo_convite!: string;

  // Quem criou o bolão
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'criador_id' })
  criador!: Usuario;
}