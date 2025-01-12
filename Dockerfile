FROM node:20
LABEL authors="Lawrence Davis"

RUN npm install -g nx@latest

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

RUN nx run-many -t build -p spin-cycle spin-cycle-client
RUN cp -R dist/apps/spin-cycle-client dist/apps/spin-cycle/assets/

ENTRYPOINT ["node", "dist/apps/spin-cycle/main.js"]
