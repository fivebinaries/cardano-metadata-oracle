FROM node:latest

COPY . /app
WORKDIR /app

RUN npm install
RUN npm pack && tar zxvf cardano-metadata-oracle-*.tgz && mv package dist && cd ./dist && npm install

ENTRYPOINT ["/app/dist/bin/run"]
