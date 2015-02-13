'use strict';

var go = module.exports = 
  
/**
 * Adapts the code to inject a second loop that looks for modules
 * without the `node_` prefix. This will find our addon modules.
 *
 * This strategy will break if an addon has the exact same name as a builtin
 * node module, but we can live with that.
 *
 * This only works for node `< v0.11` since `node_extensions.h` and `node_extensions.cc` 
 * drastically changed during `0.11` development until they completely disappeared around `v0.11.12`.
 *
 * However node v0.12 and io.js 1.0 added process._linkedBinding, so we don't need to perform these rewrites.
 * 
 * @name adaptNodeExtensionsCC
 * @function
 * @private
 * @param {string} src the current source of `node_extensions.cc`
 * @return {string}{ adapted code
 */
function adaptNodeExtensionsCC(src) {

  // basically copy the lines `snprintf(...` until `return NULL` and then insert them again with the prefix adjusted

  var lines = src.split('\n')
    , replacement = []
    , extra = []
    , inloop
    , l

  for (var i = 0; i < lines.length; i++) {
    l = lines[i]  
    if(/^ *snprintf\(.+"node_.+\); *$/.test(l)) { 
      inloop = true;
      extra.push(l.replace(/node_/, ''));
      replacement.push(l);
      continue;
    }

    if (inloop === true) {
      if(/^ *return NULL; *$/.test(l)) {
        inloop = false;
        replacement = replacement.concat(extra);
      } else {
        extra.push(l);
      }
    } 
    replacement.push(l);

  }
  
  return replacement.join('\n')
}
