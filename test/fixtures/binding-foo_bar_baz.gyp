{
  "targets": [
    {
      'target_name': 'node_foo',
      'sources': [ 
          './src/node_foo.cc',
          './deps/foo/foo.c',
        ],
        'include_dirs': [
          './deps/foo',
          '<!(node -e "require(\'nan\')")',
      ],
    },
    {
      'target_name': 'node_bar',
      'sources': [ 
          './src/node_bar.cc',
        ],
        'include_dirs': [
          './deps/bar',
          '<!(node -e "require(\'nan\')")',
      ],
    },
    { 
      'target_name': 'node_baz',
      'sources': [ 
          './src/node_baz.cc',
        ],
        'include_dirs': [
          '<!(node -e "require(\'nan\')")',
      ],
    },
    {
      'target_name': 'invalid_boo',
      'sources': [ 
          './src/node_boo.cc',
          './deps/boo/boo.c',
        ],
        'include_dirs': [
          './deps/boo',
          '<!(node -e "require(\'nan\')")',
      ],
    }
  ]
}
