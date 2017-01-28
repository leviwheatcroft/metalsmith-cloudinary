'use strict';

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _nodePersist = require('node-persist');

var _nodePersist2 = _interopRequireDefault(_nodePersist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dbg = (0, _debug2.default)('metalsmith-cloudinary');

/**
 * Metalsmith plugin to retrieve data from the cloudinary api.
 *
 * @param {Object} options
 *   @property {String} cloud_name
 *   @property {String} api_key
 *   @property {String} api_secret
 *   @property {Object} params (optional)
 *   @property {Integer|Boolean} cache expiry (ms), false for no cache
 * @return {Function}
 */
module.exports = function plugin(opts) {
  opts = opts || {};

  // Check for credentials
  if (!opts.cloud_name) throw new Error('cloud_name is required');
  if (!opts.api_key) throw new Error('api_key is required');
  if (!opts.api_secret) throw new Error('api_secret is required');

  // Set params
  const ttl = opts.ttl !== undefined ? opts.ttl : 60 * 60 * 1000 / 500;
  const defaultParams = { 'max_results': 500 };
  const userParams = opts.params || {};
  const mergedParams = (0, _lodash.merge)({}, defaultParams, userParams);

  _nodePersist2.default.initSync({ ttl });
  if (ttl === false) _nodePersist2.default.removeItemSync('resources');

  // Main plugin function
  return function (files, metalsmith, done) {
    const metadata = metalsmith.metadata();

    if (ttl) {
      const cache = _nodePersist2.default.getItemSync('resources');
      if (cache) {
        dbg('got resources from cache');
        metadata.cloudinary = cache;
        return done();
      }
    }

    function processResults(result) {
      dbg(`processing results`);
      var resources = result.resources;
      var remappedResources = {};

      // Remap array to object with public_id as keys
      for (var i = 0; i < resources.length; i++) {
        var public_id = resources[i].public_id;
        remappedResources[public_id] = resources[i];

        // Delete superfluous public_id property
        delete remappedResources[public_id].public_id;
      }
      if (ttl) _nodePersist2.default.setItemSync('resources', remappedResources);
      // Assign remapped resources to metadata
      metadata.cloudinary = remappedResources;
      done();
    }

    // Get resources and process
    dbg('authenticating');
    _cloudinary2.default.config({
      cloud_name: opts.cloud_name,
      api_key: opts.api_key,
      api_secret: opts.api_secret
    });
    dbg('fetching resources');
    _cloudinary2.default.api.resources(processResults, mergedParams);
  };
};