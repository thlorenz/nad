# CWD set by nad.sh
include $(CWD)/.nadconfig.mk

NODE_VERSION_NUM=$(subst v,,$(NODE_VERSION))
NODE_URL=https://github.com/joyent/node/archive/$(NODE_VERSION).tar.gz

ROOT 		 		 := $(CWD)/
NODE      		= $(ROOT)node-$(NODE_VERSION_NUM)/
NODE_EXE  		= $(NODE)node_g

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
	@echo NODE_VERSION $(NODE_VERSION)
	@echo NODE_VERSION_NUM $(NODE_VERSION_NUM)

$(NODE): 
	(cd $(ROOT) && curl -L $(NODE_URL) | tar xvf -)

node_configure: $(NODE)
	cd $(NODE) &&                                     \
	./configure --debug --xcode --without-snapshot

$(NODE_EXE): node_configure
	cd $(NODE) && \
	CC=$(CC) CXX=$(CXX) $(MAKE) -j$(CPUS) out/Makefile node_g 

rebuild:
	rm -rf $(NODE_EXE) && $(MAKE) node

clean_node:
	(cd  $(NODE) && $(MAKE) clean)

fetch: $(NODE)

node: $(NODE_EXE)

open:
	@open $(NODE)/node.xcodeproj

## Node.js < 0.11
restore:
	@cp $(NODE)node.gyp.orig $(NODE)node.gyp && \
	 cp $(NODE)src/node_extensions.h.orig $(NODE)src/node_extensions.h && \
	 cp $(NODE)src/node_extensions.cc.orig $(NODE)src/node_extensions.cc

$(NODE)node.gyp.orig:
	cp $(NODE)/node.gyp $(NODE)/node.gyp.orig

$(NODE)src/node_extensions.h.orig:
	cp $(NODE)/src/node_extensions.h $(NODE)/src/node_extensions.h.orig

$(NODE)src/node_extensions.cc.orig:
	cp $(NODE)/src/node_extensions.cc $(NODE)/src/node_extensions.cc.orig

# We want to always build node by itself first before injecting anything
# Before we inject anything we force a copy of the original node.gyp and
# node_extensions.h in order to be able to restore them later
# (NAD_BIN_DIR set by nad.sh)
build: node $(NODE)node.gyp.orig $(NODE)src/node_extensions.h.orig $(NODE)src/node_extensions.cc.orig
	node $(NAD_BIN_DIR)/nad-inject.js $(CWD) $(NODE)  && \
	rm -f $(NODE_EXE) &&                                 \
	$(MAKE) node 

## end Node.js < 0.11

.PHONY: node fetch info clean_node 
