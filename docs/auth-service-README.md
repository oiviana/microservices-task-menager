# auth-service

## Propósito

Autenticação e gerenciamento de usuários: login, refresh token, registro (se aplicável) e verificação de credenciais. Emite JWTs usados pelo `api-gateway`.

## Porta (desenvolvimento)

- 3002 (conforme `docker-compose.yml`)

## Variáveis de ambiente importantes

- `PORT` — porta do serviço
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — conexão com Postgres
- `RABBITMQ_URL` — URL do RabbitMQ (amqp)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — segredos para tokens

## Como rodar localmente (desenvolvimento)

```bash
cd apps/auth-service
yarn install
yarn start:dev
```

Ou via Docker Compose (mapeamento de volumes já configurado):

```bash
docker compose up -d --build auth-service
```

## Endpoints principais (resumo)

- `POST /auth/login` — autentica e retorna `{ accessToken, refreshToken }`
- `POST /auth/refresh` — recebe refresh token e retorna novo access token
- `POST /auth/register` — registra usuário (se implementado)

Consulte `apps/auth-service/src` para rotas e DTOs detalhados.

## Observações técnicas

- Usar validação de entrada (class-validator) para DTOs.
- Tokens curtos para access e refresh mais longos; armazenar refresh em DB se necessário para revogação.
- Logs: ajustar nível em produção.
