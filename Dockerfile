FROM node:24-slim AS base
RUN apt-get update -y && apt-get install -y openssl

FROM base AS deps
COPY . /app
WORKDIR /app
RUN npm ci

FROM base AS build
COPY . /app/
COPY --from=deps /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM base
COPY ./package.json ./package-lock.json ./schema.prisma /app/
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]