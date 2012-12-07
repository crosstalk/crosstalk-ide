/*
 * index.js : demo of shouldBeSilentFromNowOn test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.shouldBeSilentFromNowOn", function () {
  crosstalk.emit( "some.message" );
});