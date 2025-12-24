# api-gateway

## Propósito

Ponto de entrada único (BFF/API Gateway): autenticação de requests, roteamento para microserviços, agregação quando necessário e proxy para o frontend.

## Porta (desenvolvimento)

- 3001 (conforme `docker-compose.yml`)

## Variáveis de ambiente importantes

- `PORT`
- `RABBITMQ_URL`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`

## Como rodar localmente

```bash
cd apps/api-gateway
yarn install
yarn start:dev
```

Ou via Docker Compose:

```bash
docker compose up -d --build api-gateway
```

## Rotas/Integração

- Roteia chamadas para `/auth`, `/tasks`, `/comments`, etc. Consulte `apps/api-gateway/src` para os controllers e proxies.
- Autenticação: valida `Authorization: Bearer <token>` e pode realizar refresh via `auth-service`.

## Observações técnicas

- Recomenda-se centralizar políticas de rate limiting, CORS e caching aqui.
- Para endpoints com alto tráfego, considerar proxy direto para serviço específico ou cache reverso.
