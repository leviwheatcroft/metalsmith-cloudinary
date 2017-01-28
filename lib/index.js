import cloudinary from 'cloudinary'
import debug from 'debug'
import storage from 'node-persist'
const dbg = debug('metalsmith-cloudinary')

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
module.exports = function plugin (opts) {
  opts = opts || {};

  // Check for credentials
  if (!opts.cloud_name) throw new Error('cloud_name is required');
  if (!opts.api_key) throw new Error('api_key is required');
  if (!opts.api_secret) throw new Error('api_secret is required');

  // Set params
  const ttl = (opts.ttl !== undefined) ? opts.ttl : (60 * 60 * 1000) / 500
  const defaultParams = { 'max_results': 500 }
  const userParams = opts.params || {}
  const mergedParams = Object.assign({}, defaultParams, userParams)

  storage.initSync({ttl})
  if (ttl === false) storage.removeItemSync('resources')

  // Main plugin function
  return function(files, metalsmith, done) {
    const metadata = metalsmith.metadata()

    if (ttl) {
      const cache = storage.getItemSync('resources')
      if (cache) {
        dbg('got resources from cache')
        metadata.cloudinary = cache
        return done()
      }
    }

    function processResults(result) {
      dbg(`processing results`)
      var resources = result.resources;
      var remappedResources = {};

      // Remap array to object with public_id as keys
      for(var i = 0; i < resources.length; i++) {
        var public_id = resources[i].public_id;
        remappedResources[public_id] = resources[i];

        // Delete superfluous public_id property
        delete remappedResources[public_id].public_id;
      }
      if (ttl) storage.setItemSync('resources', remappedResources)
      // Assign remapped resources to metadata
      metadata.cloudinary = remappedResources;
      done();
    }

    // Get resources and process
    dbg('authenticating');
    cloudinary.config({
      cloud_name: opts.cloud_name,
      api_key: opts.api_key,
      api_secret: opts.api_secret
    })
    dbg('fetching resources');
    cloudinary.api.resources(processResults, mergedParams);
  };
}
