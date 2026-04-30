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
    console.log('⚽ Gerando tabela de confrontos da Fase de Grupos...');
    let dataJogoBase = new Date('2026-06-11T16:00:00Z'); // Horário base do primeiro jogo
    let jogosGerados = 0;

    // Percorre os grupos de A a L
    for (const letraGrupo of 'ABCDEFGHIJKL') {
      const timesGrupo = selecoesSalvas.filter((s) => s.grupo === letraGrupo);
      
      if (timesGrupo.length !== 4) continue; // Segurança caso falte algum time

      // Formato clássico: Rodada 1 (1x2, 3x4), Rodada 2 (1x3, 4x2), Rodada 3 (4x1, 2x3)
      const confrontos = [
        [0, 1], [2, 3], 
        [0, 2], [3, 1], 
        [3, 0], [1, 2], 
      ];

      for (const [idxA, idxB] of confrontos) {
        const novoJogo = jogoRepo.create({
          selecao_A: timesGrupo[idxA],
          selecao_B: timesGrupo[idxB],
          data_hora_inicio: new Date(dataJogoBase),
          fase: `Grupo ${letraGrupo}`,
        });
        await jogoRepo.save(novoJogo);
        jogosGerados++;
        
        // Pula 4 horas para o próximo jogo
        dataJogoBase.setHours(dataJogoBase.getHours() + 4);
      }
    }

    console.log(`✅ ${jogosGerados} Jogos da Fase de Grupos cadastrados com sucesso.`);
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