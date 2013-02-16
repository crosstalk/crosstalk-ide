/*
 * index.js : regression test ensuring that a worker should accept messages 
 *            from self implicitly when emitting a message and providing a 
 *            callback
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

crosstalk.on( 'accept', function ( params, callback ) {
  crosstalk.emit( 'accepted' );
});

crosstalk.emit( 'accept', { some : 'data' }, function ( error, callback ) {} );