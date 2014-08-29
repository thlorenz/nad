#include "node-slre.h"
#include <node.h>
//#include <v8.h>

v8::Handle<v8::Value> regex(const v8::Arguments& args) {
  v8::HandleScope scope;
  return scope.Close(v8::String::New("world"));
}

void init_node_srle(v8::Handle<v8::Object> exports) {
  exports->Set(
      v8::String::NewSymbol("hello"),
      v8::FunctionTemplate::New(regex)->GetFunction());

}

NODE_MODULE(node_srle, init_node_srle)