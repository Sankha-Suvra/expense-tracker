FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

FROM node:22-alpine

WORKDIR /app


ENV NODE_ENV=production_docker
ENV PORT=3000


ENV DB_PORT=3306
ENV DB_USER=root

ENV DB_NAME=expense_tracker
ENV DB_DIALECT=mysql

#optionally include for ssl support
ENV DB_SSL_CA_PATH=""
ENV DB_SSL_CA_BASE64=""
ENV DB_SSL_CA_CONTENT=""


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .


EXPOSE ${PORT}

CMD [ "node", "index.js" ]
