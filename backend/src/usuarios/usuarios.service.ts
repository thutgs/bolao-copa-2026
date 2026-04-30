import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; // Importação nova
import * as bcrypt from 'bcrypt';
import { UsuarioBolao } from '../boloes/entities/usuario-bolao.entity';
import { Palpite } from '../palpites/entities/palpite.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    // Adicione os repositórios necessários
    @InjectRepository(Palpite)
    private palpiteRepository: Repository<Palpite>,
    @InjectRepository(UsuarioBolao)
    private usuarioBolaoRepository: Repository<UsuarioBolao>,
  ) {}

// Dentro do seu usuarios.service.ts, atualize o método create:
  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email: createUsuarioDto.email },
    });

    if (usuarioExistente) {
      throw new BadRequestException('Este e-mail já está em uso. Tente fazer login.');
    }

    // GERAÇÃO DO HASH DA SENHA AQUI:
    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha_hash, saltRounds);

    const novoUsuario = this.usuarioRepository.create({
      nome: createUsuarioDto.nome,
      email: createUsuarioDto.email,
      senha_hash: senhaCriptografada, // <- Salvamos o hash, e não a senha pura!
      is_global_admin: createUsuarioDto.is_global_admin,
      selecao_preferida: createUsuarioDto.id_selecao_preferida 
        ? { id: createUsuarioDto.id_selecao_preferida } 
        : undefined,
    });

    return await this.usuarioRepository.save(novoUsuario);
  }

  async findAll() {
    // Busca todos os usuários e já traz os dados da seleção preferida junto (JOIN)
    return await this.usuarioRepository.find({
      relations: ['selecao_preferida'],
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['selecao_preferida'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // O preload busca o usuário e já substitui os campos enviados no DTO
    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto,
      // Lida com a seleção caso o usuário queira trocar a seleção preferida
      selecao_preferida: updateUsuarioDto.id_selecao_preferida 
        ? { id: updateUsuarioDto.id_selecao_preferida } 
        : undefined,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id); // Reaproveita o método findOne para garantir que existe
    return await this.usuarioRepository.remove(usuario);
  }

  // NOVO MÉTODO PARA BUSCAR USUÁRIO PELO E-MAIL, USADO NO LOGIN
  async findByEmail(email: string) {
    return await this.usuarioRepository.findOne({ where: { email } });
  }

  // NOVO: Método de estatísticas do usuário para o Dashboard
  async getEstatisticas(usuarioId: number) {
    const usuario = await this.findOne(usuarioId);

    const palpites = await this.palpiteRepository.find({
      where: { usuario: { id: usuarioId } },
    });

    // Filtra para contar apenas os jogos finalizados (onde pontos_obtidos não é nulo)
    const palpitesProcessados = palpites.filter(p => p.pontos_obtidos !== null);

    const acertosExatos = palpitesProcessados.filter(p => p.pontos_obtidos === 3).length;
    const acertosTendencia = palpitesProcessados.filter(p => p.pontos_obtidos === 1).length;
    const erros = palpitesProcessados.filter(p => p.pontos_obtidos === 0).length;

    // Busca a pontuação total do primeiro bolão que o usuário participa
    // (Ajuste a lógica se ele participar de vários bolões)
    const participacao = await this.usuarioBolaoRepository.findOne({
      where: { usuario: { id: usuarioId } }
    });

    return {
      nome: usuario.nome,
      pontos: participacao ? participacao.pontuação_total : 0,
      posicao: 1, // Vamos assumir 1 por enquanto, o front-end realinha
      acertosExatos,
      acertosTendencia,
      erros,
      total: palpitesProcessados.length
    };
  }
}
