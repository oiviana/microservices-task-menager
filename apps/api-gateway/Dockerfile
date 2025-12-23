FROM node:20-alpine AS development

WORKDIR /app

# Yarn 4 via corepack
RUN corepack enable

# Arquivos raiz do monorepo
COPY package.json yarn.lock .yarnrc.yml ./
COPY tsconfig*.json ./

# Copia os package.json dos workspaces
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY apps/web/package.json ./apps/web/
COPY packages/ packages/

# Instala dependências (workspaces válidos)
RUN yarn install --immutable

WORKDIR /app/apps/api-gateway

EXPOSE 3001

CMD ["yarn", "start:dev"]
