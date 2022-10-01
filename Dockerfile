FROM node:latest
LABEL description="A demo Dockerfile for build Docsify."
WORKDIR /docs
RUN set -x \
  && ls \
  && node -v
# EXPOSE 5001
# ENTRYPOINT docsify serve .
