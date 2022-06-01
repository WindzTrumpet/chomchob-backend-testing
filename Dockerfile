FROM node:16.15-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

COPY . .

CMD yarn start