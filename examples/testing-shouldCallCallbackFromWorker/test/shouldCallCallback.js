/*
 * shouldCallCallback.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../index' );

ide.comment( 'should be able to test calling callback from worker generated' +
   ' callbacks' );

var worker = ide.run( workerPath );
worker.shouldCallCallback( 'call.me.back' )
  .shouldEmit( 'callback.really.called' );