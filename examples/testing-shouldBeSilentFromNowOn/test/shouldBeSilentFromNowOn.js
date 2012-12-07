/*
 * shouldBeSilentFromNowOn.js: demo of shouldBeSilentFromNowOn test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldBeSilentFromNowOn test helper" );

var worker;

ide.comment( "on test.shouldBeSilentFromNowOn worker should be silent " +
  "after first emitted message" );

worker = ide.run( workerPath );
worker.send( "test.shouldBeSilentFromNowOn" );
worker
  .shouldEmit( "some.message" )
  .shouldBeSilentFromNowOn();