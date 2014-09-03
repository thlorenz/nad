'use strict';

var binding = require('nad-bindings')('greeter');

var greetme = module.exports = binding.greetme;

// Example usage
var greeting = greetme('You');
console.log(greeting);
