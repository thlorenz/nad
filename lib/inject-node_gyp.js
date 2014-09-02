'use strict';

/* Yeah this module uses some sync methods -- it's meant to be used as a CLI only */

var path = require('path')
  , fs = require('fs')
  , log = require('npmlog')
  , adaptNodeGyp = require('./adapt-node_gyp')
  , resolveGyps = require('./resolve-gyps')

var go = module.exports = 

/**
 * Injects necessary adjustments into `node.gyp` in order to include files of the addon found inside `binding.gyp`
 * in the node build.
 * 
 * @name nad::injectNodeGyp
 * @function
 * @param {string} projectDir full path to the directory of the addon project (where the `binding.gyp` file lives)
 * @param {string} nodeDir full path to the directory at which the node source code is located (alongside `node.gyp`)
 * @param {function} cb invoked when finished
 */
function injectNodeGyp(projectDir, nodeDir, cb) {
  var binding_gyp_file = path.join(projectDir, 'binding.gyp');
  var node_gyp_file = path.join(nodeDir, 'node.gyp');

  if (!fs.existsSync(binding_gyp_file)) return cb(new Error('No binding.gyp file found inside ' + projectDir));
  if (!fs.existsSync(node_gyp_file)) return cb(new Error('No node.gyp file found inside ' + nodeDir));

  resolveGyps(binding_gyp_file, node_gyp_file, function (err, res) {
    if (err) return cb(err);
    ongyps(res.binding_gyp, res.node_gyp);  
  })
  
  function ongyps(binding_gyp, node_gyp) {
    var res;
    try {
      res = adaptNodeGyp(projectDir, nodeDir, binding_gyp, node_gyp);
    } catch(err) {
      return cb(err);
    }

    var json = JSON.stringify(res.node_gyp, null, 2);
    log.info('nad', 'Writing adapted node.gyp');
    fs.writeFile(node_gyp_file, json, function (err) {
      if (err) return cb(err);
      cb(null, res)  
    })
  }
}
