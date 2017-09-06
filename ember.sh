#!/bin/bash
# This bash file is used to run all our ember commands. This is a wrapper for developers to use
#
# @author Michael Barnard <mcihael.barnard@a24group.com>
# @since  16 August 2017

# Variables
proxyUrl=http://localhost
processPIDFile=./proccess.pid

function onExit() {
    cd testPrep
    if [ -f "${processPIDFile}" ]; then
        pid=`cat ${processPIDFile}`
        echo "Killing Server with pid $pid"
        pkill -F ${processPIDFile}
        rm ${processPIDFile}
        echo "Killed"
    fi
    cd ..
}

### Functions
function start_serve() {
    cd testPrep
    echo "Starting server..."
    nohup node htmlFileSaver.js > server.log 2>&1 & echo $! > ${processPIDFile}
    pid=`cat ${processPIDFile}`
    echo "Server running with pid $pid..."
    echo "Outputting to server.log"
    cd ..
}
function template_prepare() {
    cd testPrep
    echo "Template Prepare..."
    node templatePrepare.js
    echo "Done with Template Prepare..."
    cd ..
}

# Run Ember Tests with optional filter
function testEmber() {

    echo "==============================="
    echo "Running tests"
    echo "==============================="
    if [ -n "$1" ]; then
        echo "...Filter: '$1'"
        template_prepare
        node_modules/.bin/ember test --filter="$1"
    else
        echo "...No Filter"
        template_prepare
        node_modules/.bin/ember test
    fi
}

# Serve Ember Tests with optional filter
function testServeEmber() {

    echo "==============================="
    echo "Serving tests"
    echo "==============================="
    if [ -d "./testsTemplates/htmlDiff" ]; then
        rm -r ./testsTemplates/htmlDiff
    fi
    start_serve
    trap onExit EXIT
    if [ -n "$1" ]; then
        echo "...Filter: '$1'"
        template_prepare
        node_modules/.bin/ember test --serve --filter="$1"
    else
        echo "...No Filter"
        template_prepare
        node_modules/.bin/ember test --serve
    fi
}

function noSuchMethod() {
    echo "==============================="
    echo "Operation '$1' is not supported"
    echo "Usage: test test-serve"
    echo "==============================="
}

### Main Logic
#
# The bash below will check if the $1 is an allowed key.
# It will then run the function for that key
# If the key is not available it will run the noSuchMethod function
#
case "$1" in
    'test')
        testEmber "$2"
    ;;
    'test-serve')
        testServeEmber "$2"
    ;;
    *)
        noSuchMethod "$1"
    ;;
esac
