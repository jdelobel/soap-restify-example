FROM mhart/alpine-node:8

WORKDIR /data/api

ADD "node_modules/" "/data/api/node_modules"
ADD "wsdl" "/data/api/wsdl"
ADD "config/" "/data/api/config"
ADD "routes/" "/data/api/routes"
ADD "middlewares/" "/data/api/middlewares"
ADD "utils/" "/data/api/utils"
ADD "index.js" "/data/api/"
ADD "package-lock.json" "/data/api/"
ADD "package.json" "/data/api/"
RUN npm prune --production && npm rebuild

RUN addgroup api && \
    adduser -D -h /data/api api -G api && \
    chown -R api:api /data/api

USER api

ENTRYPOINT ["npm", "start"]
