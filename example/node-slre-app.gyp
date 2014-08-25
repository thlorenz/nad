{
  'targets': [
    {
      'target_name': 'node-slre-app',
      'type': 'executable',
      'sources': [
         './src/main.cc',
         './src/node-slre.cc',
         './deps/slre/slre.c'
      ],
      'includes': [
        'common.gypi'
      ],
      'include_dirs': [
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "src"))\')',
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "deps", "v8", "src"))\')',
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "deps", "v8", "include"))\')',
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "deps", "uv", "include"))\')',
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "deps", "uv", "src"))\')',
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "deps", "uv", "src", "unix"))\')',
        '<!(node -e \'console.log(require("path").join(process.env.HOME, ".node-gyp", process.versions.node, "deps", "http_parser"))\')',
        './deps/slre'
      ]
    }
  ]
}
