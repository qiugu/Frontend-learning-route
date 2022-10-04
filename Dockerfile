FROM node:16-buster-slim

LABEL description="A demo Dockerfile for build Docsify."

COPY . /var/web/

RUN set -x \
  && cd /var/web \
  && npm install \
  && npm run build

FROM nginx:1.23.1-alpine

# EXPOSE 80
COPY --from=0 /var/web/docs /usr/share/nginx/html
CMD [ "nginx", "-g", "daemon off;" ]
