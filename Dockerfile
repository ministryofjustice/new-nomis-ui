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
ENV APPINSIGHTS_INSTRUMENTATIONKEY=secretkey
ENV NOMS_PRIVATE_KEY=private-key
ENV NOMS_TOKEN=token

CMD [ "yarn", "start" ]
EXPOSE 3000
