/**
 * Module Dependencies
 */
const soap = require('soap');
const parseString = require('xml2js').parseString;
const errors = require('restify-errors');


module.exports = function (server) {

  const url = 'http://www.webservicex.net/country.asmx?WSDL';
  
  // Get country name by country code
  server.get('/countries/:countryCode', (req, res, next) => {
    return soap.createClientAsync(url).then((client) => {
      return client.GetCountryByCountryCodeAsync({ CountryCode: req.params.countryCode }).then((result) => {
        parseString(result.GetCountryByCountryCodeResult, (err, result) => {
          if (err) {
            throw err;
          }
          res.send(result.NewDataSet.Table);
          return next();
        })
      });
    }).catch(err => {
      console.error(err);
      res.send(500, { message: 'Internal server Error' });
      return next();
    });
  });

  // Get country by currency code
  server.get('/countries/currencies/:currencyCode', (req, res, next) => {
    return soap.createClientAsync(url).then((client) => {
      return client.GetCountryByCurrencyCodeAsync({ CurrencyCode: req.params.currencyCode }).then((result) => {
        parseString(result.GetCountryByCurrencyCodeResult, (err, result) => {
          if (err) {
            throw err;
          }
          res.send(result.NewDataSet.Table);
          return next();
        })
      });
    }).catch(err => {
      console.error(err);
      res.send(500, { message: 'Internal server Error' });
      return next();
    });
  });

  // Get all currency,currency code for all countries
  server.get('currencies/countries', (req, res, next) => {
    return soap.createClientAsync(url).then((client) => {
      return client.GetCurrenciesAsync().then((result) => {
        parseString(result.GetCurrenciesResult, (err, result) => {
          if (err) {
            throw err;
          }
          res.send(result.NewDataSet.Table);
          return next();
        })
      });
    }).catch(err => {
      console.error(err);
      res.send(500, { message: 'Internal server Error' });
      return next();
    });
  });
}