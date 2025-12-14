FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY apps/notifications-service/package*.json ./apps/notifications-service/
COPY packages/ ./packages/

RUN yarn install --frozen-lockfile

COPY . .

WORKDIR /app/apps/notifications-service

EXPOSE 3004

CMD ["yarn", "start:dev"]