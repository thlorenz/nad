#include <greet.h>
#include <nan.h>

NAN_METHOD(Greetme) {
  NanScope();

  NanUtf8String name = NanUtf8String(args[0]);
  const char* greeting = greet(*name);

  NanReturnValue(NanNew(greeting));
}

void init_greeter(v8::Handle<v8::Object> exports) {
  exports->Set(
      NanNew<v8::String>("greetme"),
      NanNew<v8::FunctionTemplate>(Greetme)->GetFunction());
}

NODE_MODULE(greeter, init_greeter)
