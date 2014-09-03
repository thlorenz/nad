#include <stdio.h>
#include "greet.h"

/* buf is global here to keep this example simple */
char buf[255];

const char* greet(const char* name) {
  snprintf(buf, sizeof(buf), "hello %s", name);
  return buf;
}
