/*
 * subscribe.js: demonstraction of subscribe functionality in IDE
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../index' );

ide.comment( 'demo of subscribe functionality' );

var worker;

ide.comment( 'on hello should emit got.subscription' );

worker = ide.run( workerPath );
worker.publish( 'hello' );
worker.shouldEmit( 'got.subscription' );