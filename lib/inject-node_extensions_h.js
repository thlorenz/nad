'use strict';

var fs                  = require('fs')
  , adaptNodeExtensions = require('./adapt-node_extensions_h')
  , log                 = require('npmlog')

var go = module.exports = 
  
/**
 * Injects source into `node_extensions.h` file to include `NODE_EXT_LIST_ITEM` macro calls for all valid targets of the addon.
 *
 * #### Example
 *
 * For targets `[ 'node_foo', 'node_bar' ]` it injects following code:
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
 * @name nad::injectNodeExtensions
 * @function
 * @param {string} node_extensions_h_file full path to `node_extensions.h`
 * @param {Array.<string>} extensions the  extensions to insert
 * @param {function} cb called back when injection is completed
 */
function injectNodeExtensions(node_extensions_h_file, extensions, cb) {
  fs.readFile(node_extensions_h_file, 'utf8', function (err, src) {
    if (err) return cb(err);
    try {
      log.info('nad', 'Injecting code into `node_extensions.h` in order to initialize the following addon modules', extensions);
      var new_src = adaptNodeExtensions(src, extensions);
      fs.writeFile(node_extensions_h_file, new_src, 'utf8', cb);
    } catch(e) {
      cb(e);
    }
  })
}
