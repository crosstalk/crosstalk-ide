/*
 * shouldCallCallback.js: demo of shouldCallCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldCallCallback test helper" );

var worker;

ide.comment( "on test.shouldCallCallback worker should call callback " +
  "with no error" );

worker = ide.run( workerPath );
worker.send( "test.shouldCallCallback", null /*data*/, null /*scope*/, 
   true /*callback*/ );
worker.shouldCallCallback( "test.shouldCallCallback" );