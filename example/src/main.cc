#include "node-slre.h"
#include "slre.h"
#include <stdio.h>
#include <string.h>

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

int main(void) {
  pure_c();
  return 0;
}
