var Client = require('./client');

/**
 * Creates an GbxRemote client.
 *
 * @param {Number} port
 * @param {String} host
 * @param {Function} callback
 * @return {Client}
 * @see Client
 */
exports.createClient = function(port, host, callback) {
  return new Client(port, host, callback);
}