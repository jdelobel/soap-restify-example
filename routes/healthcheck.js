'use strict';

/**
 * Healthcheck routes (liveness and readyness)
 *
 * @param {Object} server the restify server
 *
 */
module.exports = (server, redisClient) => {
  server.get('/liveness', (req, res, next) => {
    res.send(200);
    return next();
  });

  server.get('/readyness', async (req, res, next) => {
    const response = Object.assign({}, { statusCode: 200, errors: [] });
    try {
      // TODO check Redis and WS availability to return 200 otherwise return 503
      if (redisClient.getRedis() !== undefined) {
        const pong = await redisClient.getRedis().pingAsync();
        if (pong !== 'PONG') {
          response.statusCode = 500;
          response.errors.push({ redis: { err: 'Cannot ping redis' } });
        }
      } else if (redisClient.getRedis() === undefined) {
        response.statusCode = 500;
        response.errors.push({ redis: { err: 'Cannot connect to redis' } });
      }
      res.send(response.statusCode, response.errors);
      return next();
    } catch (err) {
      req.log.error(err);
      res.send(500);
      return next();
    }
  });
};
