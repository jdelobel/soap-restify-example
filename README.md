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
