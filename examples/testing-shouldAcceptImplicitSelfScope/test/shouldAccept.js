/*
 * shouldAccept.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../index' );

ide.comment( 'worker should implicitly accept messages from self in IDE' );

var worker = ide.run( workerPath );
worker.shouldEmit( 'accept', { some : 'data' } )
  .shouldEmit( 'accepted' );