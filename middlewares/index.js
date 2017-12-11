'use strict';

const requestLogger = require('./requestLogger');
const responseLogger = require('./responseLogger');
const requestId = require('./requestId');
const getUserContext = require('./getUserContext');

/**
 * Export all middlewares
 */
module.exports = {
  requestLogger,
  responseLogger,
  requestId,
  getUserContext
};
