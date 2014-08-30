{
  'targets': [
    {
      'target_name': 'node-slre-app',
      'type': 'executable',
      'sources': [
         './src/node-slre.cc',
         './deps/slre/slre.c',
         './src/main.cc',
         './src/node-slre.h',
         'test.js'
      ],
      'includes': [
        'common.gypi', 
      ],
      'include_dirs': [
        './deps/node/src',
        './deps/node/deps/v8/src',
        './deps/node/deps/v8/include',
        './deps/node/deps/uv/src',
        './deps/node/deps/uv/src/unix',
        './deps/node/deps/uv/include',
        './deps/node/deps/http_parser',
        './deps/node/deps/cares/include',
        './deps/slre',
        '<!(node -e "require(\'nan\')")'
      ],
      'libraries': [
        './deps/node/out/Debug/libv8_base.a',
        './deps/node/out/Debug/libv8_nosnapshot.a',
        './deps/node/out/Debug/libcares.a',
        './deps/node/out/Debug/libchrome_zlib.a',
        './deps/node/out/Debug/libhttp_parser.a',
        './deps/node/out/Debug/libopenssl.a',
        './deps/node/out/Debug/libuv.a',
      ]
    },
  ]
}
