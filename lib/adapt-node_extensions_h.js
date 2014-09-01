'use strict';
var us          = require('update-section')
  , log         = require('npmlog')
  , us_start    = '/* START nad INJECTION, PLEASE DO NOT REMOVE */'
  , us_end      = '/* END nad INJECTION, PLEASE DO NOT REMOVE */'
  , us_start_rx = /^\/\* START nad INJECTION/
  , us_end_rx   = /^\/\* END nad INJECTION/

function modStart(line) {
  return us_start_rx.test(line);  
}

function modEnd(line) {
  return us_end_rx.test(line);  
}

function node_ext_list_item(define) {
  return '#ifdef ' + define + '\n'
    + 'NODE_EXT_LIST_ITEM(' + define.toLowerCase() + ')' + '\n'
    + '#endif'
}

function injectDefines(lines, items) {
  log.verbose('nad', 'Injecting addon modules into previously unmodified `node_extensions.h`');

  // We'll inject our code right above 'NODE_EXT_LIST_END'
  var idx = lines.length - 1;
  for (; idx >= 0; idx--) {
    if (/^NODE_EXT_LIST_END/.test(lines[idx])) break; 
  }
  // NODE_LIST_END needs to be at least on the second line
  if (!idx) throw new Error('Could not find where to inject defines inside of ' + lines.join('\n'));

  lines.splice(idx, 1, items.concat([ '', 'NODE_EXT_LIST_END' ]).join('\n'))
  return lines.join('\n');
}

function replaceDefines(src, items) {
  log.verbose('nad', 'Replacing addon modules into previously modified `node_extensions.h`');
  return us(src, items.join('\n'), modStart, modEnd);
}

var go = module.exports = 
  
/**
 * Adapts source inside `node_extensions.h` file to include `NODE_EXT_LIST_ITEM` macro calls for all modules of the addon.
 *
 * @name adaptNodeExtensions
 * @function
 * @private
 * @param {string} src current `node_extensions.h` code
 * @param {Array.<string>} defines the (uppercased defines) to insert
 * @return {string} modified `node_extensions.h` code
 */
function adaptNodeExtensions(src, defines) {
  var lines = src.split('\n');
  var mod = us.parse(lines, modStart, modEnd)

  var injectItems = [ us_start]
    .concat(defines.map(node_ext_list_item))
    .concat(us_end);

  return mod.hasStart ? replaceDefines(src, injectItems) : injectDefines(lines, injectItems);
}
