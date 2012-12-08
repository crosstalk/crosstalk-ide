/*
 * index.js : demo of shouldNotEmit test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.shouldNotEmit", function () {
  crosstalk.emit( "some.message" );
});