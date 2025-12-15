FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY tsconfig*.json ./

COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/

RUN yarn install --immutable

COPY . .

WORKDIR /app/apps/auth-service

EXPOSE 3002

CMD ["yarn", "start:dev"]
