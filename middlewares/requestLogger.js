'use strict';

/**
 * Simple middleware for request log handling.
 */
module.exports = () => {
  return (req, res, next) => {
    const requestObject = {
      method: req.method,
      path: req.path(),
      query: req.query,
      body: req.body,
      reqId: req.reqId
    };
    req.log.info('REQUEST', requestObject);
    return next();
  };
};
