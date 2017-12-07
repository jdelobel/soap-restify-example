'use strict';

const uuidV4 = require('uuid').v4;

/**
 * Simple middleware to manage X-request-Id in HTTP header.
 */
module.exports = () => {
  return (req, res, next) => {
    // Request
    req.reqId = req.reqId || uuidV4();
    // Response
    res.header('X-Request-Id', req.reqId);
    return next();
  };
};
