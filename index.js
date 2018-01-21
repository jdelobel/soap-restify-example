'use strict';

// Free  Currencies WS : http://www.webservicex.net/WS/WSDetails.aspx?WSID=17&CATID=7

const restify = require('restify');
const config = require('config');


const getRoutes = require('./utils').getRoutes;
const logger = require('./utils').logger;
const RedisClient = require('./utils/redisClient');
const middlewares = require('./middlewares');

const appName = 'soap-restify-example';
const log = logger.init(appName, config.log);

// Server creation
const server = restify.createServer({
  name: appName,
  version: '1.0.0',
  log
});

const redisClient = new RedisClient(log, config.get('redis_addr', false));
redisClient.bootstrap();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(middlewares.metrics());
server.use(middlewares.requestId());
server.use(middlewares.getUserContext(redisClient));
server.use(middlewares.requestLogger());

// Start server and init routes
server.listen(config.listen_addr.split(':')[1], config.listen_addr.split(':')[0], async () => {
  try {
    const routes = await getRoutes();
    require('./routes')(server, routes, redisClient);
    log.info('%s listening at %s', server.name, server.url);
  } catch (err) {
    log.error(err);
    process.exit(0);
  }
});

module.exports = server;
