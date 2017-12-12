'use strict';

/**
 * Simple middleware for response log handling.
 */
module.exports = () => {
  return (req, res, next) => {
    res.on('finish', () => {
      const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
      const responseObject = { statusCode: res.statusCode, message: res.statusMessage, reqId: res.header('X-Request-Id') };
      const response = { response: responseObject };
      if (hasValidStatusCode) {
        req.log.info(response);
      } else {
        req.log.error(response);
      }
    });
    return next();
  };
};

