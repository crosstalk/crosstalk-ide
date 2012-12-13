/*
 * version.js: demo of version test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of version mocking" );

var worker;

ide.comment( "on test.version worker should emit mocked version" );

worker = ide.run( workerPath );
worker.env.version = "0.7.2";
worker.send( "test.version" );
worker
  .shouldEmit( "0.7.2" );