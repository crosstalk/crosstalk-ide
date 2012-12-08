/*
 * index.js : demo of callErrorCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.callErrorCallback", function () {
  crosstalk.emit( "with.callback", {}, null, function ( error, response ) {
    if ( error ) crosstalk.emit( "some.message" );
  });
});