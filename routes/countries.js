'use strict';

/**
 * Module Dependencies
 */
const soap = require('soap');
const parseString = require('xml2js').parseString;
const errors = require('restify-errors');
const config = require('config');
const Histogram = require('prom-client').Histogram;


const histo = new Histogram({
  name: 'syca_request_duration_seconds',
  help: 'Syca request durations',
  labelNames: ['method']
});

const cache = require('../utils/cache');

/**
   * @swagger
   * definitions:
   *   Country:
   *     type: object
   *     properties:
   *       countrycode:
   *         description: the country code
   *         type: string
   *       zipCode:
   *         description: the country name
   *         type: number
   */


/**
 * Countries routes
 *
 * @param {Object} server the restify server
 *
 */
module.exports = (server, redisClient) => {
  const wsdlLocation = __dirname + '/' + config.wsdl.country.location;
  const timeout = config.wsdl.country.timeout || 30000;


  /**
   *  @swagger
   *  countries/currencies:
   *   get:
   *     tags: [countries]
   *     summary: Get all countries with its currencies or a country by currency code
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Get all countries with its currencies or a country by currency code
   *       schema:
   *          $ref: '#/definitions/Country'
   *   parameters:
   *     - name: currencyCode
   *       description: the currency code
   *       in: query
   *       required: false
   *       type: string
   */
  server.get('/countries/currencies', cache(redisClient, 10), async (req, res) => {
    try {
      const client = await soap.createClientAsync(wsdlLocation);
      const endInstrumenting = histo.startTimer({method: 'GetCountryByCurrencyCode'});
      const result = req.query.currencyCode
        ? await client.GetCountryByCurrencyCodeAsync({ CurrencyCode: req.query.currencyCode }, { timeout }) // eslint-disable-line new-cap
        : await client.GetCurrenciesAsync({ timeout }); // eslint-disable-line new-cap
      parseString(result.GetCountryByCurrencyCodeResult || result.GetCurrenciesResult, (err, jsonResult) => {
        if (err) {
          throw err;
        }
        endInstrumenting();
        res.send(jsonResult.NewDataSet.Table);
      });
    } catch (err) {
      req.log.error(err);
      res.send(new errors.InternalServerError(err.message));
    }
  });

  /**
   *  @swagger
   *  countries/{countryCode}:
   *   get:
   *     tags: [countries]
   *     summary: Get country name by country code
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Get country name by country code
   *       schema:
   *          $ref: '#/definitions/Country'
   *   parameters:
   *     - name: countryCode
   *       description: the country code
   *       in: path
   *       required: true
   *       type: string
   */
  server.get('/countries/:countryCode', cache(redisClient, 10), async (req, res) => {
    try {
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
      res.send(new errors.InternalServerError(err.message));
    }
  });
};
