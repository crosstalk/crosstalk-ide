/*
 * index.js: demo of features supporting object-capability security
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var logger = require( 'logger' ),
    thisWorkerReference = require( 'self' );

crosstalk.on( thisWorkerReference, 'start', function ( params ) {

  crosstalk.emit( params.reference, 'some.message', 
     { me : params.reference } );

});

crosstalk.on( thisWorkerReference, 'some.message', function ( params ) {
  logger.info( params );
});