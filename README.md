# nad [![build status](https://secure.travis-ci.org/thlorenz/nad.png?branch=master)](http://travis-ci.org/thlorenz/nad)

Node Addon Developer, a tool to inject your addon code into a copy of the node codebase in order to integrate with IDEs and debuggers easily.

![level-sample](https://raw.githubusercontent.com/thlorenz/nad/master/assets/level-sample.png)

## Installation

    npm install nad

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

Fix it via:

```
cp node-<version>/out/Debug/obj/gen/debug-support.cc ~/Library/Developer/Xcode/DerivedData/node-xxxxx/Build/Products/DerivedSources/Debug/
```

In the future there nad will fix this automatically for you or at least provide a simple command to perform this step.

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
<p>This only works for Node.js <code>&lt; v0.11</code> since <code>node_extensions.h</code> and <code>node_extensions.cc</code>
drastically changed during <code>0.11</code> development until they completely disappeared around <code>v0.11.12</code>.</p>
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
<a href="https://github.com/thlorenz/nad/blob/master/lib/inject-node_extensions_h.js">inject-node_extensions_h.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/nad/blob/master/lib/inject-node_extensions_h.js#L10">lineno 10</a>
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
<a href="https://github.com/thlorenz/nad/blob/master/lib/inject-node_gyp.js">inject-node_gyp.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/nad/blob/master/lib/inject-node_gyp.js#L13">lineno 13</a>
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
