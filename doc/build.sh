#!/bin/bash

set -e

trap abort SIGINT SIGTERM
abort() {
    echo 'Quitting...'
}

debug() {
    echo "=== $1"
}

run() {
    echo ''
    echo "*** Running: $@"
    "$@" # 1>/dev/null
    echo "*** Finished: $@"
    echo ''
}

HERE=$(dirname ${BASH_SOURCE[0]})

cd $HERE
CWD=$(pwd)

ROOT=$(dirname ${CWD})

MAKE=$(which make)
NPM=$(which npm)
SED=$(which gsed || which sed)

debug 'Start fresh'
run rm -rf ${ROOT}/doc/{_build,backend}
mkdir -p ${ROOT}/logs

debug 'Building frontend docs'
cd ${ROOT}/frontend
run $NPM run docs

source ${ROOT}/venv/bin/activate

cd ${ROOT}/doc

debug 'Generate API docs'
run sphinx-apidoc -fMo backend ../backend
$SED -i 's#\(.. toctree::\)#.. include:: ../backend.rst\n\n\1#' backend/modules.rst

debug 'Building backend docs'
run $MAKE html

deactivate
