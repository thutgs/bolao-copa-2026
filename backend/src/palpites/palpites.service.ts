import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Palpite } from './entities/palpite.entity';
import { Jogo } from '../jogos/entities/jogo.entity';
import { CreatePalpiteDto } from './dto/create-palpite.dto';
import { UpdatePalpiteDto } from './dto/update-palpite.dto';

@Injectable()
export class PalpitesService {
  constructor(
    @InjectRepository(Palpite)
    private palpiteRepository: Repository<Palpite>,
    @InjectRepository(Jogo)
    private jogoRepository: Repository<Jogo>,
  ) {}

  async create(createPalpiteDto: CreatePalpiteDto, usuarioId: number) {
    // 1. Busca o jogo para pegar a data de início
    const jogo = await this.jogoRepository.findOne({ where: { id: createPalpiteDto.jogo_id } });
    if (!jogo) {
      throw new NotFoundException('Jogo não encontrado.');
    }

    // 2. TRAVA DE TEMPO: O jogo já começou?
    const agora = new Date();
    const dataHoraJogo = new Date(jogo.data_hora_inicio);
    if (agora >= dataHoraJogo) {
      throw new ForbiddenException('Tempo esgotado! O jogo já começou ou já foi encerrado.');
    }

    // 3. Verifica se o usuário já deu palpite neste jogo
    const palpiteExistente = await this.palpiteRepository.findOne({
      where: { usuario: { id: usuarioId }, jogo: { id: jogo.id } }
    });

    if (palpiteExistente) {
      throw new BadRequestException('Você já deu um palpite para este jogo. Tente editar o palpite existente.');
    }

    // 4. Salva o palpite!
    const novoPalpite = this.palpiteRepository.create({
      gols_A_palpite: createPalpiteDto.gols_A_palpite,
      gols_B_palpite: createPalpiteDto.gols_B_palpite,
      usuario: { id: usuarioId },
      jogo: { id: jogo.id }
    });

    return await this.palpiteRepository.save(novoPalpite);
  }

  async findAll() {
    return await this.palpiteRepository.find({ relations: ['usuario', 'jogo'] });
  }

  async findOne(id: number) {
    const palpite = await this.palpiteRepository.findOne({
      where: { id },
      relations: ['usuario', 'jogo'], // Traz o usuário e o jogo junto para validarmos quem é o dono
    });

    if (!palpite) {
      throw new NotFoundException(`Palpite com ID ${id} não encontrado.`);
    }
    return palpite;
  }

  async update(id: number, updatePalpiteDto: UpdatePalpiteDto, usuarioId: number) {
    const palpite = await this.findOne(id);

    // 1. Validação de Propriedade: Só o dono altera o palpite
    if (palpite.usuario.id !== usuarioId) {
      throw new ForbiddenException('Você só pode alterar os seus próprios palpites.');
    }

    // 2. TRAVA DE TEMPO na atualização
    const agora = new Date();
    const dataHoraJogo = new Date(palpite.jogo.data_hora_inicio);
    if (agora >= dataHoraJogo) {
      throw new ForbiddenException('Tempo esgotado! Não é mais possível alterar o palpite para este jogo.');
    }

    // 3. Atualiza o palpite diretamente
    if (updatePalpiteDto.gols_A_palpite !== undefined) {
      palpite.gols_A_palpite = updatePalpiteDto.gols_A_palpite;
    }
    if (updatePalpiteDto.gols_B_palpite !== undefined) {
      palpite.gols_B_palpite = updatePalpiteDto.gols_B_palpite;
    }

    return await this.palpiteRepository.save(palpite);
  }

  async remove(id: number, usuarioId: number) {
    const palpite = await this.findOne(id);

    if (palpite.usuario.id !== usuarioId) {
      throw new ForbiddenException('Você só pode excluir os seus próprios palpites.');
    }

    const agora = new Date();
    const dataHoraJogo = new Date(palpite.jogo.data_hora_inicio);
    if (agora >= dataHoraJogo) {
      throw new ForbiddenException('Tempo esgotado! Não é mais possível apagar este palpite.');
    }

    return await this.palpiteRepository.remove(palpite);
  }
}