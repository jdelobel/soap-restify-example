'use strict';

const requestLogger = require('./requestLogger');
const requestId = require('./requestId');
const getUserContext = require('./getUserContext');
const metrics = require('./metrics');

/**
 * Export all middlewares
 */
module.exports = {
  requestLogger,
  requestId,
  getUserContext,
  metrics: metrics
};
