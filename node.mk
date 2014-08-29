CC?=clang
CXX=clang++
LINK=clang++

NODE      = $(ROOT)deps/node/
NODE_EXE  = $(NODE)node
NODE_VERSION ?= $(shell node -e 'console.log(process.version)')
NODE_VERSION_NUM=$(subst v,,$(NODE_VERSION))
NODE_URL=https://github.com/joyent/node/archive/$(NODE_VERSION).tar.gz

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
	mkdir -p ./deps &&                              \
	cd ./deps && curl -L $(NODE_URL) | tar xvf - && \
	mv node-$(NODE_VERSION_NUM) node

$(NODE_EXE): $(NODE)
	cd $(NODE) &&                             \
	./configure --debug --without-snapshot && \
	CC=$(CC) CXX=$(CXX) $(MAKE) -j$(CPUS)

node: $(NODE_EXE)
