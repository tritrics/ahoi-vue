FROM node:22-alpine
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run format