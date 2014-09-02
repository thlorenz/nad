# nad [![build status](https://secure.travis-ci.org/thlorenz/nad.png?branch=master)](http://travis-ci.org/thlorenz/nad)

Node Addon Developer, a tool to inject your addon code into a copy of the node codebase in order to integrate with IDEs and debuggers easily.

```js
// TODO
```

## Installation

    npm install nad

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
<h4 class="name" id="nad::injectNodeExtensions"><span class="type-signature"></span>nad::injectNodeExtensions<span class="signature">(node_extensions_h_file, extensions, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Injects source into <code>node_extensions.h</code> file to include <code>NODE_EXT_LIST_ITEM</code> macro calls for all valid targets of the addon.</p>
<h4>Example</h4>
<p>For targets <code>[ 'node_foo', 'node_bar' ]</code> it injects following code:</p>
<pre><code>/* START nad INJECTION, PLEASE DO NOT REMOVE /
#ifdef NODE_FOO_ADDON
NODE_EXT_LIST_ITEM(node_bar)
#endif
#ifdef NODE_BAR_ADDON
NODE_EXT_LIST_ITEM(node_bar)
#endif
/* END nad INJECTION, PLEASE DO NOT REMOVE /</code></pre>
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
<a href="https://github.com/thlorenz/nad/blob/master/lib/inject-node_extensions_h.js#L9">lineno 9</a>
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
