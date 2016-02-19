var cloudinary = require('cloudinary');
var merge = require('lodash.merge');

/**
 * Metalsmith plugin to retrieve data from the cloudinary api.
 *
 * @param {Object} options
 *   @property {String} cloud_name
 *   @property {String} api_key
 *   @property {String} api_secret
 *   @property {Object} params (optional)
 * @return {Function}
 */
module.exports = function plugin (opts) {
  opts = opts || {};

  // Check for credentials
  if (!opts.cloud_name) throw new Error('cloud_name is required');
  if (!opts.api_key) throw new Error('api_key is required');
  if (!opts.api_secret) throw new Error('api_secret is required');

  // Map credentials to authentication object
  var authentication = {
    cloud_name: opts.cloud_name,
    api_key: opts.api_key,
    api_secret: opts.api_secret
  };

  // Set params
  var defaultParams = { 'max_results': 500 };
  var userParams = opts.params || {};
  var mergedParams = merge({}, defaultParams, userParams);

  // Main plugin function
  return function(files, metalsmith, done) {
    var metadata = metalsmith.metadata();

    function processResults(result) {
      var resources = result.resources;
      var remappedResources = {};

      // Remap array to object with public_id as keys
      for(var i = 0; i < resources.length; i++) {
        var public_id = resources[i].public_id;
        remappedResources[public_id] = resources[i];

        // Delete superfluous public_id property
        delete remappedResources[public_id].public_id;
      }

      // Assign remapped resources to metadata
      metadata.cloudinary = remappedResources;
      done();
    }

    // Get resources and process
    cloudinary.config(authentication);
    cloudinary.api.resources(processResults, mergedParams);
  };
}
