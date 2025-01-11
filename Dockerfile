FROM node:20
LABEL authors="Lawrence Davis"

RUN npm install -g nx@latest

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

RUN nx run-many -t build -p spin-cycle spin-cycle-client

# Copy client dist to api dist

ENTRYPOINT ["node", "/usr/bin/app"]
