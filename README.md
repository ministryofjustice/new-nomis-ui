# New Nomis UI

This is the backend front end web app.  It consists of a Node.JS application to handle server side calls 
to the Elite2 API and other APIs.

## Cloning the Repo

```bash
git clone git@github.com:ministryofjustice/new-nomis-ui.git
cd new-nomis-ui
```

## Running the application in dev mode
```bash
`yarn`
`yarn start`
```

This will point at a API server at localhost:8080  This can be overridden in development mode by adding a `.env`
file e.g.

```properties
PORT=3000
USE_API_GATEWAY_AUTH=no
API_ENDPOINT_URL=http://localhost:8080/api
```

`.gitignore` ensures this is not checked in.

## Running the application in production mode

Use yarn build use the webpack transpiler to convert to ES5 javascript:

```bash
yarn build:hmpps
yarn start:prod
```

## Running tests
The system makes use of mocka to run test:

```bash
yarn test
```

## Environment 

These are the main environment variables that can be set in a `.env` file 
or with in `docker-compose.yml`  Examples are shown below:-

      - PORT=3000
      - API_ENDPOINT_URL=http://elite2-api:8080/api/
      - USE_API_GATEWAY_AUTH=no

      
## CI Build
The CI build will kick off on all pushes to the git repo. It will checkout, build dependancies and run the tests

If you wish to view the CI build you’ll need an account – get one [here](https://circleci.com/signup/) 
and link to your repos.

Upon merging into master the system will build a production version and check this into the `deploy_to_mock` branch where upon
Azure will trigger a build and deploy into the dev environment at [notm-dev.azurewebsites.net](http://notm-dev.azurewebsites.net)

### Building the docker images
CI will also build a docker image and push to our [Syscon Docker Hub](https://hub.docker.com/u/sysconjusticesystems/). 
 You will also need a [docker hub account](https://hub.docker.com/?next=https%3A%2F%2Fhub.docker.com%2F),  \
 once you get one let us know your details and we will add your details to the Syscon account.
 

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

 

 