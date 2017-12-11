'use strict';

/**
 * Bootstrap all routes
 *
 * @param {Object} server the restify server
 *  @param {Array<string>} routes the routes to bootstrap
 */
module.exports = (server, routes, redisClient) => {
  routes.forEach(route => require(route)(server, redisClient));
};
