# soap-restify-example
Simple REST services to demonstrate some use cases of SOAP service calls from restify

## Installation
```sh
$ npm i
```

## Start server
```sh
$ npm run start-dev
```

## Api

GET:

Get country name by country code:

```
eg. http:localhost:8080/countries/fr
```

Get country by currency code

```
eg. http:localhost:8080/countries/currencies/FRF
```

Get all currency,currency code for all countries

```
eg. http:localhost:8080/currencies/countries
```

# Docker

## Build image:
```sh
$ docker build -t soap-restify-example  .
```
## Run container
```sh
$ docker run --rm -d -e LISTEN_ADDR=0.0.0.0:8080 -p 8080:8080 soap-restify-example:latest
```

# To do

- [ ] SOAP Calls
    - [ ] with securtity (OAuth, custom, etc...)

- [ ] Config
  - List minimal configuration ?

- [ ] Logger
  - [x] Logger takes name, and log config
  - [x] Logger can log to syslog and to stdout.
  - [ ] Logger have to contains the client identifier

- [x] Cache (Redis instance with reconnection management)

- [ ] Middlewares
  - [x]  Middleware to intercept request and response (logging purpose)
  - [x]  Middleware for requestId
  - [ ]  Middleware to store user context into  Redis cache

- [ ] Healthcheck
  - [x] Create liveness route
  - [ ] Create readyness route
    - [x] Check Redis instance availability
    - [ ] Check WS (syca) availability

- [ ] Unit/integration tests

- [ ] Metrics
  -  Which solutions ?

- [x] Docker

- [ ] Continious integration
  - Drone or Jenkins :)
