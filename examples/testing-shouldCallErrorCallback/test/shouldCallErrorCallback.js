/*
 * shouldCallErrorCallback.js: demo of shouldCallErrorCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldCallErrorCallback test helper" );

var worker;

ide.comment( "on test.shouldCallErrorCallback worker should call callback " +
  "with error" );

worker = ide.run( workerPath );
worker.send( "test.shouldCallErrorCallback" );
worker.shouldCallErrorCallback( "test.shouldCallErrorCallback" );