'use strict';

var binding = require('nad-bindings')('{{ name }}');

console.log('node version', process.version);
console.log('> JS: Hi from JS {{ name }}\n> C++:', binding.{{ name }}());
