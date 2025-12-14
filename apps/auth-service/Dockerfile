FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar configurações
COPY package.json yarn.lock ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar dependências específicas
COPY apps/auth-service/package*.json ./apps/auth-service/

# Copiar packages compartilhados
COPY packages/ ./packages/

RUN yarn install --frozen-lockfile

COPY . .

WORKDIR /app/apps/auth-service

EXPOSE 3002

CMD ["yarn", "start:dev"]
