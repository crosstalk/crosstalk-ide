/*
 * index.js : demo of version test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var env = require( 'env' );

crosstalk.on( "test.version", function () {
  crosstalk.emit( env.version );
});