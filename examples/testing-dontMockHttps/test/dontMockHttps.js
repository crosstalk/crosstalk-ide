/*
 * dontMockHttps.js: demo of dontMockHttps test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of dontMockHttps test helper" );

var worker;

ide.comment( "if worker has dontMockHttps = true, don't mock https" );

worker = ide.run( workerPath );
worker.dontMockHttps = true;
worker.send( "test.dontMockHttps" );