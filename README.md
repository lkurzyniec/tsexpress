# tsexpress

Source code based on [TypeScript Express tutorial](https://wanago.io/courses/typescript-express-tutorial/).

## Repository contains

* NodeJS
* Express
* TypeScript
* ts-node-dev
* InversifyJS
* MongoDB with mongoose
* dotenv and envalid
* cors and helmet
* cookie-parser and json-ignore
* Swagger and SwaggerUI
* express-validator, class-transformer, class-validator
* express-promise-router
* bcrypt and jsonwebtoken
* jest

## What I like in this solution

* DI container (by InversifyJS) and injection of dependencies
* modularity - build at the top of SOLID rules, lowly coupled
* unit tests (with jest)

## Start

### Start MongoDB in Docker

Create volume to persist data.

```docker
docker volume create --name=mongodata
```

Run container.

```docker
docker run --name mongodb -v mongodata:/data/db -d -p 27017:27017 mongo:latest
```

### Configuration (environment variables)

Create `.env` file in the root directory as follows:

```ini
MONGO_USER=
MONGO_PASSWORD=
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=libraryDB
APPLICATION_PORT=5000
DEBUG=true
TOKEN_EXPIRATION_IN_MIN=15
```

### Start the application

Type `npm run dev` in terminal, the application will be available under `http://localhost:{APPLICATION_PORT}/` where `APPLICATION_PORT` is environment variable. By default is `http://localhost:5000/`.

To interact with API you can either send requests with [Postman](https://www.getpostman.com/) or send exemplary
request from [http queries](server-queries.http) file with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
which is VSCode extension.
If you choose the second option, then remember to double check your `PORT` value from `.env` configuration file with `@apiUrl` variable.

Swagger documentation is under `http://localhost:5000/swagger/`, but there is not much.
