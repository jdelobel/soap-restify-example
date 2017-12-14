'use strict';
const config = require('config');
const restifyServeStatic = require('restify').plugins.serveStatic;
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const packageInfos = require('../package.json');

/**
 * Operations routes
 *
 * @param {Object} server the restify server
 *
 */
module.exports = (server) => {
  // Init static
  server.get(/\/api-docs\/?.*/, restifyServeStatic({
    directory: path.join(__dirname, '..', 'public'),
    default: 'index.html'
  }));

  // Get swagger api-docs
  server.get('/swagger.json', (req, res) => {
    const swaggerDefinition = {
      info: {
        title: packageInfos.name,
        version: packageInfos.version,
        description: packageInfos.description || ''
      },
      host: config.get('public_addr'),
      basePath: '/'
    };

    // options for the swagger docs
    const options = {
      // import swaggerDefinitions
      swaggerDefinition,
      // path to the API docs
      apis: [path.join(__dirname, '*.js')]
    };
    const swaggerSpec = swaggerJSDoc(options);
    req.log.info(swaggerSpec);
    res.send(swaggerSpec);
  });
};

