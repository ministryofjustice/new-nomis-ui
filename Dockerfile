FROM node:8.4-alpine

# Create app directory
RUN mkdir -p /code
WORKDIR /code
ADD . /code

RUN yarn --frozen-lockfile && \
    yarn build

ENV PORT=3000
ENV NODE_ENV=production
ENV API_ENDPOINT_URL=http://localhost:7080/api/
ENV APPINSIGHTS_INSTRUMENTATIONKEY=secretkey
ENV USE_API_GATEWAY_AUTH=no
ENV NOMS_PRIVATE_KEY=undef
ENV NOMS_TOKEN=undef

CMD [ "yarn", "start:prod" ]
EXPOSE 3000
