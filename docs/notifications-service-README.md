# notifications-service

## Propósito

Processar eventos (via RabbitMQ) e enviar notificações (email, push, ou outro canal). Pode atuar como consumer para eventos gerados por `tasks-service` ou outros.

## Porta (desenvolvimento)

- 3004 (conforme `docker-compose.yml`)

## Variáveis de ambiente importantes

- `PORT`
- `DB_*` (se necessário)
- `RABBITMQ_URL`

## Como rodar localmente

```bash
cd apps/notifications-service
yarn install
yarn start:dev
```

Ou via Docker Compose:

```bash
docker compose up -d --build notifications-service
```

## Arquitetura de consumo

- O serviço deve declarar/consumir filas específicas em RabbitMQ (ver `apps/notifications-service/src`).
- Implementar retries/backoff e dead-letter queues para mensagens falhas.

## Observações técnicas

- Stub de envio: para desenvolvimento, a lógica de envio pode ser logada em vez de enviar de fato.
- Para envios reais, configurar provider (SMTP, Firebase, etc.) via env vars e secrets.
