FROM node:20-alpine AS development

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY apps/tasks-service/package*.json ./apps/tasks-service/
COPY packages/ ./packages/

RUN yarn install --frozen-lockfile

COPY . .

WORKDIR /app/apps/tasks-service

EXPOSE 3003

CMD ["yarn", "start:dev"]