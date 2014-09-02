#!/usr/bin/env bash

CWD=`pwd`
NAD_BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
config_mk=$CWD/.nadconfig.mk 

function log() {
  local c=$1
  local s=$2

  nc='\e[0m'

  case $c in
    verb) color='\e[0;34m' ;;
    info) color='\e[0;32m' ;;
    err)  color='\e[0;31m' ;;
    warn) color='\e[1;33m' ;;
  esac

  echo -e "nad ${color}$c${nc} $s"
}

if [ -z "$BASH" ]; then
  cat >&2 <<EOF
nad is a bash program, and must be run with bash.
EOF
  exit 1
fi

shell=`basename "$SHELL"`
case "$shell" in
  bash) ;;
  zsh) ;;
  *)
    echo "nad only supports zsh and bash shells." >&2
    exit 1
    ;;
esac

write_default_config() {
  if [ -z "$NODE_VERSION" ]; then
    NODE_VERSION=`node -e 'console.log(process.version)'`
  fi
  echo "NODE_VERSION?=$NODE_VERSION
CC?=clang
CXX?=clang++
LINK?=clang++" > $config_mk
}

main() {

  if [ -f $config_mk ]; then
    log info "Using the following settings ('nad configure' can override them)"
    cat $config_mk 
  else
    log info "Couldn't find $config_mk, creating default"
    log info "Run 'nad configure' to override these settings"
    write_default_config
  fi

  local cmd="$1"
  shift
  case $cmd in
    install | fetch | clean | build | restore | info | open | help )
      cmd="nad_$cmd"
      ;;
    * )
      cmd="nad_help"
      ;;
  esac
  $cmd "$@"
  local ret=$?
  if [ $ret -eq 0 ]; then
    exit 0
  else
    echo "failed with code=$ret" >&2
    exit $ret
  fi
}

nad_make() {
  NAD_BIN_DIR=$NAD_BIN_DIR CWD=$CWD make -C $NAD_BIN_DIR $1
}

nad_fetch() {
  log info "Fetching Node.js source"
  nad_make fetch
}

nad_install() {
  log info "Fetching Node.js source, then configuring and building it"
  nad_make node
}

nad_build() {
  log info "Injecting code into Node.js source, then rebuilding it"
  nad_make build
}

nad_restore() {
  log info "Restoring Node.js source to its original state by removing any injections"
  nad_make restore
}

nad_open() {
  log info "Opening Node.js Xcode project"
  nad_make open
}

nad_info() {
  nad_make info
}

nad_help() {
  log info "Usage"
}

main "$@"
