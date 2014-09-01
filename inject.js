'use strict';

/* Yeah this module uses sync methods -- it's meant to be used as a CLI only */

var gr = require('gyp-reader')
  , path = require('path')
  , fs = require('fs')
  , log = require('npmlog')

log.level = 'verbose';

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

// 
// binding.gyp
//

function getTargetNames(targets) {
  return targets.map(function (x) { return x.target_name })
}

function isValidTargetName(name) {
  return name.slice(0, 'node_'.length) === 'node_';
}

function validateTargetNames(names) {
  var invalids = [];
  for (var i = 0; i < names.length; i++) {
    if (!isValidTargetName(names[i])) invalids.push(names[i])
  }

  return invalids;
}

function adaptBindingGyp(projectDir, nodeDir, binding_gyp) {

  log.info('nad', 'Sucessfully loaded binding.gyp and node.gyp')
  var targets = binding_gyp.targets
    , targetNames = getTargetNames(targets);

  log.info('nad', 'Found %d targets', targets.length, targetNames);
  var invalids = validateTargetNames(targetNames);

  if (invalids.length) {
    log.warn('nad', 'The following target names will not work with nad (need to start with "node_") and therefore are not going to be debuggable', invalids);
    binding_gyp.targets = targets.filter(function (x) { return isValidTargetName(x.target_name) }); 
  }

  function fixPath(p) {
    if (p.slice(0, 1) === '<') return p;
    var fullPath = path.resolve(projectDir, p)
    return path.relative(nodeDir, fullPath);
  }

  function fixPaths(t) {
    // add binding.gyp to sources
    t.sources.push('binding.gyp');
    if (t.sources) t.sources = t.sources.map(fixPath);
    if (t.include_dirs) t.include_dirs = t.include_dirs.map(fixPath);

  }

  binding_gyp.targets.forEach(fixPaths);
}

// 
// node.gyp
//

function getNodeVariables(gyp) {
  if (!gyp.variables) throw new Error('node.gyp is missing "variables"');
  return gyp.variables;
}

function getNodeTarget(gyp) {
  if (!gyp.targets) throw new Error('node.gyp is missing "targets"');
  var nodeTarget = gyp.targets.filter(function (x) { return x.target_name === 'node' })[0];
  if (!nodeTarget) throw new Error('node.gyp is missing "node" target');
  return nodeTarget;
}

function adaptNodeGyp(node_gyp, binding_gyp) {
  var variables = getNodeVariables(node_gyp)
    , target = getNodeTarget(node_gyp)

  function addTargetVariable(t) {
    var variable = t.target_name + '_addon';
    if (variables[variable + '%']) log.warn('nad', 'Variable %s was added previously, not adding it again', variable)
    else  { 
      log.verbose('nad', 'Adding variable for %s', t.target_name, variable);
      variables[variable + '%'] = 'true'
    }
    return variable;
  }

  function addCondition(t, variable) {
     var condname = variable + '=="true"';
     var condopts = {};

     var condition = [ condname, condopts ];
     // copy all existing properties of the target except target name
     Object.keys(t)
      .filter(function (k) { return k !== 'target_name' })
      .forEach(function (k) {
        condopts[k] = t[k]
      })

    // add defines so we can use it inside node_extensions.h #ifdef statement
    condopts.defines = condopts.defines || [];
    condopts.defines.push(variable.toUpperCase());
    
    // remove existing conditions with same name
    for (var i = 0; i < target.conditions.length; i++) {
      if (target.conditions[i][0] === condname) {
        log.warn('nad', 'Condition for %s was added previously, replacing it', variable);
        target.conditions.splice(i, 1);
        break;
      }
    }

    log.verbose('nad', 'Adding condition for %s', t.target_name, condition);
    target.conditions.unshift(condition);
  }

  function addTarget(t) {
    log.info('nad', 'Injecting node.gyp debug hooks for target %s', t.target_name);
    var variable = addTargetVariable(t);
    addCondition(t, variable);
  }

  binding_gyp.targets.forEach(addTarget);
}

var go = module.exports = function (projectDir, nodeDir, opts, cb) {
  var binding_gyp_file = path.join(projectDir, 'binding.gyp');
  var node_gyp_file = path.join(nodeDir, 'node.gyp.orig');

  if (!fs.existsSync(binding_gyp_file)) return cb(new Error('No binding.gyp file found inside ' + projectDir));
  if (!fs.existsSync(node_gyp_file)) return cb(new Error('No node.gyp file found inside ' + nodeDir));
  
  var binding_gyp, node_gyp;
  gr(binding_gyp_file, onbinding_gyp);
  gr(node_gyp_file, onnode_gyp);

  function onbinding_gyp(err, gyp) {
    if (err) return cb(new Error('An error occurred when trying to read binding.gyp: [ Message: ' + err.message + ', Code: ' + err.code + ']'));
    binding_gyp = gyp;
    if (node_gyp) ongyp()
  }

  function onnode_gyp(err, gyp) {
    if (err) return cb(new Error('An error occurred when trying to read node.gyp: [ Message: ' + err.message + ', Code: ' + err.code + ']'));
    node_gyp = gyp;
    if (binding_gyp) ongyp()
  }

  function ongyp() {
    adaptBindingGyp(projectDir, nodeDir, binding_gyp);
    try {
      adaptNodeGyp(node_gyp, binding_gyp);
    } catch(err) {
      return cb(err);
    }
    var json = JSON.stringify(node_gyp, null, 2);

    require('fs').writeFileSync(__dirname + '/example/node-0.10.31/node.gyp', json);
    
  }
}

// Test
if (!module.parent && typeof window === 'undefined') {
  go(__dirname + '/example', __dirname + '/example/node-0.10.31', {}, function (err, res) {
    if (err) return console.error(err);
       
  });  
}
