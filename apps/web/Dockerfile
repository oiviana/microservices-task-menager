# ============ ESTÁGIO DE DESENVOLVIMENTO ============
FROM node:20-alpine AS development

WORKDIR /app

# Instala yarn globalmente (se necessário)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copia arquivos de configuração do monorepo
COPY package.json yarn.lock ./

# Copia dependências do frontend
COPY apps/web/package*.json ./apps/web/

# Copia packages compartilhados (se houver)
COPY packages/ ./packages/

# Instala dependências
RUN yarn install --frozen-lockfile

# Copia código fonte
COPY . .

WORKDIR /app/apps/web

# Expoe a porta do Vite
EXPOSE 3000

# Comando para desenvolvimento (hot reload)
CMD ["yarn", "dev", "--host", "0.0.0.0"]


# ============ ESTÁGIO DE PRODUÇÃO ============
# FROM node:20-alpine AS production

# WORKDIR /app

# # Instala yarn
# RUN corepack enable && corepack prepare yarn@stable --activate

# # Copia apenas o necessário do estágio development
# COPY --from=development /app/package.json ./
# COPY --from=development /app/yarn.lock ./
# COPY --from=development /app/node_modules ./node_modules
# COPY --from=development /app/apps/web ./apps/web
# COPY --from=development /app/packages ./packages

# WORKDIR /app/apps/web

# # Build da aplicação
# RUN yarn build

# # Expoe a porta
# EXPOSE 3000

# # Serve build de produção
# CMD ["yarn", "preview", "--host", "0.0.0.0"]