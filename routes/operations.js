'use strict';

/**
 * Operations routes
 *
 * @param {Object} server the restify server
 *
 */
module.exports = (server) => {
  // Get country name by country code
  server.get('/operations', async (req, res) => {
    // TODO call syca WS to list operations
    res.send(200);
  });
};
