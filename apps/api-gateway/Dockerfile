FROM node:20-alpine AS development

WORKDIR /app

# Habilita Yarn Moderno
RUN corepack enable && corepack prepare yarn@stable --activate

# Etapa 1: Copia apenas os arquivos necessários para instalação
# Copia arquivos raiz
COPY package.json yarn.lock ./

# Copia configurações TypeScript
COPY tsconfig*.json ./
COPY apps/api-gateway/nest-cli.json ./nest-cli.json

# Copia TODOS os package.json (mantém a ordem para cache eficiente)
COPY apps/ ./apps/
COPY packages/ ./packages/

# Remove código fonte temporariamente (apenas package.json)
# Isso garante que mudanças no código não invalidem o cache de dependências
RUN find ./apps -type f -not -name "package.json" -not -name "package-lock.json" -delete 2>/dev/null || true
RUN find ./packages -type f -not -name "package.json" -delete 2>/dev/null || true

# Etapa 2: Instala dependências (agora enxerga todos os workspaces)
RUN yarn install --immutable

# Etapa 3: Copia todo o código fonte (após instalação para melhor cache)
COPY . .

WORKDIR /app/apps/api-gateway

EXPOSE 3001

CMD ["yarn", "start:dev"]
