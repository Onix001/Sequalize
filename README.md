# Meu Projeto Sequelize - Versão Completa

Este repositório contém uma versão completa do projeto **Sistema de Usuários** com:
- Autenticação (Passport + bcrypt + sessions)
- Paginação, busca e filtros na listagem
- Validações com express-validator
- API REST básica (JSON)
- Testes automatizados (mocha + supertest) - teste de smoke
- Dockerfile e docker-compose para ambiente de desenvolvimento

## Como usar (local)

1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis (DB, SESSION_SECRET):
cp .env.example .env

2. Crie o banco no MySQL (ou execute via docker-compose):
CREATE DATABASE nodesequelize CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Instale as dependências:
npm install

4. Execute em modo desenvolvimento:
npm run dev

5. Abra no navegador: http://localhost:3000

## Scripts disponíveis

- npm start - inicia a aplicação
- npm run dev - inicia com nodemon
- npm test - executa testes (assume servidor rodando)

## Deploy (Docker)

1. Execute o build e suba os containers:
docker-compose up --build

2. Aguarde o MySQL iniciar; o contêiner `web` fará a conexão automaticamente com o host `db`.

## Próximos passos e melhorias sugeridas

- Implementar proteção da API (/api) com JWT ou sessions
- Melhorar views: mensagens flash e tratamento de erros mais amigável
- Tornar filtros e paginação mais robustos (ordenar, filtrar por cidade, etc.)
- Implementar roles (admin, user) e autorização de ações
- Criar testes unitários para modelos e testes de integração para rotas (mock DB)
- Configurar CI/CD (GitHub Actions) e deploy em serviços como Railway, Render ou Heroku
- Segurança: HTTPS, cookies seguros, rate limiting, helmet para produção

## Observações

- O projeto foi gerado automaticamente com exemplos funcionais; valide as variáveis de ambiente antes de rodar.
- Certifique-se de que o MySQL esteja rodando e acessível com as credenciais do `.env`.
