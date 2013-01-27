/*
 * shouldPublish.js: demo of shouldPublish test helper
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../index' );

ide.comment( 'demo of shouldPublish test helper' );

var worker;

ide.comment( 'on test.shouldPublish worker should publish some.message' );

worker = ide.run( workerPath );
worker.send( 'test.shouldPublish' );
worker.shouldPublish( 'some.message' );