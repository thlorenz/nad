'use strict';

var binding = require('./resolve-binding')('node_hello');

console.log('hello', binding.hello());
