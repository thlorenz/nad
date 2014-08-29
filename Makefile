include node.mk

ROOT = $(dir $(lastword $(MAKEFILE_LIST)))

AR ?= ar

CFLAGS = -I$(V8)include/
NODE_DEBUG=$(NODE)out/Debug/

LDFLAGS =                             \
	-Wl,--start-group                   \
			$(NODE_DEBUG)libv8_base.a       \
			$(NODE_DEBUG)libv8_nosnapshot.a \
	-Wl,--end-group                     \
	$(NODE_DEBUG)libcares.a             \
	$(NODE_DEBUG)libchrome_zlib.a       \
	$(NODE_DEBUG)libhttp_parser.a       \
	$(NODE_DEBUG)libopenssl.a           \
	$(NODE_DEBUG)libuv.a                \
	-lpthread                           \
	-lrt 

clean:
	find . -name "*.gc*" -exec rm {} \;
	rm -rf `find . -name "*.dSYM" -print`
	rm -f *.o

.PHONY: clean 
