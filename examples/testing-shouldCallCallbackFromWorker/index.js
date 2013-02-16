/*
 * index.js: regression test for worker processing self generated callbacks
 *           in the same way as the user sent callbacks
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

crosstalk.on( 'call.me.back', function ( params, callback ) {
  callback();
});

crosstalk.emit( 'call.me.back', {}, function ( error, callback ) {
  crosstalk.emit( 'callback.really.called' );
});