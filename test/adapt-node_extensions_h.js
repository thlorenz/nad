'use strict';

var fs = require('fs');
var test = require('tap').test
var adaptExtensions = require('../lib/adapt-node_extensions_h')


var node_extensions_orig_file  = __dirname + '/fixtures/node_extensions.h.orig'
var node_extensions_mod_file  = __dirname + '/fixtures/node_extensions.h.mod'

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\ninjecting into original node_extensions.h', function (t) {
  fs.readFile(node_extensions_orig_file, 'utf8', function (err, src) {
    if (err) { t.fail(err); return t.end(); }
    
    var res = adaptExtensions(src, [ 'NODE_FOO_ADDON', 'NODE_BAR_ADDON' ] )
    t.deepEqual(
        res.split('\n')
      , [ 'NODE_EXT_LIST_START',
          'NODE_EXT_LIST_ITEM(node_buffer)',
          '#if HAVE_OPENSSL',
          'NODE_EXT_LIST_ITEM(node_crypto)',
          '#endif',
          'NODE_EXT_LIST_ITEM(node_evals)',
          'NODE_EXT_LIST_ITEM(node_fs)',
          'NODE_EXT_LIST_ITEM(node_http_parser)',
          'NODE_EXT_LIST_ITEM(node_os)',
          'NODE_EXT_LIST_ITEM(node_zlib)',
          '',
          '// libuv rewrite',
          'NODE_EXT_LIST_ITEM(node_timer_wrap)',
          'NODE_EXT_LIST_ITEM(node_tcp_wrap)',
          'NODE_EXT_LIST_ITEM(node_udp_wrap)',
          'NODE_EXT_LIST_ITEM(node_pipe_wrap)',
          'NODE_EXT_LIST_ITEM(node_cares_wrap)',
          'NODE_EXT_LIST_ITEM(node_tty_wrap)',
          'NODE_EXT_LIST_ITEM(node_process_wrap)',
          'NODE_EXT_LIST_ITEM(node_fs_event_wrap)',
          'NODE_EXT_LIST_ITEM(node_signal_wrap)',
          '',
          '',
          '/* START nad INJECTION, PLEASE DO NOT REMOVE */',
          '#ifdef NODE_FOO_ADDON',
          'NODE_EXT_LIST_ITEM(node_foo_addon)',
          '#endif',
          '#ifdef NODE_BAR_ADDON',
          'NODE_EXT_LIST_ITEM(node_bar_addon)',
          '#endif',
          '/* END nad INJECTION, PLEASE DO NOT REMOVE */',
          '',
          'NODE_EXT_LIST_END',
          '',
          '' ] 
      , 'injects ext list items in correct position'
    )
    t.end()
  })
})

test('\ninjecting into previously modified node_extensions.h NODE_BAR_ADDON was already added before', function (t) {
  fs.readFile(node_extensions_mod_file, 'utf8', function (err, src) {
    if (err) { t.fail(err); return t.end(); }
    
    var res = adaptExtensions(src, [ 'NODE_FOO_ADDON', 'NODE_BAR_ADDON' ] )
    t.deepEqual(
        res.split('\n')
      , [ 'NODE_EXT_LIST_START',
          'NODE_EXT_LIST_ITEM(node_buffer)',
          '#if HAVE_OPENSSL',
          'NODE_EXT_LIST_ITEM(node_crypto)',
          '#endif',
          'NODE_EXT_LIST_ITEM(node_evals)',
          'NODE_EXT_LIST_ITEM(node_fs)',
          'NODE_EXT_LIST_ITEM(node_http_parser)',
          'NODE_EXT_LIST_ITEM(node_os)',
          'NODE_EXT_LIST_ITEM(node_zlib)',
          '',
          '// libuv rewrite',
          'NODE_EXT_LIST_ITEM(node_timer_wrap)',
          'NODE_EXT_LIST_ITEM(node_tcp_wrap)',
          'NODE_EXT_LIST_ITEM(node_udp_wrap)',
          'NODE_EXT_LIST_ITEM(node_pipe_wrap)',
          'NODE_EXT_LIST_ITEM(node_cares_wrap)',
          'NODE_EXT_LIST_ITEM(node_tty_wrap)',
          'NODE_EXT_LIST_ITEM(node_process_wrap)',
          'NODE_EXT_LIST_ITEM(node_fs_event_wrap)',
          'NODE_EXT_LIST_ITEM(node_signal_wrap)',
          '',
          '/* START nad INJECTION, PLEASE DO NOT REMOVE */',
          '#ifdef NODE_FOO_ADDON',
          'NODE_EXT_LIST_ITEM(node_foo_addon)',
          '#endif',
          '#ifdef NODE_BAR_ADDON',
          'NODE_EXT_LIST_ITEM(node_bar_addon)',
          '#endif',
          '/* END nad INJECTION, PLEASE DO NOT REMOVE */',
          '',
          'NODE_EXT_LIST_END',
          '',
          '' ] 
      , 'replaces ext list items in correct position adding FOO_ADDON'
    )
    t.end()
  })
})

