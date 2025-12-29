# Microservices Task Manager

Este repositório é um monorepo com microserviços Node/Nest/Vite organizados em `apps/` e pacotes compartilhados em `packages/`.

**Visão rápida**: serviços principais — `api-gateway`, `auth-service`, `tasks-service`, `notifications-service` e `web` (frontend).

**Arquitetura (ASCII)**

```
                +-------------------+
                |    web (3000)     |
                +--------+----------+
                         |
                         | HTTP
                         v
                +-------------------+
                |  api-gateway(3001)|
                +---+---+---+-------+
                    |   |   |
       HTTP         |   |   | RPC/AMQP
                    v   v   v
  +---------------+  +---------------+  +----------------+
  | auth-service  |  | tasks-service |  | notifications  |
  |    (3002)     |  |    (3003)     |  |    (3004)      |
  +---------------+  +---------------+  +----------------+
         |                  |                  |
         |                  |                  |
         +-------+----------+------------------+
                 |                            |
                 v                            v
              +-----------------------------+  +-------------+
              |        Postgres (5432)      |  | RabbitMQ    |
              +-----------------------------+  | (5672,15672) |
                                               +-------------+
```

Arquitetura simples: `api-gateway` expõe endpoints, delega para serviços via HTTP interno e mensagens AMQP (RabbitMQ) quando apropriado. Postgres é usado como datastore principal.

---

**Decisões técnicas & trade-offs**

- Monorepo (turbo): facilita compartilhar `packages/` e sincronizar versões; trade-off: maior tempo de CI e builds mais complexos.
- Nest.js para serviços: estrutura consistente, injeção de dependência, fácil teste; trade-off: curva inicial e boilerplate.
- RabbitMQ para comunicação assíncrona: bom para eventos e desacoplamento; trade-off: aumento de operacionalidade e complexidade em deploys locais.
- Docker Compose para desenvolvimento local: simples para orquestrar DB/RabbitMQ e múltiplos serviços; trade-off: não substitui ambientes de produção (k8s).

---

**Problemas conhecidos & melhorias**

- Configs sensíveis estão com valores de desenvolvimento em `docker-compose.yml` (ex.: senhas, JWT secrets). Melhorar: usar `.env` por serviço ou secrets manager.
- Falta de documentação automática das APIs (Swagger). Melhorar: adicionar Swagger em cada serviço e gerar referência central.
- Testes e e2e: existem testes esqueleto; ampliar cobertura e integrar ao CI.
- Observabilidade: adicionar logs estruturados, tracing e métricas (Prometheus/Jaeger).

---

**Tempo gasto (estimativa)**

- Montagem inicial do monorepo e scaffold: ~6–8h
- Implementação `auth-service` (básico): ~6h
- Implementação `tasks-service` (básico): ~8h
- Implementação `notifications-service` (básico): ~4h
- `api-gateway` e roteamento: ~4h
- Infra local (docker-compose, volumes): ~2h
- Documentação inicial (este README): ~1.5h

Total aproximado: 31–34 horas (estimativa a ser refinada conforme progresso).

---

## Como rodar (Quickstart)

Pré-requisitos: `docker` (daemon iniciado) e `docker compose` (v2) instalados; `yarn` disponível.

1) Instalar dependências na raiz:

```bash
yarn
```

2) (Opcional) Rebuild das imagens via script do projeto:

```bash
yarn docker:build
```

3) Subir o ambiente via script do projeto:

```bash
yarn docker:up
```

4) Acessos úteis:

- Frontend (dev): http://localhost:3000
- API Gateway: http://localhost:3001
- Postgres (porta exposta): 5432
- RabbitMQ management: http://localhost:15672 (user: `admin`, pass: `admin`)

5) pgAdmin (UI para gerenciar Postgres)

3️⃣ Acesse o pgAdmin no navegador:

👉 http://localhost:5050

Login:

Email: admin@admin.com

Senha: admin

4️⃣ Conecte no Postgres (uma vez só)

No pgAdmin:

- `Add New Server`

Aba `General`

Name: Postgres Microservices

Aba `Connection`

Host name/address: `db`

Port: `5432`

Username: `postgres`

Password: `password`

Marque `Save password`

Clique em `Save`

Pronto — você vai enxergar:

- Todas as tabelas
- Registros
- Schemas
- Logs de queries

6) Rodar migrações (após conectar o banco no pgAdmin):

```bash
yarn migrate:all
```

7) Logs (exemplo para `tasks-service`):

```bash
yarn docker:tasks
```

Para parar e remover containers (script do projeto):

```bash
yarn docker:down
```

---

## Documentação por serviço

### `auth-service`

- Propósito: autenticação, emissão de JWTs, refresh tokens e endpoints relacionados a usuários.
- Porta (dev): 3002
- Variáveis importantes (definidas no `docker-compose.yml`):
  - `PORT` (3002)
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `RABBITMQ_URL`
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`
- Como rodar localmente: dentro do monorepo o compose já mapeia volumes; em desenvolvimento:

```bash
cd apps/auth-service
yarn install
yarn start:dev
```

- Endpoints principais (resumo):
  - `POST /auth/login` — login (retorna access/refresh token)
  - `POST /auth/refresh` — troca refresh por novo access
  - `POST /auth/register` — criar usuário (se aplicável)

Notas: revisar `apps/auth-service/src` para DTOs e validações.

### `tasks-service`

- Propósito: CRUD de tarefas, regras de negócio relacionadas a tarefas e comentários.
- Porta (dev): 3003
- Variáveis importantes: mesmas do `auth-service` para DB e RabbitMQ.
- Como rodar localmente:

```bash
cd apps/tasks-service
yarn install
yarn start:dev
```

- Endpoints (resumo):
  - `GET /tasks` — listar tarefas
  - `POST /tasks` — criar tarefa
  - `GET /tasks/:id` — obter tarefa
  - `PUT /tasks/:id` — atualizar
  - `DELETE /tasks/:id` — apagar

### `notifications-service`

- Propósito: processar eventos (via RabbitMQ) e enviar notificações (e.g., por email/push — a implementação pode ser stub).
- Porta (dev): 3004
- Como rodar localmente:

```bash
cd apps/notifications-service
yarn install
yarn start:dev
```

- Comunicação: escuta filas em RabbitMQ; revisar handlers em `apps/notifications-service/src`.

### `api-gateway`

- Propósito: expor uma API única para o frontend, autenticar requests (JWT), rotear para microserviços e agir como BFF.
- Porta (dev): 3001
- Variáveis importantes: `PORT`, `RABBITMQ_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
- Como rodar localmente:

```bash
cd apps/api-gateway
yarn install
yarn start:dev
```

Endpoints: revisar `apps/api-gateway/src` — normalmente roteia para `/auth`, `/tasks`, `/comments`, etc.

### `web`

- Frontend (Vite + React). Status: ainda não iniciado (placeholder).
- Porta (dev): 3000
- Arquivo Docker e mapeamentos já configurados no `docker-compose.yml`.

---

## Docker & Docker Compose

- O `docker-compose.yml` no root orquestra os serviços para desenvolvimento local, expondo portas 3000..3004, Postgres e RabbitMQ.
- Cada serviço tem um `Dockerfile` em `apps/{service}/Dockerfile` com stage `development` usado por `docker-compose`.
- Volumes: mapeamentos facilitam live-reload durante desenvolvimento.

Recomendações:
- Mover segredos para `.env` ou usar `docker compose --env-file`.
- Para CI/produção, usar imagens construídas e um orquestrador adequado (k8s / ECS).

---

## Instruções específicas e notas

- Comandos úteis já presentes no repo (`package.json` raiz) podem incluir `yarn docker:build`. Use este comando antes de `docker compose up` quando desejar rebuild das imagens.
- Se precisar resetar banco local com dados de desenvolvimento, verifique scripts em `apps/*/database`.

---

## Próximos passos sugeridos

1. Adicionar Swagger/ OpenAPI em cada serviço e consolidar referência.
2. Mover secrets para `.env` e instruir `docker compose` a usar `--env-file`.

---
