/*
 * index.js: demo of subscribe functionality
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

crosstalk.subscribe( 'hello', function ( params ) {
  crosstalk.emit( 'got.subscription' );
});