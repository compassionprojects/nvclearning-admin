FROM node:16-alpine

COPY src /app
WORKDIR /app

RUN apk add --no-cache build-base python3 bash yarn git && \
  wget -O dumb-init -q https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 && \
  chmod +x dumb-init
RUN yarn install

COPY ./docker/wait-for-it.sh /usr/local
RUN chmod +x /usr/local/wait-for-it.sh

EXPOSE 3000
CMD ["./dumb-init", "yarn", "start"]
