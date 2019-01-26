#!/bin/bash

trap abort INT
function abort() {
    echo 'quitting...'
    exit 1
}

[[ $(id -u) = 0 ]] && echo 'Cannot run as root' && exit 1
[[ $VIRTUAL_ENV != "" ]] && echo 'Cannot run in a virtualenv' && exit 1

ROOT=/opt/djtodo
HERE=${ROOT}/deploy
VENV_ROOT=${ROOT}/venv
BACKEND_ROOT=${ROOT}/backend
FRONTEND_ROOT=${ROOT}/frontend


function log() {
    echo "===" $1
}

function system-deps() {
    log "Installing nginx"
    sudo apt install -y nginx-full

    log "Installing python 3"
    sudo apt install -y python3 python3-venv python3-pip

    log "Install nodejs"
    sudo apt install -y nodejs npm
    log "Upgrading npm"
    sudo npm install -g npm
}

function py-deps() {
    log "Using virtualenv ${VENV_ROOT}"
    python3.6 -mvenv ${VENV_ROOT}

    log "Installing python packages"
    ${VENV_ROOT}/bin/python3 -mpip install -r ${ROOT}/requirements.txt
}

function web-start() {
    log "Starting web service"
    install-service
    configure-nginx
    log "Web service running"
}

function install-service() {
    log "Installing systemd service"
    sudo cp ${HERE}/djtodo.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable djtodo.service
    sudo systemctl start djtodo.service || sudo systemctl restart djtodo.service
}

function configure-nginx() {
    log "Configuring nginx"
    sudo ln -sf ${HERE}/djtodo.nginx.conf /etc/nginx/sites-available/
    sudo ln -sf /etc/nginx/sites-{available,enabled}/djtodo.nginx.conf
    sudo service nginx restart
}

mkdir -p ${ROOT}/logs

system-deps
py-deps
${HERE}/djtodo.prepare
web-start
