'use strict';

var binding = require('nad-bindings')('hello');

console.log('hello', binding.hello());
