djtodo - task management tool
=============================

A web based task management tool developed in django_ and angular_.

Requirements
============

This code is developed in UNIX like environment and uses python and node.js. It
is developed and tested in Ubuntu 18.04 but should work on any linux and macOS
given the following requirements are met.

1. Python 3.6+
2. node.js 8+

It is not tested in Windows.

Development setup
=================

Follow the steps below to setup the development environment on Ubuntu 18.04.
Replace ubuntu package manager commands with your OS commands.

First of all, make sure python3.6+ and node.js is installed.

.. code::

    $ sudo apt install python3 python3-pip python3-venv
    $ python3 --version     # must be >3.6

    $ sudo apt install nodejs npm
    $ nodejs -v             # must be >8
    $ sudo npm install -g npm  # upgrade npm
    $ suod npm install -g npx

Grab the code from github

.. code::

    $ git clone https://github.com/nsmgr8/djtodo.git
    $ cd djtodo

Create a python virtualenv and prepare it for the dev.

.. code::

    $ python3 -mvenv venv
    $ source venv/bin/activate
    $ pip install -r requirements.txt

Create and setup the django db

.. code::

    $ ./backend/manage.py migrate
    $ ./backend/manage.py createsuperuser # use creds: admin password

Install all frontend requirements

.. code::

    $ pushd frontend
    $ npm install
    $ popd

Development servers
===================

Now it is time to run the servers. There are two dev servers available for ease
of development. The backend and frontend are independent of each other.

The backend development server can be run as following (make sure you are in
the python virtualenv):

.. code::

    $ source ./venv/bin/activate
    $ ./backend/manage.py runserver

This will start a django dev server at localhost:8000.

The frontend development server is a webpack devserver which can be started as
following:

.. code::

    $ cd frontend
    $ npm start -- -o

This will start the webpack server at localhost:4200 compiling the angular
source code. It will also open the index page at http://localhost:4200/ in the
default browser.

This is auto-refreshed server. That is, it will watch the frontend source files
for change and auto-refresh the browser.

Running tests
=============

There are two types of automated tests available in this project. A django test
runner and a cypress end-to-end test runner.

To run the django test, follow the commands below:

.. code::

    $ source ./venv/bin/activate
    $ cd backend
    $ ./manage.py test

To run the e2e test run the following:

.. code::

    $ source ./venv/bin/activate
    $ cd backend
    $ gunicorn backend.wsgi &

    $ cd ../frontend
    $ npx cypress run

The above will run the e2e tests in headless mode. To run the e2e tests in
a browser with interaction, run the following

.. code::

    $ npx cypress open

This will open the list of all tests in cypress UI where one can select which
test to run in an embedded browser.

Documentation generation
========================

The project has source code docstring based documentation generator. The system
is built on top of sphinx_ and compodoc_. To build the documentation run the
following:

.. code::

    $ cd doc
    $ ./build.sh
    $ open build/html/index.html

This will open the documentation sites index page in your default browser.

.. _django: https://djangoproject.com
.. _angular: https://angular.io
.. _sphinx: http://sphinx-doc.org
.. _compodoc: https://compodoc.app
