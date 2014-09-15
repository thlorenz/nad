#!/usr/bin/env node

'use strict';

var log    = require('npmlog')
  , fs     = require('fs')
  , path   = require('path')
  , mkdirp = require('mkdirp')
  , yawn   = require('yawn')

log.level = process.env.LOGLEVEL || 'info';

var cwd  = process.argv[2]
  , orig_name = process.argv[3]

if (!orig_name) 
  return log.error('nad', 'You need to supply a name for your project');

var addon_name   = orig_name.replace(/[ -]/g, '_')
  , addon_Name   = addon_name[0].toUpperCase() + addon_name.slice(1)
  , project_dir  = path.join(cwd, orig_name)
  , template_dir = path.join(__dirname, '..', 'template')

log.info('nad', 'Initializing a Node.js addon project inside', project_dir);

if (fs.existsSync(project_dir)) 
  return log.error('nad', project_dir + ' already exists, cannot create a project there. Please pick a different name');

mkdirp(project_dir);
mkdirp(path.join(project_dir, 'src'));

[ [ '__name__.js'     , orig_name + '.js'           ] 
, [ 'src/__name__.cc' , 'src/' + addon_name + '.cc' ]
, [ 'binding.gyp'     , 'binding.gyp'               ]
, [ 'package.json'    , 'package.json'              ]
].forEach(addToProject)

function addToProject(args) {
  var src = args[0]
    , tgt = args[1]
  var code = fs
    .readFileSync(path.join(template_dir, src), 'utf8')
    .replace(/{{ *name *}}/g, addon_name)
    .replace(/{{ *Name *}}/g, addon_Name)
    .replace(/{{ *orig_name *}}/g, orig_name)

  fs.writeFileSync(path.join(project_dir, tgt), code, 'utf8');
}

var opts = { cwd: path.join(process.cwd(), orig_name), stdio: 'inherit' };
var install = yawn('npm', [ 'install' ], opts, function (err) {
  if (err) return log.error('nad', err);

  log.info('nad', 'Your project is ready to go');
  log.info('nad', 'Run "node ' + orig_name + '" to test it');
  log.info('nad', 'Run "nad build && nad build" to generate a nad project and open it in an IDE');
})
