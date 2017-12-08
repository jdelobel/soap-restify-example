'use strict';

// Bootstrap all routes
module.exports = (server, routes) => {
  routes.forEach(route => require(route)(server));
};
