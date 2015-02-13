#!/usr/bin/env node

'use strict';

var log = require('npmlog')
var nad = require('../')
log.level = process.env.LOGLEVEL || 'info';

log.info('nad', 'Restoring node to state before addon was injected');

var node_version = process.argv[2]
  , node_dir     = process.argv[3]
  
try { nad.restore(node_version, node_dir) }
catch (err) { log.error('nad', err) }
