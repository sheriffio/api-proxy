FROM node:8.1-alpine

COPY . /app
WORKDIR /app

RUN npm install

CMD ["npm", "start"]
