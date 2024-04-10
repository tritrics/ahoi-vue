FROM node:20-alpine
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run format