'use strict';

var logs = [ ];

var request = 'GET /index.html HTTP/1.0\r\n\r\n"';
var regex = '^\\s*(\\S+)\\s+(\\S+)\\s+HTTP/(\\d)\\.(\\d)';
var ncaps = 4;
var flags = 0;

function onmatched(){
  for(var i=0; i < arguments.length; i++) {
    logs.push('ret[' + i + ']: ' + arguments[i]);
  }
}

logs.push('Calling match');
slre_match(regex, request, ncaps,  flags, onmatched)
logs.push('Called match');

(function() { return logs.join('\n'); })();
