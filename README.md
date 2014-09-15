# nad [![build status](https://secure.travis-ci.org/thlorenz/nad.png?branch=master)](http://travis-ci.org/thlorenz/nad)

Node Addon Developer, a tool to inject your addon code into a copy of the node codebase in order to integrate with IDEs and debuggers easily.

![level-sample](https://raw.githubusercontent.com/thlorenz/nad/master/assets/level-sample.png)

## Installation

    npm install -g nad

## Getting Started

```sh
nad init my-addon
cd my-addon

## Try the node-gyp build
node ./my-addon.js

## Generate Xcode project and open it (nad build runs nad configure automatically with defaults)
nad build
nad open

## Select node target in Xcode and try to build if it fails see ## Caveats and nad fix
```

## CLI

### nad init

Initializes nad project in current dir, i.e. `nad init my-addon`

### nad configure

```
usage: nad configure <options> 

  Overrides configuration options for building your node addon project.

OPTIONS:

  -h, --help      Print this help message.
  --cc            C compiler to use (default: clang)
  --cxx           C++ compiler to use (default: clang++)
  --link          Linker to use (default: clang++)
  --target        Node.js version into which to inject the addon (default: version of node in path)
  --nodedir       Directory that contains source code of Node.js into which to inject the addon (overrides target) (default: ./node-<target>)

EXAMPLES:

  # Fetch and compile Node.js v0.10.31 with gcc, link with ld
  nad configure --cc gcc --cxx gcc --link ld --target 0.10.31

  # Use the Node.js installation we cloned locally
  nad configure --nodedir ../node
```

### nad build

Injects project in current folder into Node.js build and rebuilds it.

### nad open

Opens the Xcode project for the addon in the current folder.

### nad fetch

Fetches source for configured Node.js version.

### nad inject

Injects project in current folder into Node.js build.

### nad restore

Restores Node.js build to its original state by removing the addon project that was injected previously.

### nad help

Prints help about `nad configure`

## Caveats

Supports only node `< v0.11` right now due to changes in module loading in `0.11+`. Support for `>= 0.11` is under way.

Xcode does not properly copy over the `debug-support.cc` into it's `DerivedSources`. So if you get an error similar to:

```
clang: error: no such file or directory:
'/Users/thlorenz/Library/Developer/Xcode/DerivedData/node-xxxxx/Build/Products/DerivedSources/Debug/debug-support.cc'
clang: error: no input files
Command /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang failed with exit
code 1k
```

### nad fix

If the error is as follows (`1234` being the project hash):

```
'/Users/thlorenz/Library/Developer/Xcode/DerivedData/node-1234/Build/Products/DerivedSources/Debug/debug-support.cc' ...
```

Fix it via :

```
nad fix 1234
```

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="nad::injectNodeExtensions"><span class="type-signature"></span>nad::injectNodeExtensions<span class="signature">(node_extensions_h_file, node_extensions_cc_file, extensions, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Injects source into <code>node_extensions.h</code> file to include <code>NODE_EXT_LIST_ITEM</code> macro calls for all valid targets of the addon.</p>
<p>This is only necessary for Node.js <code>&lt; v0.11</code> since <code>node_extensions.h</code> and <code>node_extensions.cc</code>
drastically changed during <code>0.11</code> development until they completely disappeared around <code>v0.11.12</code>.
Starting with <code>v0.11.13</code> an addon module can be loaded dynamically even if it is not registered in the source code.</p>
<h4>Example</h4>
<p>For targets <code>[ 'node_foo', 'node_bar' ]</code> it injects following code into <code>node_extensions.h</code></p>
<pre><code>/* START nad INJECTION, PLEASE DO NOT REMOVE /
#ifdef NODE_FOO_ADDON
NODE_EXT_LIST_ITEM(node_bar)
#endif
#ifdef NODE_BAR_ADDON
NODE_EXT_LIST_ITEM(node_bar)
#endif
/* END nad INJECTION, PLEASE DO NOT REMOVE /</code></pre>
<p>Then it modifies <code>node_extensions.cc</code> in order to find our addons even if they don't start with <code>node_</code>.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>node_extensions_h_file</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>full path to <code>node_extensions.h</code></p></td>
</tr>
<tr>
<td class="name"><code>node_extensions_cc_file</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>full path to <code>node_extensions.cc</code></p></td>
</tr>
<tr>
<td class="name"><code>extensions</code></td>
<td class="type">
<span class="param-type">Array.&lt;string></span>
</td>
<td class="description last"><p>the  extensions to insert</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when injection is completed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/nad/blob/master/inject-node_extensions.js">inject-node_extensions.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/nad/blob/master/inject-node_extensions.js#L10">lineno 10</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="nad::injectNodeGyp"><span class="type-signature"></span>nad::injectNodeGyp<span class="signature">(projectDir, nodeDir, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Injects necessary adjustments into <code>node.gyp</code> in order to include files of the addon found inside <code>binding.gyp</code>
in the node build.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>projectDir</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>full path to the directory of the addon project (where the <code>binding.gyp</code> file lives)</p></td>
</tr>
<tr>
<td class="name"><code>nodeDir</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>full path to the directory at which the node source code is located (alongside <code>node.gyp</code>)</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>invoked when finished</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/nad/blob/master/inject-node_gyp.js">inject-node_gyp.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/nad/blob/master/inject-node_gyp.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
