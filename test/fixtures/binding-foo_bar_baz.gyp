{
  "targets": [
    {
      'target_name': 'foo',
      'sources': [ 
          './src/foo.cc',
          './deps/foo/foo.c',
        ],
        'include_dirs': [
          './deps/foo',
          '<!(node -e "require(\'nan\')")',
      ],
    },
    {
      'target_name': 'bar',
      'sources': [ 
          './src/bar.cc',
        ],
        'include_dirs': [
          './deps/bar',
          '<!(node -e "require(\'nan\')")',
      ],
    },
    { 
      'target_name': 'baz',
      'sources': [ 
          './src/baz.cc',
        ],
        'include_dirs': [
          '<!(node -e "require(\'nan\')")',
      ],
    }
  ]
}
