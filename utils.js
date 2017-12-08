'use strict';

const fs = require('fs');

module.exports = {

  // Util asynchronous function to get all handlers from routes directory
  getRoutes: () => {
    return new Promise((resolve, reject) => {
      return fs.readdir(__dirname + '/routes', (err, items) => {
        if (err) {
          reject(err);
        }
        const routes = items.filter(item => item !== 'index.js' && /^[a-z0-9_.-]+\.js$/i.test(item)).map(route => './' + route.replace('.js', ''));
        resolve(routes);
      });
    });
  }
};
