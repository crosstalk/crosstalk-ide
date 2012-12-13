/*
 * scopeObject.js: demo of scopeObject
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of scopeObject" );

var worker;

ide.comment( "on test.scopeObject worker should emit ok if valid scope" );

worker = ide.run( workerPath );
worker
  .send( "test.scopeObject", {}, 'self' )
  .shouldEmit( 'ok' )
  .send( "test.scopeObject", {}, '@bob' )
  .shouldEmit( 'ok' )
  .shouldBeSilentFromNowOn()
  .send( "test.scopeObject", {}, '@eve' );

ide.comment( "adding to scope should allow messages from added account" );

worker = ide.run( workerPath );
worker
  .send( "test.scopeObject", {}, 'self' )
  .shouldEmit( 'ok' )
  .send( "test.addToScope", { addThis : { name : '@eve', value : true } } )
  .send( "test.scopeObject", {}, '@eve' )
  .shouldEmit( 'ok' );