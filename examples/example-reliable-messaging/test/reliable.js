/*
 * reliable.js: demo of reliable messaging
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../index' );

ide.comment( 'demo of reliable messaging' );

var worker;

ide.comment( 'acknowledge.me should be acknowledged and not re-sent' );

worker = ide.run( workerPath );
worker.shouldEmit( 'acknowledge.me', { important : 'data' } )
  .shouldCallCallback( 'acknowledge.me', 
    { your : 'protocol for acknowledging' } )
  .shouldEmit( 'doing.important.stuff' );

ide.comment( 'dont.acknowledge.me should not be acknowledged and should be' +
  ' re-sent' );

worker.shouldEmit( 'dont.acknowledge.me' )
  .callCallback( 'dont.acknowledge.me', { timeout : true } )
  .shouldEmit( 'dont.acknowledge.me' )
  .callCallback( 'dont.acknowledge.me', { timeout : true } )
  .shouldEmit( 'dont.acknowledge.me' )