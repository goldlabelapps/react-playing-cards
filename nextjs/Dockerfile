# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY nextjs/package.json ./nextjs/

RUN pnpm install || (pnpm approve-builds --all && pnpm install)

COPY . .

EXPOSE 3830

CMD ["pnpm", "--filter", "nextjs", "dev"]
