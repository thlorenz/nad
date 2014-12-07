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

clean_node:
	(cd  $(NODEDIR) && $(MAKE) clean)

fetch: $(NODEDIR)

inject: $(NODEDIR)
	@node $(NAD_BIN_DIR)/nad-inject.js $(TARGET) $(CWD) $(NODEDIR)

open:
	@open $(NODEDIR)node.xcodeproj

build: node 
	@node $(NAD_BIN_DIR)/nad-inject.js $(TARGET) $(CWD) $(NODEDIR)  && \
	rm -f $(NODE_EXE) &&                                               \
	$(MAKE) $(NODE_EXE) 

rebuild:
	rm -rf $(NODE_EXE) && $(MAKE) node

restore:
	@node $(NAD_BIN_DIR)/nad-restore.js $(TARGET) $(NODEDIR)

fix_xcode:
	@cp $(NODEDIR)out/Debug/obj/gen/debug-support.cc \
		$(HOME)/Library/Developer/Xcode/DerivedData/node-$(NODE_PROJECT_HASH)/Build/Products/DerivedSources/Debug/

.PHONY: node fetch info restore clean_node fix_xcode
