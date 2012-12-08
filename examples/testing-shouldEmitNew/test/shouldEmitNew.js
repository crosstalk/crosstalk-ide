/*
 * shouldEmitNew.js: demo of shouldEmitNew test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldEmitNew test helper" );

var worker;

ide.comment( "on test.shouldEmitNew worker should emit new some.message " +
  "after emitting the first one" );

worker = ide.run( workerPath );
worker.send( "test.shouldEmitNew" );
worker
  .shouldEmit( "some.message" ) // at any point since start of worker
  .shouldEmitNew( "some.message" ); // from this moment on
  
worker.send( "test.shouldEmitNew" );