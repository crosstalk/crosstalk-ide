/*
 * index.js : demo of shouldCallErrorCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.shouldCallErrorCallback", function ( params, callback ) {
  callback( true );
});