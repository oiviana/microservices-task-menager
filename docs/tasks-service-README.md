# tasks-service

## Propósito

Gerenciar tarefas: CRUD, comentários e regras de negócio relacionadas a tasks.

## Porta (desenvolvimento)

- 3003 (conforme `docker-compose.yml`)

## Variáveis de ambiente importantes

- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `RABBITMQ_URL` (para publicar/consumir eventos quando necessário)

## Como rodar localmente

```bash
cd apps/tasks-service
yarn install
yarn start:dev
```

Ou via Docker Compose:

```bash
docker compose up -d --build tasks-service
```

## Endpoints principais (resumo)

- `GET /tasks` — listar tarefas (com paginação/filtragem se implementado)
- `POST /tasks` — criar tarefa
- `GET /tasks/:id` — obter tarefa
- `PUT /tasks/:id` — atualizar tarefa
- `DELETE /tasks/:id` — deletar tarefa

## Observações técnicas

- Possível uso de filas para operações assíncronas (e.g., indexação, notificações).
- Verificar migrações/entidades em `apps/tasks-service/src/database`.
