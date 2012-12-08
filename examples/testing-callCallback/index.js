/*
 * index.js : demo of callCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.callCallback", function () {
  crosstalk.emit( "with.callback", {}, null, function ( error, response ) {
    if ( ! error ) crosstalk.emit( "some.message" );
  });
});