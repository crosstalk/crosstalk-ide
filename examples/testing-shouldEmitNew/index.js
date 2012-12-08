/*
 * index.js : demo of shouldEmitNew test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.shouldEmitNew", function () {
  crosstalk.emit( "some.message" );
});