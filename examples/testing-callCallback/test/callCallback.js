/*
 * callCallback.js: demo of callCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of callCallback test helper" );

var worker;

ide.comment( "on test.callCallback should emit a message, which expects a" +
  " callback; this callback in turn, when responded to, should emit " +
  "some.message" );

worker = ide.run( workerPath );
worker.send( "test.callCallback" );
worker
  .shouldEmit( "with.callback" )
  .callCallback( "with.callback", null /*error*/, {} /*response*/ )
  .shouldEmit( "some.message" );