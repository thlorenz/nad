#include "node-slre.h"
#include "slre.h"
#include <stdio.h>
#include <string.h>
#include <v8.h>
#include <unistd.h>

// Reads a file into a v8 string.
v8::Handle<v8::String> ReadFile(const char* name) {
  FILE* file = fopen(name, "rb");
  if (file == NULL) return v8::Handle<v8::String>();

  fseek(file, 0, SEEK_END);
  int size = ftell(file);
  rewind(file);

  char* chars = new char[size + 1];
  chars[size] = '\0';
  for (int i = 0; i < size;) {
    int read = static_cast<int>(fread(&chars[i], 1, size - i, file));
    i += read;
  }
  fclose(file);
  v8::Handle<v8::String> result = v8::String::New(chars, size);
  delete[] chars;
  return result;
}

void print_cwd() {
  char cwd[1024];
  getcwd(cwd, sizeof(cwd));
  fprintf(stderr, "cwd: %s\n", cwd);
}

void pure_c() {
  fprintf(stderr, "Testing Regex Function via pure C API\n");

  const char *request = " GET /index.html HTTP/1.0\r\n\r\n";
  struct slre_cap caps[4];

  if (slre_match("^\\s*(\\S+)\\s+(\\S+)\\s+HTTP/(\\d)\\.(\\d)", request, strlen(request), caps, 4, 0) > 0) {
    fprintf(stderr, "Method: [%.*s], URI: [%.*s]\n", caps[0].len, caps[0].ptr, caps[1].len, caps[1].ptr);
  } else {
    fprintf(stderr, "Error parsing [%s]\n", request);
  }
}

void js() {
  using namespace v8;
  Isolate *isolate = Isolate::GetCurrent();
  HandleScope handle_scope;
  Handle<Context> context = Context::New();
  Context::Scope context_scope(context);

  init_node_srle(context->Global());

  Handle<String> src = ReadFile("test.js");
  
  Handle<Value> result = Script::Compile(src)->Run();
  fprintf(stderr, "Script returned: [%s]\n", *String::Utf8Value(result));
}

int main(void) {
  print_cwd();
  //pure_c();
  js();
  return 0;
}
