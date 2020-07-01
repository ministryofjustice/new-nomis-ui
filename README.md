[![CircleCI](https://circleci.com/gh/ministryofjustice/new-nomis-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/new-nomis-ui)
[![Known Vulnerabilities](https://snyk.io/test/github/ministryofjustice/new-nomis-ui/badge.svg)](https://snyk.io/test/github/ministryofjustice/new-nomis-ui)

# New Nomis UI

This is the backend front end web app. It consists of a Node.JS application to handle server side calls
to the Elite2 API and other APIs.

## Cloning the Repo

```bash
git clone git@github.com:ministryofjustice/new-nomis-ui.git
cd new-nomis-ui
```

## Running the application in dev mode

```bash
npm install
npm run build
npm start
```

This will point at a API server at localhost:8080 This can be overridden in development mode by adding a `.env`
file e.g.

```properties
PORT=3000
API_ENDPOINT_URL=http://localhost:8080/api
```

`.gitignore` ensures this is not checked in.

## Running the application in production mode

Use npm build use the webpack transpiler to convert to ES5 javascript:

```bash
npm run build
npm start:prod
```

## Running tests

The system makes use of mocha to run the tests:

```bash
npm test
```

### Starting feature tests node instance

A separate node instance needs to be started for the feature tests. This will run on port 3006 and won't conflict
with any of the api services, e.g. elite2-api or oauth.

`npm start-feature --env=feature.env`

**To run the tests using Gradle:**
Ensure that chromedriver is on your path. Run `./gradlew build` from the root of this project.
The Gradle build will produce report(s) at `notm-specs/reports/tests`

**To run the tests from IntelliJ IDEA:**
Ensure that `build.gradle` is linked to the IDE project (See here: https://www.jetbrains.com/help/idea/gradle.html)
and that `chromedriver` is on the PATH. Open a Spock Specification
(`specs.LoginSpecification` for example). The gutter should
now display 'run' icons for the class and each of its tests methods.

## Checking bundle size

To view the bundle size using webpack-bundle-analyzer:

```bash
npm build
npm view-bundle-stats
```

## Environment

These are the main environment variables that can be set in a `.env` file
or with in `docker-compose.yml` Examples are shown below:-

      - PORT=3000
      - API_ENDPOINT_URL=http://elite2-api:8080/api/



## CI Build

The CI build will kick off on all pushes to the git repo. It will checkout, build dependancies and run the tests

If you wish to view the CI build you’ll need an account – get one [here](https://circleci.com/signup/)
and link to your repos.

Upon merging into main the system will build a production version and check this into the `deploy_to_mock` branch where upon
Azure will trigger a build and deploy into the dev environment at [notm-dev.hmpps.dsd.io](https://notm-dev.hmpps.dsd.io)

### Building the docker images

CI will also build a docker image and push to our [Docker Hub](https://hub.docker.com/u/ministryofjustice/).
You will also need a [docker hub account](https://hub.docker.com/?next=https%3A%2F%2Fhub.docker.com%2F), \

## Running the application using docker and docker compose.

You can run the application in a docker container using:-

```bash
docker login
docker run --rm --name new-nomis-ui \
   -p 3000:3001 -e PORT=3001 sysconjusticesystems/elite2-web
```

To view logs:
`docker logs new-nomis-ui`

To stop (if running with -d):
`docker stop new-nomis-ui`

#### Docker compose - so much easier!

The stack can be run using docker-compose thus:

```bash
 docker-compose –d up
```

This will run a local api and web application and point to the Nomis QA database.

You can change this to point to another DB
by changing the `SPRING_DATASOURCE_URL` in the `docker-compose.yml` file

## Useful Scripts

There are some node scripts in the testScripts folder which may be generally useful. Like the express
server these scripts take configuration values from the config.js and .env files. So they will automatically
work against the elite/keyworker end-points that you have configured for the express server.

These scripts are:

### oauth.js

given a username/password authenticates against the oauth end-point and prints out the contents of the access_token and
refresh_token. Usage:

`node testScripts/oauth.js <username> <password>`

### health-elite.js and health-keyworker.js

Pings the health endpoints for the elite / keyworker apis and prints the response. Usage

`node testScripts/health-elite.js`

`node testScripts/health-keyworker.js`

### agencies.js

Authenticates, GETs the elite `/api/agencies` end-point and prints the result. Usage:

`node testScripts/agencies <username> <password>`

### agency-loop.js

Authenticates, then repeatedly GETs the elite `/api/agencies` end-point (with a delay). Uses the server's
`tokenRefresher.js` to refresh tokens as they approach their expiry time. Prints progress.
Useful for checking the server's token expiry / refresh logic. Usage:

`node testScript/agency-loop.js <username> <password>`

### decodeCookie.js

Decodes the HMPPS cookie value from stdin and prints the result. Usage:

1. Copy the cookie value to the clip-board (from the Browser developer tools output perhaps)
2. `pbpaste | node testScript/decodeCookie`
