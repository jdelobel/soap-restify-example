'use strict';

const Histogram = require('prom-client').Histogram;

const histo = new Histogram({
  name: 'http_request_cache_duration_seconds',
  help: 'duration histogram of cache responses labeled with status_code',
  buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10]
});

/**
 *  Set cache value
 * @param {*} redisClient - The redis client
 * @param {*} hash - The hash key
 * @param {*} field - The field associated to the key
 * @param {*} value - The value associated to the field
 * @param {number} ttl - Time to live in cache
 */
const setCache = async (redisClient, hash, field, value, ttl = -1) => {
  await redisClient.getRedis().hsetAsync(hash, field, value);
  const expiredAt = new Date(new Date().getTime() + (1000 * ttl));
  if (ttl !== -1) {
    await redisClient.getRedis().hsetAsync(`${hash}_expired_at`, field, expiredAt.toISOString());
  }
};

/**
 * Delete cache value
 * @param {*} redisClient - The redis client
 * @param {*} hash - The hash key
 * @param {*} path - The field associated to the key
 */
const deletCache = async (redisClient, hash, path) => {
  const expiredAt = await redisClient.getRedis().hgetAsync(`${hash}_expired_at`, path);
  const isExpired = new Date() > new Date(expiredAt) ? true : false;
  if (isExpired) {
    redisClient.getRedis().hdel(`${hash}_expired_at`, path);
    redisClient.getRedis().hdel(hash, path);
  }
};

/**
 * JSON Cache Manager.
 * TTL support
 * Prometheus monotoring support
 * @param {Object} redisClient  - The redis client instance
 * @param {number} ttl - The ttl
 * @param {boolean} instrument - true to instrument cache metric
 */
module.exports = (redisClient, ttl = -1, instrument = true) => {
  return async (req, res, next) => {
    try {
      histo.startTimer();
      const clientId = '550000006'; // TODO get from userContext
      if (redisClient.getRedis() !== undefined) {
        const endInstrumenting = histo.startTimer();
        res.on('finish', async () => {
          const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
          const hashExists = await redisClient.getRedis().hexistsAsync(clientId, req.path());
          // Setting hash if not already exists
          if (hasValidStatusCode && !hashExists) {
            await setCache(redisClient, clientId, req.path(), res._data, ttl);
          } else if (hashExists && ttl !== -1) { // Delete hash if ttl is present (Hash expiration)
            await deletCache(redisClient, clientId, req.path());
          }
        });
        const cachedData = await redisClient.getRedis().hgetAsync(clientId, req.path());
        if (cachedData) {
          if (instrument && endInstrumenting) {
            endInstrumenting();
          }
          const jsonCachedData = JSON.parse(cachedData);
          return res.send(jsonCachedData);
        }
      }
    } catch (err) {
      req.log.error(err);
      return next();
    }
    return next();
  };
};
