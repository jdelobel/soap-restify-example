'use strict';

/**
 * Simple middleware to get the current user context.
 */
module.exports = (redisClient) => {
  return async (req, res, next) => {
    try {
      // 1. TODO Get sessionId from SAS
      req.log.info('TODO Get sessionId from SAS');
      if (redisClient.getRedis() !== undefined) {
        // 2.a TODO Get UserContext from syca and store it in Redis
        // 2.b TODO Which key to use to store and retrieve current user?
        await redisClient.getRedis().setAsync('TODO Which key to use to store and retrieve current user?', 'TODO Replace with sessionId from SAS');
      } else { // Id cache is unavailable make syca request
        req.log.info('TODO Cache unvailable: need to call ws');
      }
    } catch (err) {
      req.log.error(err);
    }
    return next();
  };
};
