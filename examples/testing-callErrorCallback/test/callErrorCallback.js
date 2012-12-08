/*
 * callErrorCallback.js: demo of callErrorCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of callErrorCallback test helper" );

var worker;

ide.comment( "on test.callErrorCallback should emit a message, which expects a" +
  " callback; this callback in turn, when responded to with error, should " +
  "emit some.message" );

worker = ide.run( workerPath );
worker.send( "test.callErrorCallback" );
worker
  .shouldEmit( "with.callback" )
  .callCallback( "with.callback", true /*error*/, undefined /*response*/ )
  .shouldEmit( "some.message" );