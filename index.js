'use strict';

var injectNodeGyp = require('./lib/inject-node_gyp')
  , injectNodeExtensions = require('./lib/inject-node_extensions')
  , path = require('path')
  , fs = require('fs')
  , semver = require('semver')
  , node_0_10 = semver.Range('>= 0.10.0 < 0.11')
  , node_greater_0_10 = semver.Range('>= 0.11.13')

function copyFileSync(srcFile, destFile) {
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

function getFiles(nodeDir) {
  return  { node_gyp_file           : path.join(nodeDir, 'node.gyp')
          , node_extensions_h_file  : path.join(nodeDir, 'src', 'node_extensions.h')
          , node_extensions_cc_file : path.join(nodeDir, 'src', 'node_extensions.cc') }
}

function backup(file) {
  var copy = file + '.orig'
  if (!fs.existsSync(copy)) copyFileSync(file, copy);
}

function restore(copy) {
  var file = copy.slice(0, -'.orig'.length);
  if (fs.existsSync(copy)) copyFileSync(copy, file);
}

function inject_0_10(projectDir, nodeDir, cb) {
  var files = getFiles(nodeDir);

  backup(files.node_gyp_file)
  backup(files.node_extensions_h_file)
  backup(files.node_extensions_cc_file)

  injectNodeGyp(projectDir, nodeDir, onnodegyped);

  function onnodegyped(err, res) {
    if (err) return cb(err);

    injectNodeExtensions(
        files.node_extensions_h_file
      , files.node_extensions_cc_file
      , res.extensions
      , cb)
  }
}

function inject_greater_0_10(projectDir, nodeDir, cb) {
  var files = getFiles(nodeDir);

  backup(files.node_gyp_file)
  injectNodeGyp(projectDir, nodeDir, cb);
}

function restore_0_10(nodeDir) {
  var files = getFiles(nodeDir);
  restore(files.node_gyp_file)
  restore(files.node_extensions_h_file)
  restore(files.node_extensions_cc_file)
}

function restore_greater_0_10(nodeDir) {
  var files = getFiles(nodeDir);
  restore(files.node_gyp_file)
}

exports.inject = function inject(nodeVersion, projectDir, nodeDir, cb) {
  if (node_0_10.test(nodeVersion)) return inject_0_10(projectDir, nodeDir, cb);
  if (node_greater_0_10.test(nodeVersion)) return inject_greater_0_10(projectDir, nodeDir, cb);
  cb(new Error('nad only works for Node.js 0.10 and greater'));
}

exports.restore = function restore(nodeVersion, nodeDir) {
  if (node_0_10.test(nodeVersion)) return restore_0_10(nodeDir);
  if (node_greater_0_10.test(nodeVersion)) return restore_greater_0_10(nodeDir);
  throw new Error('nad only works for Node.js 0.10 and greater');
}

exports.injectNodeGyp = injectNodeGyp;
exports.injectNodeExtensions = injectNodeExtensions;
