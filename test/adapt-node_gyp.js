'use strict';
/*jshint asi: true */

var test = require('tap').test
var resolveGyps = require('../lib/resolve-gyps')
var adaptNodeGyp = require('../lib/adapt-node_gyp')

var node_gyp_orig_file = __dirname + '/fixtures/node.gyp.orig'
var node_gyp_mod_file = __dirname + '/fixtures/node.gyp.mod'
var binding_foo_bar_baz_file = __dirname + '/fixtures/binding-foo_bar_baz.gyp'
var projectDir = __dirname + '/fixtures';
var nodeDir = projectDir + '/node-someversion';

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\ngiven a fresh node.gyp and a binding.gyp with valid foo bar and baz targets and an invalid boo target', function (t) {
  resolveGyps(binding_foo_bar_baz_file, node_gyp_orig_file, run);

  function run(err, res) {
    if (err) { t.fail(err); return t.end(); }
    var ret = adaptNodeGyp(projectDir, nodeDir, res.binding_gyp, res.node_gyp)
    t.deepEqual(
        ret.node_gyp.variables
      , { 'node_shared_openssl%': 'false',
          'v8_use_snapshot%': 'true',
          library_files: [ 'src/node.js' ],
          'node_foo_addon%': 'true',
          'node_bar_addon%': 'true',
          'node_baz_addon%': 'true' }
      , 'injects correct variables leaving out invalid addon'
    )
    t.deepEqual(
        ret.node_gyp.targets
      , [ { target_name: 'node',
            conditions:
              [ [ 'node_baz_addon=="true"',
                  { sources: [ '../src/node_baz.cc', '../binding.gyp' ],
                    include_dirs: [ '<!(node -e "require(\'nan\')")' ],
                    defines: [ 'NODE_BAZ_ADDON' ] } ],
                [ 'node_bar_addon=="true"',
                  { sources: [ '../src/node_bar.cc', '../binding.gyp' ],
                    include_dirs:
                    [ '../deps/bar',
                      '<!(node -e "require(\'nan\')")' ],
                    defines: [ 'NODE_BAR_ADDON' ] } ],
                [ 'node_foo_addon=="true"',
                  { sources:
                    [ '../src/node_foo.cc',
                      '../deps/foo/foo.c',
                      '../binding.gyp' ],
                    include_dirs:
                    [ '../deps/foo',
                      '<!(node -e "require(\'nan\')")' ],
                    defines: [ 'NODE_FOO_ADDON' ] } ],
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
      , 'injects addon conditions only into node target with adjusted paths, leaving out invalid addon'
    )
    t.deepEqual(
        ret.extensions
      , [ 'node_foo_addon',
          'node_bar_addon',
          'node_baz_addon' ] 
      , 'returns added extensions'
    )

    t.end()
  }
})

test('\ngiven a node.gyp into which node_bar addon was injected previously and a binding.gyp with valid foo bar and baz targets and an invalid boo target', function (t) {
  resolveGyps(binding_foo_bar_baz_file, node_gyp_mod_file, run);

  function run(err, res) {
    if (err) { t.fail(err); return t.end(); }
    var ret = adaptNodeGyp(projectDir, nodeDir, res.binding_gyp, res.node_gyp)
    t.deepEqual(
        ret.node_gyp.variables
      , { 'node_shared_openssl%': 'false',
          'v8_use_snapshot%': 'true',
          library_files: [ 'src/node.js' ],
          'node_foo_addon%': 'true',
          'node_bar_addon%': 'true',
          'node_baz_addon%': 'true' }
      , 'injects correct variables leaving out invalid addon without duplicating node_bar_addon'
    )
    t.deepEqual(
        ret.node_gyp.targets
      , [ { target_name: 'node',
            conditions:
              [ [ 'node_baz_addon=="true"',
                  { sources: [ '../src/node_baz.cc', '../binding.gyp' ],
                    include_dirs: [ '<!(node -e "require(\'nan\')")' ],
                    defines: [ 'NODE_BAZ_ADDON' ] } ],
                [ 'node_bar_addon=="true"',
                  { sources: [ '../src/node_bar.cc', '../binding.gyp' ],
                    include_dirs:
                    [ '../deps/bar',
                      '<!(node -e "require(\'nan\')")' ],
                    defines: [ 'NODE_BAR_ADDON' ] } ],
                [ 'node_foo_addon=="true"',
                  { sources:
                    [ '../src/node_foo.cc',
                      '../deps/foo/foo.c',
                      '../binding.gyp' ],
                    include_dirs:
                    [ '../deps/foo',
                      '<!(node -e "require(\'nan\')")' ],
                    defines: [ 'NODE_FOO_ADDON' ] } ],
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
      , 'injects addon conditions only into node target with adjusted paths, leaving out invalid addon and replacing node_bar_addon'
    )
    t.deepEqual(
        ret.extensions
      , [ 'node_foo_addon',
          'node_bar_addon',
          'node_baz_addon' ] 
      , 'returns added extensions'
    )
    t.end()
  }
})
