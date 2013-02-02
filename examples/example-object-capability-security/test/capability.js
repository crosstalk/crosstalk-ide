/*
 * capability.js: demonstration of object capability security features in IDE
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../index' );

ide.comment( 'demo of object capability security features' );

let worker;

ide.comment( 'on some.message should emit some.message using worker references' );

worker = ide.run( workerPath );
worker.emit( worker.reference, 'start', { reference : worker.reference } );
worker.shouldEmit( worker.reference, 'some.message', 
  {
    me : worker.reference
  });