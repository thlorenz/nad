#!/usr/bin/env node

'use strict';

var log = require('npmlog')
var nad = require('../')
log.level = process.env.LOGLEVEL || 'info';

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

log.info('nad', 'Injecting addon in current dir into installed Node.js');

inspect(process.argv)

var project_dir = process.argv[2] 
  , node_dir = process.argv[3]
  
nad.inject(project_dir, node_dir, function (err) {
  if (err) return console.error(err);
})
