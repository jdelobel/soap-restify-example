'use strict';

const bunyan = require('bunyan');
const gelfStream = require('gelf-stream');
const config = require('config');

/**
 * Logger object to init logger to log to stdout and to Gelfstream (syslog).
 *
 *
 * @param {string} name   logger name
 * @param {Object} logConfig Config object.
 *
 */
module.exports = {
  init: (name, logConfig) => {
    const stream = gelfStream.forBunyan(logConfig.graylog_addr.split(':')[0], logConfig.graylog_addr.split(':')[1]);
    return bunyan.createLogger({
      name,
      streams: [
        { type: 'raw', stream: stream },
        {
          stream: process.stdout,
          level: config.level
        }]
    });
  }
};
