FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./

COPY tsconfig*.json ./
COPY apps/tasks-service/nest-cli.json ./nest-cli.json

COPY apps/ ./apps/
COPY packages/ ./packages/

RUN find ./apps -type f -not -name "package.json" -not -name "package-lock.json" -delete 2>/dev/null || true
RUN find ./packages -type f -not -name "package.json" -delete 2>/dev/null || true

RUN yarn install --immutable

COPY . .

WORKDIR /app/apps/tasks-service

EXPOSE 3003

CMD ["yarn", "start:dev"]
