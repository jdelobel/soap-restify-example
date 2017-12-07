# soap-restify-example
Simple REST services to demonstrate some use cases of SOAP service calls from restify

## Installation
```sh
npm i
```

## Start server
```sh
npm run start-dev
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

# To do

- [ ] SOAP Calls
    - [ ] with securtity (OAuth, custom, etc...)

- [ ] Config
  - List minimal configuration ?

- [ ] Logger
  - [x] Logger takes name, and log config
  - [x] Logger can log to syslog and to stdout.
  - [ ] Logger have to contains the client identifier

- [ ] Middlewares
  - [ ]  Middleware to intercept request and response (logging purpose)
  - [ ]  Middleware for requestId

- [ ] Healthcheck
  - [ ] Create liveness route
  - [ ] Create readyness route

- [ ] Metrics
  -  Which solutions ?

- [ ] Docker


