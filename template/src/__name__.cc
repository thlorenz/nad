#include <nan.h>

using namespace v8;

NAN_METHOD({{ Name }}) {
  NanScope();

  NanReturnValue(NanNew("{{ name }} says hello"));
}

void init_{{ name }}(v8::Handle<v8::Object> exports) {
  NODE_SET_METHOD(exports, "{{ name }}", {{ Name }});
}

NODE_MODULE({{ name }}, init_{{ name }})
