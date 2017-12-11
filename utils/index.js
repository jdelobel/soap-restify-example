'use strict';

const logger = require('./logger');
const getRoutes = require('./getRoutes');
const redisClient = require('./redisClient');
/**
 * Export all utils functions
 */
module.exports = {
  logger,
  getRoutes,
  redisClient
};
