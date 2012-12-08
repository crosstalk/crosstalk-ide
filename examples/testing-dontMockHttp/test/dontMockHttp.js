/*
 * dontMockHttp.js: demo of dontMockHttp test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of dontMockHttp test helper" );

var worker;

ide.comment( "if worker has dontMockHttp = true, don't mock http" );

worker = ide.run( workerPath );
worker.dontMockHttp = true;
worker.send( "test.dontMockHttp" );