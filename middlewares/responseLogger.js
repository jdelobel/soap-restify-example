'use strict';

/**
 * Simple middleware for response log handling.
 */
module.exports = () => {
  return (req, res, next) => {
    res.on('finish', () => {
      const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
      const responseObject = { statusCode: res.statusCode, message: res.statusMessage };
      if (hasValidStatusCode) {
        req.log.info('RESPONSE', responseObject);
      } else {
        req.log.error('RESPONSE', responseObject);
      }
    });
    return next();
  };
};

