/*
 * workerWrapper.test.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    workerWrapper = require( '../workerWrapper' ),
    stdjson = require( 'stdjson' );

var log = stdjson();

var workerWrapperOptions = {
  config : {},
  environmentId : 0,
  silent : false,
  workerId : 0,
  workerPath : ""
};

//
// send test helper
//
var sendTest = function sendTest ( message, expected, event, data, scope, 
   callback ) {

  var wrapped = workerWrapper( workerWrapperOptions );
  var wrapper = wrapped.wrapper;

  var exitListener = function exitListener () {
    assert.fail( null, event, message + " FAILED" );
  }

  process.on( 'exit', exitListener );

  // data should be an empty object by default
  expected.data = expected.data || {};

  wrapper.on( event, function ( data, scope, callbackFunction ) {

    process.removeListener( 'exit', exitListener );

    if ( expected.data || data ) {
      assert.deepEqual( expected.data, data, message );
    }
    if ( expected.scope || scope ) {
      assert.deepEqual( expected.scope, scope, message );
    }
    expected.callback 
      ? assert( callbackFunction, message )
      : assert( ! callbackFunction, message );

    log.info( message, { status : "OK" } );

  }); // wrapper.on event

  wrapper.send( event, data, scope, callback );

}; // sendTest

sendTest( 'callback is undefined when not provided in ide', 
   {}, 'message' );

sendTest( 'callback is defined when provided in ide', { callback : true },
   'message', null, null, true );