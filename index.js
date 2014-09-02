'use strict';

var injectNodeGyp = require('./lib/inject-node_gyp')
  , injectNodeExtensions = require('./lib/inject-node_extensions_h')
  , path = require('path')

exports.inject = function inject(projectDir, nodeDir, cb) {
  injectNodeGyp(projectDir, nodeDir, onnodegyped);
  function onnodegyped(err, res) {
    if (err) return cb(err);
    var node_extensions_h_file = path.join(nodeDir, 'src', 'node_extensions.h');
    injectNodeExtensions(node_extensions_h_file, res.extensions, cb)
  }
}

exports.injectNodeGyp = injectNodeGyp;
exports.injectNodeExtensions = injectNodeExtensions;
