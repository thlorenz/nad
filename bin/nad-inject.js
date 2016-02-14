#!/usr/bin/env node

'use strict';

var log = require('npmlog')
var nad = require('../')
log.level = process.env.LOGLEVEL || 'info';

log.info('nad', 'Injecting addon in current dir into installed node');

var node_version = process.argv[2]
  , project_dir  = process.argv[3]
  , node_dir     = process.argv[4]
  
nad.inject(node_version, project_dir, node_dir, function (err) {
  if (err) {
    log.error('nad', err);
    process.exit(1);
  }
})
