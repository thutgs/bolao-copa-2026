import { 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Bolao } from './entities/bolao.entity';
import { UsuarioBolao } from './entities/usuario-bolao.entity';
import { CreateBolaoDto } from './dto/create-bolao.dto';
import { UpdateBolaoDto } from './dto/update-bolao.dto';

@Injectable()
export class BoloesService {
  constructor(
    @InjectRepository(Bolao)
    private bolaoRepository: Repository<Bolao>,
    @InjectRepository(UsuarioBolao)
    private usuarioBolaoRepository: Repository<UsuarioBolao>,
    private dataSource: DataSource, // Injete o DataSource para a query bruta
  ) {}

  private gerarCodigoConvite(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }

  async create(createBolaoDto: CreateBolaoDto, criadorId: number) {
    try {
      let codigoGerado = '';
      let codigoExiste = true;

      // O LOOP DE SEGURANÇA: Só sai daqui quando gerar um código que não existe no banco
      do {
        codigoGerado = this.gerarCodigoConvite();
        const bolaoExistente = await this.bolaoRepository.findOne({ where: { codigo_convite: codigoGerado } });
        if (!bolaoExistente) {
          codigoExiste = false;
        }
      } while (codigoExiste);

      const novoBolao = this.bolaoRepository.create({
        ...createBolaoDto,
        codigo_convite: codigoGerado, // Usa o código garantidamente único
        criador: { id: criadorId }, 
      });

      const bolaoSalvo = await this.bolaoRepository.save(novoBolao);

      const participante = this.usuarioBolaoRepository.create({
        usuario: { id: criadorId },
        bolao: { id: bolaoSalvo.id },
        pontuação_total: 0,
      });
      await this.usuarioBolaoRepository.save(participante);

      return bolaoSalvo;
    } catch (error) {
      throw new InternalServerErrorException('Erro crítico ao criar o bolão no banco de dados.');
    }
  }

  async findAllByUser(usuarioId: number) {
    try {
      // Retorna apenas bolões onde o usuário é participante (criou ou entrou via código)
      const boloes = await this.dataSource.query(`
        SELECT 
          b.id,
          b.nome,
          b.descricao,
          b.codigo_convite,
          b.criador_id,
          (SELECT COUNT(*) FROM usuarios_boloes ub2 WHERE ub2.bolao_id = b.id) as participantes
        FROM boloes b
        INNER JOIN usuarios_boloes ub ON ub.bolao_id = b.id
        WHERE ub.usuario_id = $1
        ORDER BY b.id DESC
      `, [usuarioId]);

      return boloes.map((b: any) => ({
        id: b.id,
        nome: b.nome,
        descricao: b.descricao,
        codigo_convite: b.codigo_convite,
        criador_id: b.criador_id,
        participantes: Number(b.participantes),
      }));
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar a lista de bolões.');
    }
  }

  // NOVO: Busca um bolão específico e garante que ele existe
  async findOne(id: number) {
    const bolao = await this.bolaoRepository.findOne({
      where: { id },
      relations: ['criador'],
    });

    if (!bolao) {
      throw new NotFoundException(`Bolão com ID ${id} não encontrado.`);
    }
    return bolao;
  }

  // NOVO: Atualiza garantindo que só o criador tem permissão
  async update(id: number, updateBolaoDto: UpdateBolaoDto, usuarioId: number) {
    const bolao = await this.findOne(id); // Já verifica se existe aqui

    // Validação de Propriedade
    if (bolao.criador.id !== usuarioId) {
      throw new ForbiddenException('Apenas o criador do bolão tem permissão para editá-lo.');
    }

    try {
      const bolaoAtualizado = await this.bolaoRepository.preload({
        id: id,
        ...updateBolaoDto,
      });

      if (!bolaoAtualizado) {
        throw new NotFoundException(`Bolão com ID ${id} não encontrado para atualização.`);
      }

      return await this.bolaoRepository.save(bolaoAtualizado);
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao atualizar o bolão ${id}.`);
    }
  }

  // NOVO: Deleta garantindo propriedade e limpando a tabela pivô primeiro
  async remove(id: number, usuarioId: number) {
    const bolao = await this.findOne(id);

    // Validação de Propriedade
    if (bolao.criador.id !== usuarioId) {
      throw new ForbiddenException('Apenas o criador do bolão tem permissão para excluí-lo.');
    }

    try {
      // Como temos chave estrangeira, primeiro removemos os participantes da tabela pivô
      await this.usuarioBolaoRepository.delete({ bolao: { id: id } });
      
      // Depois deletamos o bolão em si
      return await this.bolaoRepository.remove(bolao);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao excluir o bolão e suas dependências.');
    }
  }

  // ... outros métodos (create, findAll, findOne, update, remove)

  // NOVO MÉTODO: Entrar via código
  async entrarBolao(codigo_convite: string, usuarioId: number) {
    // 1. Busca o bolão pelo código exato
    const bolao = await this.bolaoRepository.findOne({
      where: { codigo_convite },
    });

    if (!bolao) {
      throw new NotFoundException('Bolão não encontrado. Verifique o código de convite digitado.');
    }

    // 2. Verifica se o usuário já está participando deste bolão
    const jaParticipa = await this.usuarioBolaoRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        bolao: { id: bolao.id },
      },
    });

    if (jaParticipa) {
      throw new BadRequestException('Você já está participando deste bolão!');
    }

    // 3. Insere o usuário na tabela pivô
    try {
      const novoParticipante = this.usuarioBolaoRepository.create({
        usuario: { id: usuarioId },
        bolao: { id: bolao.id },
        pontuação_total: 0,
      });

      await this.usuarioBolaoRepository.save(novoParticipante);

      // Retornamos uma mensagem amigável para o front-end mostrar no Toast/Alerta
      return { 
        mensagem: 'Você entrou no bolão com sucesso!', 
        bolao: { id: bolao.id, nome: bolao.nome } 
      };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao entrar no bolão.');
    }
  }

  // NOVO: Pré-visualizar bolão pelo código de convite
  async buscarPorCodigo(codigo_convite: string) {
    const bolao = await this.bolaoRepository.findOne({
      where: { codigo_convite },
      select: ['id', 'nome', 'descricao', 'codigo_convite'], // Esconde dados sensíveis
      relations: ['criador'], // Opcional: para mostrar quem convidou
    });

    if (!bolao) {
      throw new NotFoundException('Código de convite inválido ou bolão inexistente.');
    }
    return {
      id: bolao.id,
      nome: bolao.nome,
      descricao: bolao.descricao,
      criador: bolao.criador.nome,
    };
  }

  async getRanking(bolaoId: number, usuarioLogadoId: number) {
    await this.findOne(bolaoId); 

    // Verifica se o usuário logado participa deste bolão
    const participa = await this.usuarioBolaoRepository.findOne({
      where: {
        usuario: { id: usuarioLogadoId },
        bolao: { id: bolaoId },
      },
    });

    if (!participa) {
      throw new ForbiddenException('Você não participa deste bolão.');
    }

    // Atualizamos a query para contar o total de palpites e os acertos exatos (3 pontos)
    const rankingRaw = await this.dataSource.query(`
      SELECT 
        u.id as usuario_id,
        u.nome,
        pb."pontuação_total" as pontos,
        (SELECT COUNT(*) FROM palpites p WHERE p.usuario_id = u.id) as total_palpites,
        (SELECT COUNT(*) FROM palpites p WHERE p.usuario_id = u.id AND p.pontos_obtidos = 3) as acertos_exatos
      FROM usuarios_boloes pb
      INNER JOIN usuarios u ON u.id = pb.usuario_id
      WHERE pb.bolao_id = $1
      ORDER BY pb."pontuação_total" DESC, acertos_exatos DESC
    `, [bolaoId]);

    // Mapeamos os novos nomes para o Frontend
    return rankingRaw.map((row, index) => ({
      posicao: index + 1,
      nome: row.nome,
      pontos: Number(row.pontos),
      totalPalpites: Number(row.total_palpites),
      acertosExatos: Number(row.acertos_exatos),
      isUsuario: row.usuario_id === usuarioLogadoId 
    }));
  }
}
