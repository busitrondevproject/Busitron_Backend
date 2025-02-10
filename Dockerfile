FROM node:22-alpine

WORKDIR /Busitron_Backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm","run","start"]