'use strict';

const requestLogger = require('./requestLogger');
const responseLogger = require('./responseLogger');
const requestId = require('./requestId');

/**
 * Export all middlewares
 */
module.exports = {
  requestLogger,
  responseLogger,
  requestId
};
