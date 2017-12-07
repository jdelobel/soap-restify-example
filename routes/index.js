'use strict';

module.exports = (server, routes) => {
  routes.forEach(route => require(route)(server));
};
