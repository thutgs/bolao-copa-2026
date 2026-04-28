import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Bolao } from './bolao.entity';

@Entity('usuarios_boloes')
export class UsuarioBolao {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Bolao)
  @JoinColumn({ name: 'bolao_id' })
  bolao!: Bolao;

  @Column({ default: 0 })
  pontuação_total!: number; // Atualizado a cada jogo finalizado
}