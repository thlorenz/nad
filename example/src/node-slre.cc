#include "node-slre.h"
#include "slre.h"

#include <nan.h>


#define MAX_CAPS 500

NAN_METHOD(node_slre_match) {
  NanScope();

  NanUtf8String regex = NanUtf8String(args[0]);
  NanUtf8String s = NanUtf8String(args[1]);
  v8::Local<v8::Integer> flags = args[2].As<v8::Integer>();
  NanCallback *cb = new NanCallback(args[3].As<v8::Function>());
 // v8::Local<v8::Function> cb = args[0].As<v8::Function>();

  struct slre_cap caps[MAX_CAPS];
  slre_match(*regex, *s, s.Size(), caps, MAX_CAPS, flags->Int32Value());

  fprintf(stderr, "regex: [%s], s: [%s]\n", *regex, *s);

  fprintf(stderr, "Method: [%.*s], URI: [%.*s]\n",
  caps[0].len, caps[0].ptr, caps[1].len, caps[1].ptr);

  v8::Local<v8::Value> argv[MAX_CAPS];

  // USER needs to supply number of expected captures
  int i = 0;
  /*
  for (; i < MAX_CAPS; i++) {
    if(caps[i].ptr)
      argv[i] = NanNew(caps[i].ptr);
    else break;
  }
  */


  cb->Call(i - 1, argv);
  NanReturnUndefined();
}

void init_node_srle(v8::Handle<v8::Object> exports) {
  exports->Set(
      NanNew<v8::String>("slre_match"),
      NanNew<v8::FunctionTemplate>(node_slre_match)->GetFunction());

}

NODE_MODULE(node_srle, init_node_srle)
