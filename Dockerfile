FROM node:20
LABEL authors="Lawrence Davis"

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV NODE_ENV=production

RUN npm add --global nx

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --include=dev
COPY . .

RUN nx run-many -t build -p spin-cycle spin-cycle-client --prod
# Compile TypeORM migrations to JS for production runtime and run migrations
RUN npx tsc -p apps/spin-cycle/tsconfig.migrations.json
RUN npm run db:migrate:run

RUN cp -R dist/apps/spin-cycle-client dist/apps/spin-cycle/assets/

ENTRYPOINT ["node", "dist/apps/spin-cycle/main.js"]
