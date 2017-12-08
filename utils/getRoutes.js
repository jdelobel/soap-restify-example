'use strict';

const fs = require('fs');

/**
 * Asynchronous function to get all handlers from routes directory
 *
 * @function util_get_routes
 *
 * @return {Promise<string>} that return list of routes if resolverd otherwise the error
 */
module.exports = () => {
  return new Promise((resolve, reject) => {
    return fs.readdir(__dirname + '/../routes', (err, items) => {
      if (err) {
        reject(err);
      }
      const routes = items.filter(item => item !== 'index.js' && /^[a-z0-9_.-]+\.js$/i.test(item)).map(route => './' + route.replace('.js', ''));
      resolve(routes);
    });
  });
};
