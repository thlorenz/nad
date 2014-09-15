#!/usr/bin/env bash

CWD=`pwd`

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
NAD_BIN_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

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

  echo -e "${color}$c${nc} \e[0;35mnad\e[0m $s"
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

main() {

  local cmd="$1"
  shift
  case $cmd in
    init | configure | install | fetch | clean |  \
    build | restore | info | open | fix | help )
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

ensure_binding_gyp() {
  if [ ! -f $CWD/binding.gyp ]; then
    log error "This doesn't seem to be a nad project, couldn't find binding.gyp in current directory."
    exit 1
  fi
}

ensure_nadconfig_mk() {
  if [ ! -f $config_mk ]; then
    log info "Couldn't find $config_mk, creating default"
    log info "Run 'nad configure' to override these settings"
    nad_configure
  fi
}

nad_make() {
  NAD_BIN_DIR=$NAD_BIN_DIR CWD=$CWD make -C $NAD_BIN_DIR $1
}

nad_configure() {
  ensure_binding_gyp
  node $NAD_BIN_DIR/nad-configure.js "$@"
}

nad_init() {
  node $NAD_BIN_DIR/nad-init.js $CWD "$@"
}

nad_fetch() {
  ensure_binding_gyp
  ensure_nadconfig_mk
  log info "Fetching Node.js source"
  nad_make fetch
}

nad_install() {
  ensure_binding_gyp
  ensure_nadconfig_mk
  log info "Fetching Node.js source, then configuring and building it"
  nad_make node
}

nad_build() {
  ensure_binding_gyp
  ensure_nadconfig_mk
  log info "Injecting code into Node.js source, then rebuilding it"
  nad_make build
}

nad_fix() {
  ensure_binding_gyp
  ensure_nadconfig_mk
  log info "Adding missing file to Xcode project"
  NAD_BIN_DIR=$NAD_BIN_DIR CWD=$CWD HOME=$HOME NODE_PROJECT_HASH=$1 \
    make -C $NAD_BIN_DIR fix_xcode 
}

nad_restore() {
  ensure_binding_gyp
  ensure_nadconfig_mk
  nad_make restore
}

nad_open() {
  ensure_binding_gyp
  ensure_nadconfig_mk
  log info "Opening Node.js Xcode project"
  nad_make open
}

nad_info() {
  nad_make info
}

nad_help() {
  log info "Usage"
  cat $NAD_BIN_DIR/nad-configure-usage.txt
}

main "$@"
