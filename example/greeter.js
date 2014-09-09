'use strict';

var binding = require('nad-bindings')('greeter');

var greetme = module.exports = binding.greetme;

console.log('node version', process.version);

// Example usage
var greeting = greetme('You');
console.log(greeting);
