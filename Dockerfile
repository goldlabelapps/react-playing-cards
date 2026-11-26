# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json ./

RUN pnpm install || (pnpm approve-builds --all && pnpm install)

COPY . .

RUN pnpm build && pnpm build:bundle

EXPOSE 3800

CMD ["pnpm", "studio"]
