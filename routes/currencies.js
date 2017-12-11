'use strict';

/**
 * Module Dependencies
 */
const soap = require('soap');
const parseString = require('xml2js').parseString;
const errors = require('restify-errors');
const config = require('config');


/**
 * Currencies routes
 *
 * @param {Object} server the restify server
 *
 */
module.exports = (server, redisClient) => {
  const wsdlLocation = __dirname + '/' + config.wsdl.country.location;
  const timeout = config.wsdl.country.timeout || 30000;

  // Get country name by country code
  server.get('/countries/:countryCode', (req, res, next) => {
    // TODO Factorize it!
    redisClient.get('clientId', (err, clientId) => {
      if (err) {
        throw err;
      }
      req.log.info(clientId);
    });
    return soap.createClientAsync(wsdlLocation, { endpoint: config.wsdl.country.endpoint }).then((client) => {
      return client.GetCountryByCountryCodeAsync({ CountryCode: req.params.countryCode }, { timeout }).then((result) => { // eslint-disable-line new-cap
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
    req.log.info(__dirname);
    return soap.createClientAsync(wsdlLocation).then((client) => {
      return client.GetCountryByCurrencyCodeAsync({ CurrencyCode: req.params.currencyCode }, { timeout }).then((result) => { // eslint-disable-line new-cap
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
    return soap.createClientAsync(wsdlLocation).then((client) => {
      return client.GetCurrenciesAsync({ timeout }).then((result) => { // eslint-disable-line new-cap
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
