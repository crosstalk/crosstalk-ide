/*
 * shouldNotEmit.js: demo of shouldNotEmit test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldNotEmit test helper" );

var worker;

ide.comment( "on test.shouldNotEmit worker should not emit other.message" );

worker = ide.run( workerPath );
worker.send( "test.shouldNotEmit" );
worker
  .shouldNotEmit( "other.message" )
  .shouldEmit( "some.message" );