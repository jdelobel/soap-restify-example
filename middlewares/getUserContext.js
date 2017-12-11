'use strict';

/**
 * Simple middleware to get the current user context.
 */
module.exports = (redisClient) => {
  return async (req, res, next) => {
    try {
      // 1. TODO Get clientId from sas
      const clientId = 'x170759';
      // 2. TODO get User context from syca and put information in the current request
      // (store it in cache)
      if (redisClient.getRedis() !== undefined) {
        await redisClient.getRedis().setAsync('clientId', clientId);
      } else { // Id cache is unavailable make syca request
        req.log.info('TODO: Cache unvailable: need to call ws');
      }
    } catch (err) {
      req.log.error(err);
    }
    return next();
  };
};
