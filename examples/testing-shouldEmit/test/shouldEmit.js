/*
 * shouldEmit.js: demo of shouldEmit test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldEmit test helper" );

var worker;

ide.comment( "on test.shouldEmit worker should emit some.message" );

worker = ide.run( workerPath );
worker.send( "test.shouldEmit" );
worker.shouldEmit( "some.message" );