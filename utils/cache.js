'use strict';

/**
 *  Cache manager to get or set the JSON response with ttl support.
 * @param {Object} redisClient  - The redis client instance
 * @param {number} ttl - The ttl
 */
module.exports = (redisClient, ttl = -1) => {
  return async (req, res, next) => {
    try {
      const clientId = '550000006'; // TODO get from userContext
      if (redisClient.getRedis() !== undefined) {
        res.on('finish', async () => {
          const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
          const hashExists = await redisClient.getRedis().hexistsAsync(clientId, req.path());
          // Setting hash if not already exists
          if (hasValidStatusCode && !hashExists) {
            await redisClient.getRedis().hsetAsync(clientId, req.path(), res._data);
            const expiredAt = new Date(new Date().getTime() + (1000 * ttl));
            req.log.info(expiredAt.toISOString());
            if (ttl !== -1) {
              await redisClient.getRedis().hsetAsync(`${clientId}_expired_at`, req.path(), expiredAt.toISOString());
            }
          } else if (hashExists && ttl !== -1) { // Delete hash if ttl is present (Hash expiration)
            const expiredAt = await redisClient.getRedis().hgetAsync(`${clientId}_expired_at`, req.path());
            const isExpired = new Date() > new Date(expiredAt) ? true : false;
            if (isExpired) {
              redisClient.getRedis().hdel(`${clientId}_expired_at`, req.path());
              redisClient.getRedis().hdel(clientId, req.path());
            }
          }
        });
        const cachedData = await redisClient.getRedis().hgetAsync(clientId, req.path());
        if (cachedData) {
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
