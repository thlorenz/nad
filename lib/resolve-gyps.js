'use strict';

var gr = require('gyp-reader')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

module.exports = 

/**
 * Resolves and parses content of the given `binding.gyp` and `node.gyp`.
 * 
 * @name resolveGyps
 * @function
 * @private
 * @param {sting} binding_gyp_file full path to `binding.gyp`
 * @param {sting} node_gyp_file full path to `node.gyp`
 * @param {function} cb called back with `{ binding_gyp: .., node_gyp: .. }`, the parsed content of both gyp files
 */
function resolveGyps(binding_gyp_file, node_gyp_file, cb) {
  var binding_gyp, done;

  gr(binding_gyp_file, onbinding_gyp);

  function onbinding_gyp(err, gyp) {
    if (err) return cb(new Error('An error occurred when trying to read binding.gyp: [ Message: ' + err.message + ', Code: ' + err.code + ']'));
    binding_gyp = gyp;
    gr(node_gyp_file, onnode_gyp);
  }

  function onnode_gyp(err, gyp) {
    // gyp-reader sometimes calls back with an error after it already called with a valid result
    if (done) return; 
    done = true;
    if (err) return cb(new Error('An error occurred when trying to read node.gyp: [ Message: ' + err.message + ', Code: ' + err.code + ']'));
    cb(null, { binding_gyp: binding_gyp, node_gyp: gyp });
  }
}
