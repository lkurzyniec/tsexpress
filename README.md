# tsexpress-tutorial

Source code based on [TypeScript Express tutorial](https://wanago.io/courses/typescript-express-tutorial/).

## Repo (should) contains

* NodeJS
* Express
* TypeScript
* ts-node-dev
* InversifyJS as a DI container
* MongoDB
* dotenv and envalid

## Start

### Start MongoDB in Docker

```docker
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

### Configuration

Create `.env` file in the root directory as follows:

```ini
MONGO_USER=lkurzyniec
MONGO_PASSWORD=samplePWD
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=books
PORT=5000
```

### Start the application

Type `npm run dev` in terminal, by default the application is available under `http://localhost:5000/`.

To interact with API you can either send requests with [Postman](https://www.getpostman.com/) or send exemplary
request from [http queries](server-queries.http) file with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
which is VSCode extension.
If you choose the second option, then remember to double check your `PORT` value from `.env` configuration file with `@apiUrl` variable.
