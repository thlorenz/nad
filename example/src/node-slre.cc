#include "node-slre.h"
#include "slre.h"

// include before NAN to have NODE_MODULE_VERSION defined
#include <node.h>
#include <nan.h>

NAN_METHOD(node_slre_match) {
  NanScope();
  
  NanUtf8String regex = NanUtf8String(args[0]);
  NanUtf8String s = NanUtf8String(args[1]);
  
  v8::Local<v8::Integer> flags = args[2].As<v8::Integer>();
  
  struct slre_cap caps[4];
  slre_match(*regex, *s, s.Size(), caps, 4, flags->Int32Value());
  
  fprintf(stderr, "regex: [%s], s: [%s]\n", *regex, *s);
  
  fprintf(stderr, "Method: [%.*s], URI: [%.*s]\n",
  caps[0].len, caps[0].ptr, caps[1].len, caps[1].ptr);
  
  NanReturnValue(NanNew<v8::String>("world"));
}

void init_node_srle(v8::Handle<v8::Object> exports) {
  exports->Set(
      NanNew<v8::String>("slre_match"),
      NanNew<v8::FunctionTemplate>(node_slre_match)->GetFunction());

}

NODE_MODULE(node_srle, init_node_srle)