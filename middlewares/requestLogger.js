'use strict';

/**
 * Simple middleware for request log handling.
 */
module.exports = () => {
  return (req, res, next) => {
    const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
    const requestObject = {
      method: req.method,
      path: req.path(),
      query: req.query,
      body: req.body,
      reqId: req.reqId,
      statusCode: res.statusCode
    };
    if (hasValidStatusCode) {
      req.log.info('REQUEST', requestObject);
    } else {
      req.log.error('REQUEST', requestObject);
    }
    return next();
  };
};

