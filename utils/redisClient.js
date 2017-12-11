'use strict';

const config = require('config');
const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
/**
 * Bootstrap redis.
 *
 *
 * @param {string} name   logger name
 * @param {Object} logConfig Config object.
 *
 */


function RedisClient(logger, redisConfig) {
  this.logger = logger;
  this.redisConfig = redisConfig;
  this.redisAvailable = false;
}


Object.assign(RedisClient.prototype, {

  bootstrap() {
    if (!config) {
      return;
    }
    this.redisConfig = Object.assign(this.redisConfig, {
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          this.logger.info(`Trying to reconnect to redis ${options.attempt}/1000`);
          this.redisAvailable = false;
          // return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          this.redisAvailable = false;
          return new Error('Retry time exhausted');
        }
        // Stop reconnecting after 1000
        if (options.attempt > 1000) {
          // End reconnecting with built in error
          return undefined;
        }
        this.logger.info(`Redis client was reconnected ${options.times_connected}/1000`);
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    });
    this.redis = redis.createClient(this.redisConfig);
    this.redis.on('ready', () => {
      this.redisAvailable = true;
    });
  },
  getRedis() {
    return this.redisAvailable ? this.redis : undefined;
  }
});

module.exports = RedisClient;

