/* This header file just exists in order to expose the public API
 * so we can call it from our main.cc.
 * It is not used when building with node-gyp.
 */

#ifndef _NODE_SLRE_H_
#define _NODE_SLRE_H_

#include "slre.h"
#include <node.h>
#include <v8.h>

void init_node_srle(v8::Handle<v8::Object> exports);

#endif
