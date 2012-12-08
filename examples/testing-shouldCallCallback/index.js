/*
 * index.js : demo of shouldCallCallback test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

crosstalk.on( "test.shouldCallCallback", function ( params, callback ) {
  callback();
});