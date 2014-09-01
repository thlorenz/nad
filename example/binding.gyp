{
  "targets": [
    {
      "target_name": "node_slre",
      "sources": [ 
          './src/node_slre.cc',
          './deps/slre/slre.c',
        ],
        'include_dirs': [
          './deps/slre',
          '<!(node -e "require(\'nan\')")',
      ],
    },
    { 
      "target_name": "node_hello",
      "sources": [ 
          './src/node_hello.cc',
        ],
        'include_dirs': [
          '<!(node -e "require(\'nan\')")',
      ],
    }
  ]
}
