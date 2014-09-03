'use strict';
/*jshint asi: true */

require('npmlog').level = 'verbose'
var test = require('tap').test
var path = require('path')
var resolveGyps = require('../lib/resolve-gyps')
var adaptNodeGyp = require('../lib/adapt-node_gyp')

var gyp_orig_file = __dirname + '/fixtures/node.gyp.orig'
var gyp_mod_file = __dirname + '/fixtures/node.gyp.mod'
var binding_foo_bar_baz_file = __dirname + '/fixtures/binding-foo_bar_baz.gyp'
var projectDir = __dirname + '/fixtures';
var nodeDir = projectDir + '/node-someversion';

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\ngiven a fresh node.gyp and a binding.gyp with foo bar and baz targets', function (t) {
  resolveGyps(binding_foo_bar_baz_file, gyp_orig_file, run);

  function run(err, res) {
    if (err) { t.fail(err); return t.end(); }

    var ret;
    try { 
      ret = adaptNodeGyp(projectDir, nodeDir, res.binding_gyp, res.node_gyp)
    } catch(err) {
      t.fail(err); t.end();
    }

    t.deepEqual(
        ret.node_gyp.variables
      , { 'node_shared_openssl%': 'false',
          'v8_use_snapshot%': 'true',
          library_files: [ 'src/node.js' ],
          'foo_addon%': 'true',
          'bar_addon%': 'true',
          'baz_addon%': 'true',
          'module_root_dir%': path.dirname(binding_foo_bar_baz_file) }
      , 'injects correct variables'
    )
    t.deepEqual(
        ret.node_gyp.targets
      , [ { target_name: 'node',
            conditions:
            [ [ 'baz_addon=="true"',
                { sources: [ '../src/baz.cc', '../binding.gyp' ],
                  include_dirs: [ '<!(node -e "require(\'nan\')")' ],
                  defines: [ 'BAZ_ADDON' ] } ],
              [ 'bar_addon=="true"',
                { sources: [ '../src/bar.cc', '../binding.gyp' ],
                  include_dirs:
                    [ '../deps/bar',
                      '<!(node -e "require(\'nan\')")' ],
                  defines: [ 'BAR_ADDON' ] } ],
              [ 'foo_addon=="true"',
                { sources:
                    [ '../src/foo.cc',
                      '../deps/foo/foo.c',
                      '../binding.gyp' ],
                  include_dirs:
                    [ '../deps/foo',
                      '<!(node -e "require(\'nan\')")' ],
                  defines: [ 'FOO_ADDON' ] } ],
              [ 'node_use_openssl=="true"',
                { sources: [ 'src/node_crypto.cc' ],
                  conditions:
                    [ [ 'node_shared_openssl=="false"',
                        { dependencies: [ './deps/openssl/openssl.gyp:openssl' ],
                          conditions:
                          [ [ 'OS in "linux freebsd"',
                              { ldflags: [ '-Wl,--whole-archive <(PRODUCT_DIR)/libopenssl.a -Wl,--no-whole-archive' ] } ] ],
                          xcode_settings: { OTHER_LDFLAGS: [ '-Wl,-force_load,<(PRODUCT_DIR)/libopenssl.a' ] } } ] ],
                  defines: [ 'HAVE_OPENSSL=1' ] },
                { defines: [ 'HAVE_OPENSSL=0' ] } ] ],
            sources:
            [ 'src/v8_typed_array.h',
              '<@(library_files)' ],
            dependencies: [ 'node_js2c#host' ],
            include_dirs: [ 'src', '<(SHARED_INTERMEDIATE_DIR)' ],
            type: 'executable',
            defines: [ 'NODE_TAG="<(node_tag)"' ] },
          { target_name: 'node_etw', type: 'none' } ] 
      , 'injects addon conditions only into node target with adjusted paths'
    )
    t.deepEqual(
        ret.extensions
      , [ 'foo',
          'bar',
          'baz' ] 
      , 'returns added extensions'
    )

    t.end()
  }
})

test('\ngiven a node.gyp into which bar addon was injected previously and a binding.gyp with foo bar and baz targets', function (t) {
  resolveGyps(binding_foo_bar_baz_file, gyp_mod_file, run);

  function run(err, res) {
    if (err) { t.fail(err); return t.end(); }
    var ret;
    try { 
      ret = adaptNodeGyp(projectDir, nodeDir, res.binding_gyp, res.node_gyp)
    } catch(err) {
      t.fail(err); t.end();
    }
    t.deepEqual(
        ret.node_gyp.variables
      , { 'node_shared_openssl%': 'false',
          'v8_use_snapshot%': 'true',
          library_files: [ 'src/node.js' ],
          'foo_addon%': 'true',
          'bar_addon%': 'true',
          'baz_addon%': 'true',
          'module_root_dir%': path.dirname(binding_foo_bar_baz_file) }
      , 'injects correct variables leaving out invalid addon without duplicating bar_addon'
    )
    t.deepEqual(
        ret.node_gyp.targets
      , [ { target_name: 'node',
            conditions:
            [ [ 'baz_addon=="true"',
                { sources: [ '../src/baz.cc', '../binding.gyp' ],
                  include_dirs: [ '<!(node -e "require(\'nan\')")' ],
                  defines: [ 'BAZ_ADDON' ] } ],
              [ 'bar_addon=="true"',
                { sources: [ '../src/bar.cc', '../binding.gyp' ],
                  include_dirs:
                    [ '../deps/bar',
                      '<!(node -e "require(\'nan\')")' ],
                  defines: [ 'BAR_ADDON' ] } ],
              [ 'foo_addon=="true"',
                { sources:
                    [ '../src/foo.cc',
                      '../deps/foo/foo.c',
                      '../binding.gyp' ],
                  include_dirs:
                    [ '../deps/foo',
                      '<!(node -e "require(\'nan\')")' ],
                  defines: [ 'FOO_ADDON' ] } ],
              [ 'node_use_openssl=="true"',
                { sources: [ 'src/node_crypto.cc' ],
                  conditions:
                    [ [ 'node_shared_openssl=="false"',
                        { dependencies: [ './deps/openssl/openssl.gyp:openssl' ],
                          conditions:
                          [ [ 'OS in "linux freebsd"',
                              { ldflags: [ '-Wl,--whole-archive <(PRODUCT_DIR)/libopenssl.a -Wl,--no-whole-archive' ] } ] ],
                          xcode_settings: { OTHER_LDFLAGS: [ '-Wl,-force_load,<(PRODUCT_DIR)/libopenssl.a' ] } } ] ],
                  defines: [ 'HAVE_OPENSSL=1' ] },
                { defines: [ 'HAVE_OPENSSL=0' ] } ] ],
            sources:
            [ 'src/v8_typed_array.h',
              '<@(library_files)' ],
            dependencies: [ 'node_js2c#host' ],
            include_dirs: [ 'src', '<(SHARED_INTERMEDIATE_DIR)' ],
            type: 'executable',
            defines: [ 'NODE_TAG="<(node_tag)"' ] },
          { target_name: 'node_etw', type: 'none' } ]  
      , 'injects addon conditions only into node target with adjusted paths, replacing bar_addon'
    )
    t.deepEqual(
        ret.extensions
      , [ 'foo',
          'bar',
          'baz' ] 
      , 'returns added extensions'
    )
    t.end()
  }
})
