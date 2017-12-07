'use strict';

/**
 * Simple middleware for Request/Response Log handling.
 */
module.exports = () => {
  return (req, res, next) => {
    res.on('finish', () => {
      const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
      const requestObject = {
        method: req.method,
        path: req.path(),
        query: req.query,
        body: req.body,
        statusCode: res.statusCode,
        message: res.statusMessage
      };
      const responseObject = { statusCode: res.statusCode, message: res.statusMessage };
      if (hasValidStatusCode) {
        req.log.info('REQUEST', requestObject);
        req.log.info('RESPONSE', responseObject);
      } else {
        req.log.error('REQUEST', requestObject);
        req.log.error('RESPONSE', responseObject);
      }
    });
    return next();
  };
};

