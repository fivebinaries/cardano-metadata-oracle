FROM node:latest

COPY . /app
WORKDIR /app

RUN npm install

ENTRYPOINT ["/app/bin/run"]
