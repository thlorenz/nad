{
  "targets": [
    {
      'target_name': 'greeter',
      'sources': [ 
          './src/greeter.cc',
          './deps/greet/greet.c',
        ],
        'include_dirs': [
          './deps/greet',
          '<!(node -e "require(\'nan\')")',
      ],
    },
    { 
      'target_name': 'hello',
      'sources': [ 
          './src/hello.cc',
        ],
        'include_dirs': [
          '<!(node -e "require(\'nan\')")',
      ],
    }
  ]
}
