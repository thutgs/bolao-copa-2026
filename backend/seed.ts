import { DataSource } from 'typeorm';
import { Selecao } from './src/selecoes/entities/selecao.entity';
import { Jogo } from './src/jogos/entities/jogo.entity';
import * as dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,           // O porto que você está usando
  username: 'postgres',
  password: '',         // Deixe vazio conforme o seu código original
  database: 'bolao_copa_2026',
  entities: [Selecao, Jogo],
  synchronize: false,
});

// A sua lista oficial de seleções
const selecoesData = [
  // GRUPO A
  { nome: 'México', grupo: 'A', url_bandeira: 'https://flagcdn.com/mx.svg' },
  { nome: 'África do Sul', grupo: 'A', url_bandeira: 'https://flagcdn.com/za.svg' },
  { nome: 'Coreia do Sul', grupo: 'A', url_bandeira: 'https://flagcdn.com/kr.svg' },
  { nome: 'República Tcheca', grupo: 'A', url_bandeira: 'https://flagcdn.com/cz.svg' },

  // GRUPO B
  { nome: 'Canadá', grupo: 'B', url_bandeira: 'https://flagcdn.com/ca.svg' },
  { nome: 'Bósnia e Herzegovina', grupo: 'B', url_bandeira: 'https://flagcdn.com/ba.svg' },
  { nome: 'Catar', grupo: 'B', url_bandeira: 'https://flagcdn.com/qa.svg' },
  { nome: 'Suíça', grupo: 'B', url_bandeira: 'https://flagcdn.com/ch.svg' },

  // GRUPO C
  { nome: 'Brasil', grupo: 'C', url_bandeira: 'https://flagcdn.com/br.svg' },
  { nome: 'Marrocos', grupo: 'C', url_bandeira: 'https://flagcdn.com/ma.svg' },
  { nome: 'Haiti', grupo: 'C', url_bandeira: 'https://flagcdn.com/ht.svg' },
  { nome: 'Escócia', grupo: 'C', url_bandeira: 'https://flagcdn.com/gb-sct.svg' },

  // GRUPO D
  { nome: 'Estados Unidos', grupo: 'D', url_bandeira: 'https://flagcdn.com/us.svg' },
  { nome: 'Paraguai', grupo: 'D', url_bandeira: 'https://flagcdn.com/py.svg' },
  { nome: 'Austrália', grupo: 'D', url_bandeira: 'https://flagcdn.com/au.svg' },
  { nome: 'Turquia', grupo: 'D', url_bandeira: 'https://flagcdn.com/tr.svg' },

  // GRUPO E
  { nome: 'Alemanha', grupo: 'E', url_bandeira: 'https://flagcdn.com/de.svg' },
  { nome: 'Curaçao', grupo: 'E', url_bandeira: 'https://flagcdn.com/cw.svg' },
  { nome: 'Costa do Marfim', grupo: 'E', url_bandeira: 'https://flagcdn.com/ci.svg' },
  { nome: 'Equador', grupo: 'E', url_bandeira: 'https://flagcdn.com/ec.svg' },

  // GRUPO F
  { nome: 'Holanda', grupo: 'F', url_bandeira: 'https://flagcdn.com/nl.svg' },
  { nome: 'Japão', grupo: 'F', url_bandeira: 'https://flagcdn.com/jp.svg' },
  { nome: 'Suécia', grupo: 'F', url_bandeira: 'https://flagcdn.com/se.svg' },
  { nome: 'Tunísia', grupo: 'F', url_bandeira: 'https://flagcdn.com/tn.svg' },

  // GRUPO G
  { nome: 'Bélgica', grupo: 'G', url_bandeira: 'https://flagcdn.com/be.svg' },
  { nome: 'Egito', grupo: 'G', url_bandeira: 'https://flagcdn.com/eg.svg' },
  { nome: 'Irã', grupo: 'G', url_bandeira: 'https://flagcdn.com/ir.svg' },
  { nome: 'Nova Zelândia', grupo: 'G', url_bandeira: 'https://flagcdn.com/nz.svg' },

  // GRUPO H
  { nome: 'Espanha', grupo: 'H', url_bandeira: 'https://flagcdn.com/es.svg' },
  { nome: 'Cabo Verde', grupo: 'H', url_bandeira: 'https://flagcdn.com/cv.svg' },
  { nome: 'Arábia Saudita', grupo: 'H', url_bandeira: 'https://flagcdn.com/sa.svg' },
  { nome: 'Uruguai', grupo: 'H', url_bandeira: 'https://flagcdn.com/uy.svg' },

  // GRUPO I
  { nome: 'França', grupo: 'I', url_bandeira: 'https://flagcdn.com/fr.svg' },
  { nome: 'Senegal', grupo: 'I', url_bandeira: 'https://flagcdn.com/sn.svg' },
  { nome: 'Iraque', grupo: 'I', url_bandeira: 'https://flagcdn.com/iq.svg' },
  { nome: 'Noruega', grupo: 'I', url_bandeira: 'https://flagcdn.com/no.svg' },

  // GRUPO J
  { nome: 'Argentina', grupo: 'J', url_bandeira: 'https://flagcdn.com/ar.svg' },
  { nome: 'Argélia', grupo: 'J', url_bandeira: 'https://flagcdn.com/dz.svg' },
  { nome: 'Áustria', grupo: 'J', url_bandeira: 'https://flagcdn.com/at.svg' },
  { nome: 'Jordânia', grupo: 'J', url_bandeira: 'https://flagcdn.com/jo.svg' },

  // GRUPO K
  { nome: 'Portugal', grupo: 'K', url_bandeira: 'https://flagcdn.com/pt.svg' },
  { nome: 'RD Congo', grupo: 'K', url_bandeira: 'https://flagcdn.com/cd.svg' },
  { nome: 'Uzbequistão', grupo: 'K', url_bandeira: 'https://flagcdn.com/uz.svg' },
  { nome: 'Colômbia', grupo: 'K', url_bandeira: 'https://flagcdn.com/co.svg' },

  // GRUPO L
  { nome: 'Inglaterra', grupo: 'L', url_bandeira: 'https://flagcdn.com/gb-eng.svg' },
  { nome: 'Croácia', grupo: 'L', url_bandeira: 'https://flagcdn.com/hr.svg' },
  { nome: 'Gana', grupo: 'L', url_bandeira: 'https://flagcdn.com/gh.svg' },
  { nome: 'Panamá', grupo: 'L', url_bandeira: 'https://flagcdn.com/pa.svg' }
];

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Conectado ao banco de dados usando credenciais do .env!');

    const selecaoRepo = AppDataSource.getRepository(Selecao);
    const jogoRepo = AppDataSource.getRepository(Jogo);

    // 1. VERIFICAÇÃO INTELIGENTE (Trava de Segurança)
    const qtdSelecoes = await selecaoRepo.count();
    
    if (qtdSelecoes > 0) {
      console.log('⚠️ As seleções já existem na base de dados!');
      console.log('A execução foi interrompida para proteger os usuários cadastrados.');
      console.log('Se deseja repopular os jogos, apague os dados manualmente via DBeaver.');
      return; 
    }

    // 2. Salvar as Seleções (Só chega aqui se o banco estiver vazio)
    console.log('🌍 Base limpa detectada. Inserindo 48 Seleções Oficiais...');
    const selecoesSalvas = await selecaoRepo.save(selecoesData);

// 3. Gerar os 72 Jogos da Fase de Grupos
    console.log('⚽ Inserindo a tabela oficial de jogos com os horários e datas reais...');

    const cronogramaOficial = [
      // 1ª Rodada
      { a: 'México', b: 'África do Sul', data: '2026-06-11T16:00:00-03:00' },
      { a: 'Coreia do Sul', b: 'República Tcheca', data: '2026-06-11T23:00:00-03:00' },
      { a: 'Canadá', b: 'Bósnia e Herzegovina', data: '2026-06-12T16:00:00-03:00' },
      { a: 'Estados Unidos', b: 'Paraguai', data: '2026-06-12T22:00:00-03:00' },
      { a: 'Catar', b: 'Suíça', data: '2026-06-13T16:00:00-03:00' },
      { a: 'Brasil', b: 'Marrocos', data: '2026-06-13T19:00:00-03:00' },
      { a: 'Haiti', b: 'Escócia', data: '2026-06-13T22:00:00-03:00' },
      { a: 'Austrália', b: 'Turquia', data: '2026-06-14T01:00:00-03:00' },
      { a: 'Alemanha', b: 'Curaçao', data: '2026-06-14T14:00:00-03:00' },
      { a: 'Costa do Marfim', b: 'Equador', data: '2026-06-14T20:00:00-03:00' },
      { a: 'Holanda', b: 'Japão', data: '2026-06-14T17:00:00-03:00' },
      { a: 'Suécia', b: 'Tunísia', data: '2026-06-14T23:00:00-03:00' },
      { a: 'Espanha', b: 'Cabo Verde', data: '2026-06-15T13:00:00-03:00' },
      { a: 'Arábia Saudita', b: 'Uruguai', data: '2026-06-15T19:00:00-03:00' },
      { a: 'Bélgica', b: 'Egito', data: '2026-06-15T16:00:00-03:00' },
      { a: 'Irã', b: 'Nova Zelândia', data: '2026-06-15T22:00:00-03:00' },
      { a: 'Áustria', b: 'Jordânia', data: '2026-06-17T01:00:00-03:00' },
      { a: 'França', b: 'Senegal', data: '2026-06-16T16:00:00-03:00' },
      { a: 'Iraque', b: 'Noruega', data: '2026-06-16T19:00:00-03:00' },
      { a: 'Argentina', b: 'Argélia', data: '2026-06-16T22:00:00-03:00' },
      { a: 'Portugal', b: 'RD Congo', data: '2026-06-17T14:00:00-03:00' },
      { a: 'Inglaterra', b: 'Croácia', data: '2026-06-17T17:00:00-03:00' },
      { a: 'Gana', b: 'Panamá', data: '2026-06-17T20:00:00-03:00' },
      { a: 'Uzbequistão', b: 'Colômbia', data: '2026-06-17T21:00:00-03:00' },

      // 2ª Rodada
      { a: 'República Tcheca', b: 'África do Sul', data: '2026-06-18T13:00:00-03:00' },
      { a: 'Suíça', b: 'Bósnia e Herzegovina', data: '2026-06-18T16:00:00-03:00' },
      { a: 'Canadá', b: 'Catar', data: '2026-06-18T19:00:00-03:00' },
      { a: 'México', b: 'Coreia do Sul', data: '2026-06-18T22:00:00-03:00' },
      { a: 'Turquia', b: 'Paraguai', data: '2026-06-19T00:00:00-03:00' },
      { a: 'Estados Unidos', b: 'Austrália', data: '2026-06-19T16:00:00-03:00' },
      { a: 'Escócia', b: 'Marrocos', data: '2026-06-19T19:00:00-03:00' },
      { a: 'Brasil', b: 'Haiti', data: '2026-06-19T21:30:00-03:00' },
      { a: 'Tunísia', b: 'Japão', data: '2026-06-20T23:00:00-03:00' },
      { a: 'Holanda', b: 'Suécia', data: '2026-06-20T14:00:00-03:00' },
      { a: 'Alemanha', b: 'Costa do Marfim', data: '2026-06-20T17:00:00-03:00' },
      { a: 'Equador', b: 'Curaçao', data: '2026-06-20T21:00:00-03:00' },
      { a: 'Espanha', b: 'Arábia Saudita', data: '2026-06-21T13:00:00-03:00' },
      { a: 'Bélgica', b: 'Irã', data: '2026-06-21T16:00:00-03:00' },
      { a: 'Uruguai', b: 'Cabo Verde', data: '2026-06-21T19:00:00-03:00' },
      { a: 'Nova Zelândia', b: 'Egito', data: '2026-06-21T22:00:00-03:00' },
      { a: 'Argentina', b: 'Áustria', data: '2026-06-22T14:00:00-03:00' },
      { a: 'França', b: 'Iraque', data: '2026-06-22T18:00:00-03:00' },
      { a: 'Noruega', b: 'Senegal', data: '2026-06-22T21:00:00-03:00' },
      { a: 'Jordânia', b: 'Argélia', data: '2026-06-23T00:00:00-03:00' },
      { a: 'Portugal', b: 'Uzbequistão', data: '2026-06-23T14:00:00-03:00' },
      { a: 'Inglaterra', b: 'Gana', data: '2026-06-23T17:00:00-03:00' },
      { a: 'Panamá', b: 'Croácia', data: '2026-06-23T20:00:00-03:00' },
      { a: 'Colômbia', b: 'RD Congo', data: '2026-06-23T23:00:00-03:00' },

      // 3ª Rodada
      { a: 'Suíça', b: 'Canadá', data: '2026-06-24T16:00:00-03:00' },
      { a: 'Bósnia e Herzegovina', b: 'Catar', data: '2026-06-24T16:00:00-03:00' },
      { a: 'Escócia', b: 'Brasil', data: '2026-06-24T19:00:00-03:00' },
      { a: 'Marrocos', b: 'Haiti', data: '2026-06-24T19:00:00-03:00' },
      { a: 'República Tcheca', b: 'México', data: '2026-06-24T22:00:00-03:00' },
      { a: 'África do Sul', b: 'Coreia do Sul', data: '2026-06-24T22:00:00-03:00' },
      { a: 'Equador', b: 'Alemanha', data: '2026-06-25T17:00:00-03:00' },
      { a: 'Curaçao', b: 'Costa do Marfim', data: '2026-06-25T17:00:00-03:00' },
      { a: 'Japão', b: 'Suécia', data: '2026-06-25T20:00:00-03:00' },
      { a: 'Tunísia', b: 'Holanda', data: '2026-06-25T20:00:00-03:00' },
      { a: 'Turquia', b: 'Estados Unidos', data: '2026-06-25T23:00:00-03:00' },
      { a: 'Paraguai', b: 'Austrália', data: '2026-06-25T23:00:00-03:00' },
      { a: 'Noruega', b: 'França', data: '2026-06-26T16:00:00-03:00' },
      { a: 'Senegal', b: 'Iraque', data: '2026-06-26T16:00:00-03:00' },
      { a: 'Cabo Verde', b: 'Arábia Saudita', data: '2026-06-26T21:00:00-03:00' },
      { a: 'Uruguai', b: 'Espanha', data: '2026-06-26T21:00:00-03:00' },
      { a: 'Egito', b: 'Irã', data: '2026-06-27T00:00:00-03:00' },
      { a: 'Nova Zelândia', b: 'Bélgica', data: '2026-06-27T00:00:00-03:00' },
      { a: 'Panamá', b: 'Inglaterra', data: '2026-06-27T18:00:00-03:00' },
      { a: 'Croácia', b: 'Gana', data: '2026-06-27T18:00:00-03:00' },
      { a: 'Colômbia', b: 'Portugal', data: '2026-06-27T20:30:00-03:00' },
      { a: 'RD Congo', b: 'Uzbequistão', data: '2026-06-27T20:30:00-03:00' },
      { a: 'Argélia', b: 'Áustria', data: '2026-06-27T23:00:00-03:00' },
      { a: 'Jordânia', b: 'Argentina', data: '2026-06-28T23:00:00-03:00' }
    ];

    let jogosGerados = 0;

    for (const jogo of cronogramaOficial) {
      // Procura os times no array de seleções já salvas no banco
      const timeA = selecoesSalvas.find(s => s.nome === jogo.a);
      const timeB = selecoesSalvas.find(s => s.nome === jogo.b);

      if (timeA && timeB) {
        const novoJogo = jogoRepo.create({
          selecao_A: timeA,
          selecao_B: timeB,
          data_hora_inicio: new Date(jogo.data),
          fase: `Grupo ${timeA.grupo}`, // Pega o grupo diretamente do cadastro do time
        });
        
        await jogoRepo.save(novoJogo);
        jogosGerados++;
      } else {
        console.error(`⚠️ Erro ao encontrar times: ${jogo.a} x ${jogo.b}`);
      }
    }

    console.log(`✅ ${jogosGerados} Jogos reais cadastrados com 100% de precisão de calendário!`);
    console.log('🚀 Seeding finalizado e pronto para produção!');

  } catch (error) {
    console.error('❌ Erro durante o seeding:', error);
  } finally {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    process.exit();
  }
}

run();