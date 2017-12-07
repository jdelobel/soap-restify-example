'use strict';

// Free  Currencies WS : http://www.webservicex.net/WS/WSDetails.aspx?WSID=17&CATID=7

const restify = require('restify');
const fs = require('fs');
const config = require('config');

const logger = require('./logger');
const middlewareRequestLogger = require('./middlewares/requestLogger');
const middlewaResponseLogger = require('./middlewares/responseLogger');


const appName = 'soap-restify-example';
const log = logger.init(appName, config.log);

const server = restify.createServer({
  name: appName,
  version: '1.0.0',
  log
});
server.pre(middlewareRequestLogger());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(middlewaResponseLogger());

// Util asynchronous function to get all handlers from routes directory
function getRoutes() {
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

// Start server and init routes
server.listen(config.listen_addr.split(':')[1], config.listen_addr.split(':')[0], async () => {
  try {
    const routes = await getRoutes();
    require('./routes')(server, routes);
    log.info('%s listening at %s', server.name, server.url);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
});


