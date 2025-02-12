FROM node:21-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 1431

CMD [ "npm", "run", "dev" ]