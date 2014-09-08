# CWD set by nad.sh
include $(CWD)/.nadconfig.mk

NODE_URL=https://github.com/joyent/node/archive/v$(TARGET).tar.gz

ROOT 		 := $(CWD)/
NODEDIR  := $(CWD)/$(NODEDIR)/
NODE_EXE = $(NODEDIR)/out/Debug/node_g

uname_S=$(shell uname -s)

CPUS ?= 1
ifeq (Darwin, $(uname_S))
	CPUS=$(shell sysctl hw.availcpu | sed -e 's/hw.availcpu = //')
endif

ifeq (Linux, $(uname_S))
	CPUS=$(shell lscpu -p | egrep -v '^#' | wc -l)
endif

info: 
	@echo CURDIR $(CURDIR)
	@echo NODE_URL $(NODE_URL)
	@echo TARGET $(TARGET)

$(NODEDIR): 
	(cd $(ROOT) && curl -L $(NODE_URL) | tar xvf -)

node_configure: $(NODEDIR)
	cd $(NODEDIR) && \
	./configure --debug --xcode --without-snapshot

$(NODE_EXE): node_configure
	cd $(NODEDIR) && \
	CC=$(CC) CXX=$(CXX) $(MAKE) -j$(CPUS) out/Makefile node_g 

node: $(NODE_EXE)

rebuild:
	rm -rf $(NODE_EXE) && $(MAKE) node

clean_node:
	(cd  $(NODEDIR) && $(MAKE) clean)

fetch: $(NODEDIR)


open:
	@open $(NODEDIR)/node.xcodeproj

## Node.js < 0.11
restore:
	@cp $(NODEDIR)node.gyp.orig $(NODEDIR)node.gyp && \
	 cp $(NODEDIR)src/node_extensions.h.orig $(NODEDIR)src/node_extensions.h && \
	 cp $(NODEDIR)src/node_extensions.cc.orig $(NODEDIR)src/node_extensions.cc

$(NODEDIR)node.gyp.orig:
	cp $(NODEDIR)/node.gyp $(NODEDIR)/node.gyp.orig

$(NODEDIR)src/node_extensions.h.orig:
	cp $(NODEDIR)/src/node_extensions.h $(NODEDIR)/src/node_extensions.h.orig

$(NODEDIR)src/node_extensions.cc.orig:
	cp $(NODEDIR)/src/node_extensions.cc $(NODEDIR)/src/node_extensions.cc.orig

# We want to always build node by itself first before injecting anything
# Before we inject anything we force a copy of the original node.gyp and
# node_extensions.h in order to be able to restore them later
# (NAD_BIN_DIR set by nad.sh)
build: node $(NODEDIR)node.gyp.orig $(NODEDIR)src/node_extensions.h.orig $(NODEDIR)src/node_extensions.cc.orig
	node $(NAD_BIN_DIR)/nad-inject.js $(CWD) $(NODEDIR)  && \
	rm -f $(NODE_EXE) &&                                 \
	$(MAKE) $(NODE_EXE) 

## end Node.js < 0.11

.PHONY: node fetch info clean_node 
