#include "node-slre.h"
#include "slre.h"

#include <nan.h>

#define MAX_SLRE_CAPS 250

NAN_METHOD(node_slre_match) {
  NanScope();

  NanUtf8String regex = NanUtf8String(args[0]);
  NanUtf8String s = NanUtf8String(args[1]);
  v8::Local<v8::Integer> ncaps_handle = args[2].As<v8::Integer>();
  v8::Local<v8::Integer> flags = args[3].As<v8::Integer>();
  NanCallback *cb = new NanCallback(args[4].As<v8::Function>());
 
  const int ncaps = ncaps_handle->Int32Value();
  struct slre_cap caps[ncaps];
  slre_match(*regex, *s, s.Size(), caps, ncaps, flags->Int32Value());

  fprintf(stderr, "regex: [%s], s: [%s]\n", *regex, *s);

  fprintf(stderr, "Method: [%.*s], URI: [%.*s]\n",
  caps[0].len, caps[0].ptr, caps[1].len, caps[1].ptr);

  v8::Local<v8::Value> argv[MAX_SLRE_CAPS];

  // USER needs to supply number of expected captures
  int i = 0;
  for (int i = 0; i < ncaps; i++) {
    argv[i] = NanNew(caps[i].ptr);
   }
 
  cb->Call(ncaps, argv);
  NanReturnUndefined();
}

void init_node_srle(v8::Handle<v8::Object> exports) {
  exports->Set(
      NanNew<v8::String>("slre_match"),
      NanNew<v8::FunctionTemplate>(node_slre_match)->GetFunction());

}

NODE_MODULE(node_srle, init_node_srle)
