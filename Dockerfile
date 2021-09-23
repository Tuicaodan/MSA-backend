FROM node:slim

RUN mkdir -p /app/server

WORKDIR /app/server

COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 4000

CMD ["node", "server.js"]dock