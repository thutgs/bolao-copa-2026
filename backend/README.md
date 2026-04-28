# 🏆 Bolão da Copa do Mundo 2026 - API (Back-end)

Este é o motor do sistema de palpites desportivos interativos (Bolão) desenvolvido com **NestJS**. O projeto foi arquitetado com foco em alta performance, código limpo e regras de negócio blindadas para suportar o novo formato da Copa do Mundo de 2026 (48 seleções e 12 grupos).

## 🛠️ Stack Tecnológica
* **Runtime:** Node.js v20+
* **Framework:** [NestJS](https://nestjs.com/)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Base de Dados:** PostgreSQL
* **Segurança:** JWT (JSON Web Tokens) & Bcrypt
* **Validação:** `class-validator` & `class-transformer`

---

## 🗄️ Arquitetura de Dados (Modelo Relacional)
O sistema utiliza uma base de dados relacional sólida com 6 tabelas principais interligadas:
1. **Utilizador:** Gere credenciais, funções (`is_global_admin`) e a seleção preferida.
2. **Bolão:** Ligas privadas que geram códigos únicos de convite (ex: `A7X9WQ`).
3. **Utilizador_Bolao:** Tabela pivô (Many-to-Many) que armazena os participantes de cada liga e o seu ranking (pontuação total) isolado naquele grupo.
4. **Seleção:** As 48 nações oficiais de 2026, categorizadas de Grupo A ao L, com URLs para *assets* de bandeiras.
5. **Jogo:** Registo de confrontos, datas, fases e o resultado real da partida finalizada.
6. **Palpite:** O palpite individual de cada utilizador atrelado a um jogo.

---

## ⚙️ Regras de Negócio e Motores Principais

### 1. Motor de Pontuação e Ranking
A engine de cálculo é acionada pelo Administrador ao finalizar um jogo. O sistema analisa os palpites e distribui os pontos automaticamente na tabela pivô dos bolões:
* **3 Pontos (Cravo):** Acerto exato do resultado.
* **1 Ponto (Tendência):** Acerto do vencedor ou se houve empate.
* **0 Pontos (Erro):** Erro total.
* *Nota:* Para o mata-mata, empates no tempo regulamentar contabilizam palpites de empate. O vencedor das grandes penalidades é registado exclusivamente para desenhar a árvore do torneio.

### 2. Trava de Segurança Temporal
* A API bloqueia e rejeita qualquer operação de criação (`POST`) ou edição (`PATCH`) de palpites caso o relógio do servidor (`new Date()`) seja superior ou igual à `data_hora_inicio` da partida em questão (HTTP 403 Forbidden).

### 3. Motor Oficial da FIFA 2026
A API possui algoritmos internos para espelhar as regras da Copa:
* Cálculo automático da tabela de classificação da fase de grupos com critérios de desempate oficiais (Pontos > Saldo > Golos Marcados > Ordem Alfabética).
* Algoritmo de cruzamento para gerar e extrair o ranking dos **8 Melhores Terceiros Colocados**.
* Endpoint para geração híbrida dos confrontos de Dezesseis-avos (Round of 32), alocando 1º e 2º classificados automaticamente e deixando vagas pendentes para os terceiros.

---

## 🚀 Guia de Inicialização (Onboarding)

### 1. Pré-requisitos
* Node.js instalado (v20+).
* PostgreSQL a correr localmente (porta 5432) com uma base de dados vazia chamada `bolao_db`.

### 2. Instalação
Clone o repositório e instale as dependências do back-end:
```bash
cd backend
npm install
```

### 3. Configuração do Ambiente (.env)
Crie um ficheiro .env na raiz da pasta backend seguindo o modelo do .env.example:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha_da_base_de_dados
DB_NAME=bolao_db
```

### 4. Alimentação da Base de Dados (Seed Inteligente)
O projeto conta com um script de seed protegido que preenche a base com as 48 seleções oficiais e gera os 72 confrontos da fase de grupos. Execute:

```bash
npx ts-node seed.ts
```

### 5. Execução da Aplicação
Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```
A API estará a correr em http://localhost:3000.

## 🔒 Hierarquia e Acessos
A maior parte das rotas exige um Bearer Token JWT válido.

Utilizadores Comuns: Podem criar bolões, gerar convites, consultar jogos e submeter palpites.

Global Admin (is_global_admin: true): Possui acesso exclusivo a rotas de gestão de jogos oficiais, finalização de resultados e geração do mata-mata.
