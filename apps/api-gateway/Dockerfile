FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

# Arquivos raiz do monorepo
COPY package.json yarn.lock ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# App específico
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json

# Packages compartilhados
COPY packages ./packages

RUN yarn install --frozen-lockfile

COPY . .

WORKDIR /app/apps/api-gateway

EXPOSE 3001

CMD ["yarn", "start:dev"]
