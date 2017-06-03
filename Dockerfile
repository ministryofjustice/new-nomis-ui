FROM node:alpine

# Create app directory
RUN mkdir -p /code
WORKDIR /code
ADD . /code

# Install app dependencies
RUN yarn --frozen-lockfile && \
    yarn run build && \
    yarn run prune && \
    yarn cache clean

CMD [ "yarn", "start" ]
EXPOSE 3000
