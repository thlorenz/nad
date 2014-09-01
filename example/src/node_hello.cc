#include <nan.h>

using namespace v8;

NAN_METHOD(Hello) {
  NanScope();

  NanReturnValue(NanNew("world"));
}

void init_hello(v8::Handle<v8::Object> exports) {
  NODE_SET_METHOD(exports, "hello", Hello);
}

NODE_MODULE(node_hello, init_hello)
