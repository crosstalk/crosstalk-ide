/*
 * index.js : demo of shouldEmit test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.shouldEmit", function () {
  crosstalk.emit( "some.message" );
});