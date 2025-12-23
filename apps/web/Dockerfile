FROM node:20-alpine AS development

WORKDIR /app

# Ativa corepack
RUN corepack enable

# Copia arquivos base do monorepo
COPY package.json yarn.lock .yarnrc.yml ./

# Copia SOMENTE os package.json dos workspaces
COPY apps/web/package.json ./apps/web/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY packages/ packages/

# Instala dependências do MONOREPO
RUN yarn install --immutable


WORKDIR /app/apps/web

EXPOSE 3000

CMD ["yarn", "dev", "--host", "0.0.0.0"]
