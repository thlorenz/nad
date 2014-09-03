'use strict';

var fs                     = require('fs')
  , adaptNodeExtensions_h  = require('./adapt-node_extensions_h')
  , adaptNodeExtensions_cc = require('./adapt-node_extensions_cc')
  , log                    = require('npmlog')

var go = module.exports = 
  
/**
 * Injects source into `node_extensions.h` file to include `NODE_EXT_LIST_ITEM` macro calls for all valid targets of the addon.
 *
 * This only works for Node.js `< v0.11` since `node_extensions.h` and `node_extensions.cc` 
 * drastically changed during `0.11` development until they completely disappeared around `v0.11.12`.
 *
 * #### Example
 *
 * For targets `[ 'node_foo', 'node_bar' ]` it injects following code into `node_extensions.h`
 *
 * ```
 * /* START nad INJECTION, PLEASE DO NOT REMOVE /
 * #ifdef NODE_FOO_ADDON
 * NODE_EXT_LIST_ITEM(node_bar)
 * #endif
 * #ifdef NODE_BAR_ADDON
 * NODE_EXT_LIST_ITEM(node_bar)
 * #endif
 * /* END nad INJECTION, PLEASE DO NOT REMOVE /
 * ```
 *
 * Then it modifies `node_extensions.cc` in order to find our addons even if they don't start with `node_`.
 * 
 * @name nad::injectNodeExtensions
 * @function
 * @param {string} node_extensions_h_file full path to `node_extensions.h`
 * @param {string} node_extensions_cc_file full path to `node_extensions.cc`
 * @param {Array.<string>} extensions the  extensions to insert
 * @param {function} cb called back when injection is completed
 */
function injectNodeExtensions(node_extensions_h_file, node_extensions_cc_file, extensions, cb) {
  fs.readFile(node_extensions_h_file, 'utf8', function (err, src) {
    if (err) return cb(err);
    try {
      log.info('nad', 'Injecting code into `node_extensions.h` in order to initialize the following addon modules', extensions);
      var new_src = adaptNodeExtensions_h(src, extensions);
      fs.writeFile(node_extensions_h_file, new_src, 'utf8', oninjectedH);
    } catch(e) {
      cb(e);
    }
  })

  function oninjectedH(err) {
    if (err) return cb(err);
    
    fs.readFile(node_extensions_h_file, 'utf8', function (err, src) {
      if (err) return cb(err);
      log.info('nad', 'Injecting code into `node_extensions.cc` in order to be able to resolve the addon modules');
      var new_src = adaptNodeExtensions_cc(src);
      fs.writeFile(node_extensions_cc_file, new_src, 'utf8', cb);
    })
  }
}
