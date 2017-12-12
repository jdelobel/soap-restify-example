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
  server.get('/countries/:countryCode', async (req, res) => {
    try {
      // TODO Which key to use to store and retrieve current user?
      const clientId = await redisClient.getRedis().getAsync('TODO Which key to use to store and retrieve current user?');
      req.log.info(clientId);
      const client = await soap.createClientAsync(wsdlLocation, { endpoint: config.wsdl.country.endpoint });
      const result = await client.GetCountryByCountryCodeAsync({ CountryCode: req.params.countryCode }, { timeout }); // eslint-disable-line new-cap
      parseString(result.GetCountryByCountryCodeResult, (err, jsonResult) => {
        if (err) {
          throw err;
        }
        res.send(jsonResult.NewDataSet.Table);
      });
    } catch (err) {
      req.log.error(err);
      res.send(new errors.InternalServerError());
    }
  });

  // Get country by currency code
  server.get('/countries/currencies/:currencyCode', async (req, res) => {
    try {
      const client = await soap.createClientAsync(wsdlLocation);
      const result = await client.GetCountryByCurrencyCodeAsync({ CurrencyCode: req.params.currencyCode }, { timeout }); // eslint-disable-line new-cap
      parseString(result.GetCountryByCurrencyCodeResult, (err, jsonResult) => {
        if (err) {
          throw err;
        }
        res.send(jsonResult.NewDataSet.Table);
      });
    } catch (err) {
      req.log.error(err);
      res.send(new errors.InternalServerError());
    }
  });

  // Get all currency,currency code for all countries
  server.get('/currencies/countries', async (req, res) => {
    try {
      const client = await soap.createClientAsync(wsdlLocation);
      const result = await client.GetCurrenciesAsync({ timeout }); // eslint-disable-line new-cap
      parseString(result.GetCurrenciesResult, (err, jsonResult) => {
        if (err) {
          throw err;
        }
        res.send(jsonResult.NewDataSet.Table);
      });
    } catch (err) {
      req.log.error(err);
      res.send(new errors.InternalServerError());
    }
  });
};
