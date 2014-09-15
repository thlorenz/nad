'use strict';
var fs = require('fs')

module.exports = function copyFileSync(srcFile, destFile) {
  var BUF_LENGTH = 64 * 1024
  var buf = new Buffer(BUF_LENGTH)

  var fdr       = fs.openSync(srcFile, 'r')
    , stat      = fs.fstatSync(fdr)
    , fdw       = fs.openSync(destFile, 'w', stat.mode)
    , bytesRead = 1
    , pos       = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, buf, 0, bytesRead);
    pos += bytesRead;
  }
  fs.closeSync(fdr);
  return fs.closeSync(fdw);
}
