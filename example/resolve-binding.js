'use strict';

var debugging = !!process.env.DYLD_LIBRARY_PATH;

module.exports = 

/**
 * Convenience function to consistently resolve a module binding for two cases:
 *
 *  - 1) module is run as addon and the `bindings` module is used to resolve the module with the full name
 *  - 2) module is currently being debugged and directly executed inside a node process and therefore is resolved via `process.binding`
 *       using the name with `node_` sliced off
 *
 * @name resolveBinding
 * @function
 * @param {string} name full name of the module that needs to start with `node_` i.e. `node_foo` 
 * @return {Object} the binding object of the native module
 */
function resolveBinding(name) {
  return debugging 
    ? process.binding(name.slice('node_'.length)) 
    : require('bindings')(name);
}


