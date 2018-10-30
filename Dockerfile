FROM node:8-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
EXPOSE 8080
COPY . .

CMD [ "node", "index.js" ]
