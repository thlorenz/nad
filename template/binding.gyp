{
  "targets": [
    { 
      'target_name': '{{ name }}',
      'sources': [ 
          './src/{{ name }}.cc',
          './{{ orig_name }}.js',
        ],
        'include_dirs': [
          '<!(node -e "require(\'nan\')")',
      ],
    }
  ]
}
