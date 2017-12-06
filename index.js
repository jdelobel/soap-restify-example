
// Free  Currencies WS : http://www.webservicex.net/WS/WSDetails.aspx?WSID=17&CATID=7

const restify = require('restify');
const fs = require('fs');

const server = restify.createServer({
  name: 'soap-restify-example',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.listen(8080, async () => {
  try {
    const routes = await getRoutes();
    require('./routes')(server, routes);
    console.log('%s listening at %s', server.name, server.url);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});

function getRoutes() {
  return new Promise((resolve, reject) => {
    return fs.readdir(__dirname + '/routes', (err, items) => {
      if (err) {
        reject(err);
      }
      const routes = items.filter(item => item !== 'index.js' && /^[a-z0-9_.-]+\.js$/i.test(item)).map(route => './'+ route.replace('.js', ''));
      resolve(routes);
    });
  });
}
