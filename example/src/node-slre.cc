#include "node-slre.h"

// include before NAN to have NODE_MODULE_VERSION defined
#include <node.h>
#include <nan.h>

NAN_METHOD(node_slre_match) {
  NanScope();
  
  NanReturnValue(NanNew<v8::String>("world"));
}

void init_node_srle(v8::Handle<v8::Object> exports) {
  exports->Set(
      NanNew<v8::String>("slre_match"),
      NanNew<v8::FunctionTemplate>(node_slre_match)->GetFunction());

}

NODE_MODULE(node_srle, init_node_srle)