'use strict';

var logs = [ 'Start of logs' ];

var request = 'GET /index.html HTTP/1.0\r\n\r\n"';
var regex = '^\\s*(\\S+)\\s+(\\S+)\\s+HTTP/(\\d)\\.(\\d)';
var flags = 0;

//struct slre_cap caps[4];

var res = slre_match(regex, request, flags)
logs.push(res);

(function() { return logs.join('\n'); })();
