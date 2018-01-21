'use strict';

const client = require('prom-client');
/**
 * Pre routes
 *
 * @param {Object} server the restify server
 *
 */
module.exports = () => {
  client.collectDefaultMetrics();
  return (req, res, next) => {
    if (req.path() === '/metrics') {
      res.header('Content-Type', 'text/plain');
      res.end(client.register.metrics());
      return;
    }
    next();
  };
};
