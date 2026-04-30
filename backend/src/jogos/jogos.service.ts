import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jogo } from './entities/jogo.entity';
import { Selecao } from '../selecoes/entities/selecao.entity';
import { CreateJogoDto } from './dto/create-jogo.dto';
import { UpdateJogoDto } from './dto/update-jogo.dto';
import { Palpite } from '../palpites/entities/palpite.entity';
import { UsuarioBolao } from '../boloes/entities/usuario-bolao.entity';
import { FinalizarJogoDto } from './dto/finalizar-jogo.dto';

@Injectable()
export class JogosService {
  constructor(
    @InjectRepository(Jogo)
    private jogoRepository: Repository<Jogo>,
    @InjectRepository(Selecao)
    private selecaoRepository: Repository<Selecao>,
    // Novas injeções para o motor de pontuação:
    @InjectRepository(Palpite)
    private palpiteRepository: Repository<Palpite>,
    @InjectRepository(UsuarioBolao)
    private usuarioBolaoRepository: Repository<UsuarioBolao>,
  ) {}

  async create(createJogoDto: CreateJogoDto) {
    if (createJogoDto.selecao_a_id === createJogoDto.selecao_b_id) {
      throw new BadRequestException('Um time não pode jogar contra si mesmo.');
    }

    const selecaoA = await this.selecaoRepository.findOne({ where: { id: createJogoDto.selecao_a_id } });
    const selecaoB = await this.selecaoRepository.findOne({ where: { id: createJogoDto.selecao_b_id } });

    if (!selecaoA || !selecaoB) {
      throw new NotFoundException('Uma ou ambas as seleções informadas não existem no banco.');
    }

    // Nomes rigorosamente iguais à sua Entity
    const novoJogo = this.jogoRepository.create({
      selecao_A: { id: createJogoDto.selecao_a_id },
      selecao_B: { id: createJogoDto.selecao_b_id },
      data_hora_inicio: createJogoDto.data_hora,
      fase: createJogoDto.fase, // Adicionado para não dar erro no banco!
    });

    return await this.jogoRepository.save(novoJogo);
  }

  async findAll() {
    return await this.jogoRepository.find({
      relations: ['selecao_A', 'selecao_B', 'vencedora_penaltis'], // Buscamos as relations com o nome exato
      order: { data_hora_inicio: 'ASC' }
    });
  }

  async getNextMatches(limit: number = 4) {
    const jogos = await this.jogoRepository.find({
      where: { status: 'pendente' },
      relations: ['selecao_A', 'selecao_B'],
      order: { data_hora_inicio: 'ASC' },
      take: limit
    });

    return jogos.map(jogo => {
      // Extraindo dia, mês, ano, hora e minuto respeitando o fuso horário local
      const d = jogo.data_hora_inicio;
      const ano = d.getFullYear();
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const dia = String(d.getDate()).padStart(2, '0');
      const horas = String(d.getHours()).padStart(2, '0');
      const minutos = String(d.getMinutes()).padStart(2, '0');

      return {
        id: jogo.id,
        teamA: jogo.selecao_A.nome,
        teamB: jogo.selecao_B.nome,
        flagAUrl: jogo.selecao_A.url_bandeira || `https://flagcdn.com/w40/${jogo.selecao_A.nome.toLowerCase().replace(/\s/g, '-')}.png`,
        flagBUrl: jogo.selecao_B.url_bandeira || `https://flagcdn.com/w40/${jogo.selecao_B.nome.toLowerCase().replace(/\s/g, '-')}.png`,
        date: `${ano}-${mes}-${dia}`, // Agora enviamos a data estritamente local
        time: `${horas}:${minutos}`,  // E o horário também
        estadio: jogo.fase,
        status: jogo.status,
        placarA: jogo.gols_A_real,
        placarB: jogo.gols_B_real
      };
    });
  }

  async findOne(id: number) {
    const jogo = await this.jogoRepository.findOne({
      where: { id },
      relations: ['selecao_A', 'selecao_B', 'vencedora_penaltis'],
    });

    if (!jogo) {
      throw new NotFoundException(`Jogo com ID ${id} não encontrado.`);
    }
    return jogo;
  }

  async update(id: number, updateJogoDto: UpdateJogoDto) {
    await this.findOne(id);

    if (updateJogoDto.selecao_a_id && updateJogoDto.selecao_b_id) {
      if (updateJogoDto.selecao_a_id === updateJogoDto.selecao_b_id) {
        throw new BadRequestException('Um time não pode jogar contra si mesmo.');
      }
    }

    const jogoAtualizado = await this.jogoRepository.preload({
      id: id,
      ...(updateJogoDto.selecao_a_id && { selecao_A: { id: updateJogoDto.selecao_a_id } }),
      ...(updateJogoDto.selecao_b_id && { selecao_B: { id: updateJogoDto.selecao_b_id } }),
      ...(updateJogoDto.data_hora && { data_hora_inicio: updateJogoDto.data_hora }),
      ...(updateJogoDto.fase && { fase: updateJogoDto.fase }),
    });

    if (!jogoAtualizado) {
      throw new NotFoundException(`Jogo com ID ${id} não encontrado.`);
    }

    return await this.jogoRepository.save(jogoAtualizado);
  }

  async remove(id: number) {
    const jogo = await this.findOne(id);
    return await this.jogoRepository.remove(jogo);
  }

  // O MOTOR DE PONTUAÇÃO
  async finalizarJogo(id: number, finalizarJogoDto: FinalizarJogoDto) { // Agora recebe o DTO inteiro
    const jogo = await this.findOne(id);
    const { gols_A_real, gols_B_real, selecao_vencedora_penaltis_id } = finalizarJogoDto;

    if (jogo.status === 'finalizado') {
      throw new BadRequestException('Este jogo já foi finalizado.');
    }

    jogo.gols_A_real = gols_A_real;
    jogo.gols_B_real = gols_B_real;
    jogo.status = 'finalizado';

    // Regista o vencedor dos penáltis se enviado pelo Admin
    if (selecao_vencedora_penaltis_id) {
      jogo.vencedora_penaltis = { id: selecao_vencedora_penaltis_id } as Selecao;
    }

    await this.jogoRepository.save(jogo);

    // 2. Busca todos os palpites feitos para este jogo
    const palpites = await this.palpiteRepository.find({
      where: { jogo: { id: jogo.id } },
      relations: ['usuario'],
    });

    // 3. O Loop de Cálculo
    for (const palpite of palpites) {
      let pontos = 0;

      // Matemática: Acertou na mosca?
      const acertouPlacar = 
        palpite.gols_A_palpite === gols_A_real && 
        palpite.gols_B_palpite === gols_B_real;

      // Matemática: Acertou quem ganhou (ou se foi empate)?
      // Math.sign retorna 1 (Vitória A), -1 (Vitória B) ou 0 (Empate)
      const acertouTendencia = 
        Math.sign(gols_A_real - gols_B_real) === 
        Math.sign(palpite.gols_A_palpite - palpite.gols_B_palpite);

      if (acertouPlacar) {
        pontos = 3; // Cravo
      } else if (acertouTendencia) {
        pontos = 1; // Tendência
      }

      // 4. Salva os pontos no palpite
      palpite.pontos_obtidos = pontos;
      await this.palpiteRepository.save(palpite);

      // 5. Se o usuário pontuou, atualiza o ranking dele nos bolões
      if (pontos > 0) {
        const participacoes = await this.usuarioBolaoRepository.find({
          where: { usuario: { id: palpite.usuario.id } },
        });

        for (const participacao of participacoes) {
          participacao.pontuação_total += pontos;
          await this.usuarioBolaoRepository.save(participacao);
        }
      }
    }

    return { 
      mensagem: 'Jogo finalizado! O ranking dos bolões foi atualizado com sucesso.', 
      palpitesProcessados: palpites.length 
    };
  }

  // NOVO: Gera a Tabela de Classificação da Fase de Grupos
  async getClassificacaoGrupos() {
    // 1. Busca todas as equipas e os jogos já finalizados da fase de grupos
    const selecoes = await this.selecaoRepository.find();
    const jogosFinalizados = await this.jogoRepository.find({
      where: { status: 'finalizado' },
      relations: ['selecao_A', 'selecao_B'],
    });

    // 2. Cria um dicionário para acumular os pontos
    const tabela: Record<string, any> = {};
    selecoes.forEach(s => {
      tabela[s.id] = {
        id: s.id, nome: s.nome, grupo: s.grupo, url_bandeira: s.url_bandeira,
        pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
        gols_pro: 0, gols_contra: 0, saldo_gols: 0
      };
    });

    // 3. Processa cada jogo real
    jogosFinalizados.forEach(jogo => {
      if (!jogo.fase.includes('Grupo')) return; // Só processa a fase de grupos

      const tA = tabela[jogo.selecao_A.id];
      const tB = tabela[jogo.selecao_B.id];

      tA.jogos++; tB.jogos++;
      tA.gols_pro += jogo.gols_A_real; tB.gols_pro += jogo.gols_B_real;
      tA.gols_contra += jogo.gols_B_real; tB.gols_contra += jogo.gols_A_real;

      if (jogo.gols_A_real > jogo.gols_B_real) {
        tA.vitorias++; tA.pontos += 3; tB.derrotas++;
      } else if (jogo.gols_A_real < jogo.gols_B_real) {
        tB.vitorias++; tB.pontos += 3; tA.derrotas++;
      } else {
        tA.empates++; tB.empates++; tA.pontos += 1; tB.pontos += 1;
      }
    });

    // 4. Calcula o saldo e ordena por Grupo e Critérios da FIFA
    const classificacaoArray = Object.values(tabela).map(t => ({
      ...t, saldo_gols: t.gols_pro - t.gols_contra
    }));

    classificacaoArray.sort((a, b) => {
      if (a.grupo !== b.grupo) return a.grupo.localeCompare(b.grupo);
      if (b.pontos !== a.pontos) return b.pontos - a.pontos; // 1º Pontos
      if (b.saldo_gols !== a.saldo_gols) return b.saldo_gols - a.saldo_gols; // 2º Saldo
      if (b.gols_pro !== a.gols_pro) return b.gols_pro - a.gols_pro; // 3º Golos Pró
      return a.nome.localeCompare(b.nome); // 4º Alfabética
    });

    return classificacaoArray;
  }

  // NOVO 1: Ranking dos 8 Melhores Terceiros Colocados
  async getMelhoresTerceiros() {
    const classificacaoGeral = await this.getClassificacaoGrupos();
    const terceiros: any[] = [];
    const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    for (const letra of grupos) {
      const timesDoGrupo = classificacaoGeral.filter((t) => t.grupo === letra);
      // Pega exatamente o time na 3ª posição do grupo (índice 2)
      if (timesDoGrupo.length >= 3) {
        terceiros.push(timesDoGrupo[2]);
      }
    }

    // Ordena os 12 terceiros colocados usando os critérios da FIFA
    terceiros.sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldo_gols !== a.saldo_gols) return b.saldo_gols - a.saldo_gols;
      if (b.gols_pro !== a.gols_pro) return b.gols_pro - a.gols_pro;
      return a.nome.localeCompare(b.nome);
    });

    // Retorna os 12, mas o front-end vai destacar os 8 primeiros (que se classificam)
    return terceiros;
  }

  // NOVO 2: Geração Híbrida do Mata-Mata (Dezesseis-avos)
  async gerarDezesseisAvos() {
    const classificacao = await this.getClassificacaoGrupos();
    
    // Filtramos apenas os 1ºs e 2ºs lugares de cada grupo
    const primeirosLugar = classificacao.filter((_, i) => i % 4 === 0); // Índice 0 de cada grupo de 4
    const segundosLugar = classificacao.filter((_, i) => i % 4 === 1);  // Índice 1 de cada grupo de 4

    // Data base para o mata-mata (Ex: 28 de Junho de 2026)
    let dataJogoMataMata = new Date('2026-06-28T12:00:00Z');
    
    const jogosMataMata: Jogo[] = [];

    // O formato de 32 times da Copa de 2026 tem 16 confrontos.
    // Metade das chaves são 1º contra 2º, a outra metade é 1º contra 3º.
    // Deixaremos as selecoes_B vazias (nulas) para as vagas dos 3ºs lugares, como a documentação exige.
    
    for (let i = 0; i < 12; i++) { // Para cada um dos 12 líderes de grupo
      let selecaoB: { id: number } | undefined;

      // Logica simplificada de cruzamento direto para exemplo (1º vs 2º de grupos adjacentes)
      if (i < 4) {
        selecaoB = segundosLugar[i + 1] ? { id: segundosLugar[i + 1].id } : undefined;
      }

      const novoJogo = this.jogoRepository.create({
        selecao_A: { id: primeirosLugar[i].id },
        ...(selecaoB ? { selecao_B: selecaoB } : {}),
        data_hora_inicio: new Date(dataJogoMataMata),
        fase: 'Dezesseis-avos',
      });

      jogosMataMata.push(await this.jogoRepository.save(novoJogo));
      dataJogoMataMata.setHours(dataJogoMataMata.getHours() + 4);
    }

    return {
      mensagem: 'Chaveamento de Dezesseis-avos gerado com sucesso! Vagas de 3º lugar aguardam alocação.',
      jogosGerados: jogosMataMata.length,
    };
  }

  // Atualiza um jogo de mata-mata que estava com a vaga "em aberto"
  async alocarTerceiro(jogoId: number, selecaoBId: number) {
    const jogo = await this.jogoRepository.findOne({ where: { id: jogoId } });
    
    if (!jogo) {
      throw new NotFoundException('Jogo não encontrado.');
    }
    if (jogo.selecao_B) {
      throw new BadRequestException('Esta vaga já está preenchida.');
    }

    // Aloca a seleção na vaga B
    jogo.selecao_B = { id: selecaoBId } as any;
    
    return this.jogoRepository.save(jogo);
  }
}
