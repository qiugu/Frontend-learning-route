FROM node:16-buster-slim as dependency

LABEL description="A demo Dockerfile for build Docsify."

COPY . /var/web/

WORKDIR /var/web

RUN set -x \
&& npm install

FROM node:16-buster-slim as builder

COPY --from=0 /var/web /var/web

WORKDIR /var/web

RUN set -x \
&& npm run build

FROM nginx:1.23.1-alpine as prod

EXPOSE 80

COPY --from=1 /var/web/docs /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]
