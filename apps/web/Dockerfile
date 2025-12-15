FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

# Copia arquivos raiz
COPY package.json yarn.lock ./
COPY tsconfig*.json ./

# Copia TODOS os package.json
COPY apps/ ./apps/
COPY packages/ ./packages/

# Remove código fonte temporariamente
RUN find ./apps -type f -not -name "package.json" -delete 2>/dev/null || true
RUN find ./packages -type f -not -name "package.json" -delete 2>/dev/null || true

RUN yarn install --immutable

COPY . .

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["yarn", "dev", "--host", "0.0.0.0"]