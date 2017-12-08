'use strict';

/**
 * Healthcheck routes (liveness and readyness)
 *
 * @param {Object} server the restify server
 *
 */
module.exports = (server) => {
  server.get('/liveness', (req, res, next) => {
    res.send(200);
    return next();
  });

  server.get('/readyness', (req, res, next) => {
    // TODO check WS availability to return 200 otherwise return 503
    res.send(200);
    return next();
  });
};

