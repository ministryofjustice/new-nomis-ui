FROM node:alpine

# Create app directory
RUN mkdir -p /code
WORKDIR /code
ADD . /code

# Install app dependencies
RUN yarn --frozen-lockfile && \
    NODE_ENV=production yarn build && \
    yarn cache clean

ENV PORT=3000
ENV NODE_ENV=production
ENV API_ENDPOINT_URL=http://localhost:7080/
ENV REWRITE_CONTEXT_ENDPOINT=/api/
ENV APPINSIGHTS_INSTRUMENTATIONKEY=secretkey
ENV USE_API_AUTH=no
ENV NOMS_PRIVATE_KEY=undef
ENV NOMS_TOKEN=undef

CMD [ "yarn", "start" ]
EXPOSE 3000
