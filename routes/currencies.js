'use strict';

/**
 * Module Dependencies
 */
const soap = require('soap');
const parseString = require('xml2js').parseString;
const errors = require('restify-errors');


module.exports = (server) => {
  const url = 'http://www.webservicex.net/country.asmx?WSDL';

  // Get country name by country code
  server.get('/countries/:countryCode', (req, res, next) => {
    req.log.debug('GET /countries/' + req.params.countryCode);
    return soap.createClientAsync(url).then((client) => {
      return client.GetCountryByCountryCodeAsync({ CountryCode: req.params.countryCode }).then((result) => { // eslint-disable-line new-cap
        parseString(result.GetCountryByCountryCodeResult, (err, jsonResult) => {
          if (err) {
            throw err;
          }
          res.send(jsonResult.NewDataSet.Table);
          return next();
        });
      });
    }).catch(err => {
      req.log.error(err);
      res.send(new errors.InternalServerError());
      return next();
    });
  });

  // Get country by currency code
  server.get('/countries/currencies/:currencyCode', (req, res, next) => {
    req.log.debug('GET /countries/currencies/' + req.params.currencyCode);
    return soap.createClientAsync(url).then((client) => {
      return client.GetCountryByCurrencyCodeAsync({ CurrencyCode: req.params.currencyCode }).then((result) => { // eslint-disable-line new-cap
        parseString(result.GetCountryByCurrencyCodeResult, (err, jsonResult) => {
          if (err) {
            throw err;
          }
          res.send(jsonResult.NewDataSet.Table);
          return next();
        });
      });
    }).catch(err => {
      req.log.error(err);
      res.send(new errors.InternalServerError());
      return next();
    });
  });

  // Get all currency,currency code for all countries
  server.get('currencies/countries', (req, res, next) => {
    req.log.debug('GET /currencies/countries');
    return soap.createClientAsync(url).then((client) => {
      return client.GetCurrenciesAsync().then((result) => { // eslint-disable-line new-cap
        parseString(result.GetCurrenciesResult, (err, jsonResult) => {
          if (err) {
            throw err;
          }
          res.send(jsonResult.NewDataSet.Table);
          return next();
        });
      });
    }).catch(err => {
      req.log.error(err);
      res.send(new errors.InternalServerError());
      return next();
    });
  });
};
