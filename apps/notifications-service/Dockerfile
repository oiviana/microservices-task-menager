FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY tsconfig*.json ./

COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY apps/web/package.json ./apps/web/
COPY packages/ packages/

RUN yarn install --immutable

WORKDIR /app/apps/notifications-service

EXPOSE 3004

CMD ["yarn", "start:dev"]
