import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('selecoes')
export class Selecao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nome!: string;

  @Column({ length: 1 })
  grupo!: string; // A, B, C... L

  @Column({ nullable: true })
  url_bandeira!: string;
}