CC?=clang
CXX=clang++
LINK=clang++

NODE_VERSION ?= $(shell node -e 'console.log(process.version)')
NODE_VERSION_NUM=$(subst v,,$(NODE_VERSION))
NODE_URL=https://github.com/joyent/node/archive/$(NODE_VERSION).tar.gz

ROOT 		 		 := $(CURDIR)/
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

log: 
	@echo url $(NODE_URL)
	@echo node version num $(NODE_VERSION_NUM)

$(NODE): 
	curl -L $(NODE_URL) | tar xvf -

get_node: $(NODE)

$(NODE_EXE): $(NODE)
	cd $(NODE) &&                                     \
	./configure --debug --xcode --without-snapshot && \
	cat config.mk &&                                  \
	CC=$(CC) CXX=$(CXX) $(MAKE) -j$(CPUS) out/Makefile node_g 

rebuild:
	rm -rf $(NODE_EXE) && $(MAKE) node

clean_node:
	(cd  $(NODE) && $(MAKE) clean)

node: $(NODE_EXE)

.PHONY: node get_node clean_node
