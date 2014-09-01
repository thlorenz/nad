'use strict';

var fs                  = require('fs')
  , adaptNodeExtensions = require('./adapt-node_extensions_h')
  , log                 = require('log')

var go = module.exports = 
  
/**
 * Injects source into `node_extensions.h` file to include `NODE_EXT_LIST_ITEM` macro calls for all modules of the addon.
 *
 * #### Example
 *
 * For defines `[ 'node_foo_addon', 'node_bar_addon' ]` it injects following code:
 *
 * ```
 * /* START nad INJECTION, PLEASE DO NOT REMOVE /
 * #ifdef NODE_FOO_ADDON
 * NODE_EXT_LIST_ITEM(node_bar_addon)
 * #endif
 * #ifdef NODE_BAR_ADDON
 * NODE_EXT_LIST_ITEM(node_bar_addon)
 * #endif
 * /* END nad INJECTION, PLEASE DO NOT REMOVE /
 * ```
 * 
 * @name nad::injectNodeExtensions
 * @function
 * @param {string} node_extensions_h_file full path to `node_extensions.h`
 * @param {Array.<string>} defines the (uppercased defines) to insert
 * @param {function} cb called back when injection is completed
 */
function injectNodeExtensions(node_extensions_h_file, defines, cb) {
  fs.readFile(node_extensions_h_file, 'utf8', function (err, src) {
    if (err) return cb(err);
    try {
      log.info('nad', 'Injecting code into `node_extensions.h` in order to initialize the following addon modules', defines);
      var uppercased = defines.map(function (x) { return x.toUpperCase() });
      var new_src = adaptNodeExtensions(src, uppercased);
      fs.writeFile(node_extensions_h_file, new_src, 'utf8', cb);
    } catch(e) {
      cb(e);
    }
  })
}
