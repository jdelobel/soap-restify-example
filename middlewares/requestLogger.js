'use strict';

const Histogram = require('prom-client').Histogram;

const histo = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'duration histogram of http responses labeled with status_code',
  labelNames: ['status_code', 'method', 'url_path'],
  buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10]
});

const requestLogger = (req) => {
  const requestObject = {
    method: req.method,
    path: req.path(),
    query: req.query,
    body: req.body,
    reqId: req.reqId
  };
  const request = { request: requestObject };
  req.log.info(request);
};

const responseLogger = (req, res) => {
  const hasValidStatusCode = res.statusCode >= 200 && res.statusCode <= 299;
  const responseObject = { statusCode: res.statusCode, message: res.statusMessage, reqId: res.header('X-Request-Id') };
  const response = { response: responseObject };
  if (hasValidStatusCode) {
    req.log.info(response);
  }
  else {
    req.log.error(response);
  }
};

/**
 * Simple middleware for request log handling with instrumenting support.
 */
module.exports = (instrument = true, ignoreRoutes = ['/liveness', '/readyness', '/metrics']) => {
  return (req, res, next) => {
    let endInstrumenting;
    if (instrument && !ignoreRoutes.includes(req.path())) {
      endInstrumenting = histo.startTimer({ method: req.method, url_path: req.path() });
    }
    requestLogger(req);
    res.on('finish', () => {
      responseLogger(req, res);
      if (instrument && endInstrumenting) {
        endInstrumenting({ status_code: res.statusCode });
      }
    });
    return next();
  };
};


