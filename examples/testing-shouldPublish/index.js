/*
 * index.js : demo of shouldPublish test helper
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

crosstalk.on( 'test.shouldPublish', function () {
  crosstalk.publish( 'some.message' );
});