'use strict';

var fs = require('fs');
var test = require('tap').test
var adaptExtensions = require('../lib/adapt-node_extensions_cc')


var node_extensions_orig_file  = __dirname + '/fixtures/node_extensions-0.10.cc'
var node_extensions_injected_file  = __dirname + '/fixtures/node_extensions-0.10-injected.cc'

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nadapting node_extensions.cc', function (t) {
  var src = fs.readFileSync(node_extensions_orig_file, 'utf8')
    , injected = fs.readFileSync(node_extensions_injected_file, 'utf8')

  var res = adaptExtensions(src);

  t.equal(res, injected, 'injects the adapted snprintf statement and duplicates the loop, but leaves remaining code unchanged')
  t.end()
})
