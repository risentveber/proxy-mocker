FROM node:8-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 8080
COPY . .

CMD [ "node", "index.js" ]
