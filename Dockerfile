FROM node:8.4-slim

# Create app directory
RUN mkdir -p /app
WORKDIR /app
ADD . .

RUN yarn --frozen-lockfile && \
    yarn build

ENV PORT=3000
ENV API_ENDPOINT_URL=http://localhost:7080/api/
ENV APPINSIGHTS_INSTRUMENTATIONKEY=secretkey
ENV USE_API_GATEWAY_AUTH=no
ENV NOMS_PRIVATE_KEY=secretkey
ENV NOMS_TOKEN=secrettoken

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
