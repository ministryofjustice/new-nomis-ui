FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app/internals/webpack
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn --frozen-lockfile

COPY internals/webpack/webpack.prod.babel.js  /usr/src/app/internals/webpack/
RUN NODE_ENV=production yarn build

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
