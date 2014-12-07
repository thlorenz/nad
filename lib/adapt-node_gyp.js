'use strict';

var path = require('path')
  , log = require('npmlog')

// 
// binding.gyp
//

function getTargetNames(targets) {
  return targets.map(function (x) { return x.target_name })
}

function adaptBindingGyp(projectDir, nodeDir, binding_gyp) {

  log.info('nad', 'Adapting node.gyp with targets found in binding.gyp')
  var targets = binding_gyp.targets
    , targetNames = getTargetNames(targets);

  log.info('nad', 'Found %d targets', targets.length, targetNames);

  function fixPath(p) {
    if (p.slice(0, 1) === '<') return p;
    var fullPath = path.resolve(projectDir, p)
    return path.relative(nodeDir, fullPath);
  }

  function fixPaths(t) {
    // add binding.gyp to sources
    t.sources.push('binding.gyp');
    if (t.sources) t.sources = t.sources.map(fixPath);
    if (t.dependencies) t.dependencies = t.dependencies.map(fixPath);
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

function rewriteNodeGyp(node_gyp, binding_gyp, projectDir, nodeDir) {
  var variables = getNodeVariables(node_gyp)
    , target = getNodeTarget(node_gyp)
    , extensions = []

  function addTargetVariable(t) {
    var variable = t.target_name + '_addon';
    if (variables[variable + '%']) log.warn('nad', 'Variable %s was added previously, not adding it again', variable)
    else  { 
      log.verbose('nad', 'Adding variable for %s', t.target_name, variable);
      variables[variable + '%'] = 'true'
    }
    return variable;
  }

  function addNodeGypVariables() {
    variables['module_root_dir%'] = projectDir;
    // TODO  argv.push('node_root_dir=' + nodeDir)
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
    extensions.push(t.target_name);
  }

  binding_gyp.targets.forEach(addTarget);
  addNodeGypVariables();
  return extensions;
}

module.exports =  

/**
 * Adapts the given node.gyp in order to include sources, include_dirs, etc. of
 * the supplied binding.gyp in order to make the addon part of the node build.
 * 
 * @name adaptNodeGyp
 * @function
 * @private
 * @param {string} projectDir full path to the directory of the addon project (where the `binding.gyp` file lives)
 * @param {string} nodeDir full path to the directory at which the node source code is located (alongside `node.gyp`)
 * @param {Object} binding_gyp the parsed content of `binding.gyp`
 * @param {Object} node_gyp the parsed content of `node.gyp`
 * @return {Object} with `{ node_gyp, extensions }` the `node.gyp` content
 * including the necessary changes to make the addon part of the build and the
 * addon extensions added to the build
 */
function adaptNodeGyp(projectDir, nodeDir, binding_gyp, node_gyp) {
  adaptBindingGyp(projectDir, nodeDir, binding_gyp);
  var extensions = rewriteNodeGyp(node_gyp, binding_gyp, projectDir);
    
  return { node_gyp: node_gyp, extensions: extensions };
}
