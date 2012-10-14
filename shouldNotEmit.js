/*
 * shouldNotEmit.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    matchesHistoricalEvent = require( './matchesHistoricalEvent' );

//
// ### function shouldNotEmitConstructor ( wrapper )
// #### @wrapper {object} wrapper to attach this assertion to
// Constructs a shouldNotEmit assertion and attaches it to specified wrapper.
//
var shouldNotEmitConstructor = function shouldNotEmitConstructor ( wrapper ) {

  var history = wrapper.history;

  var shouldNotEmit = function shouldNotEmit ( message ) {

    var eventToMatch = { message : message };

    // 1. check history to see if this already happened
    var matches = matchesHistoricalEvent( history._out, eventToMatch );
    if ( matches ) {
      assert.fail( null, matches, null, "==" );
    }

    // 2. hasn't happened yet
    // attach an event listener that will cause failure if triggered
    wrapper.on( message, function () {
      assert.fail( null, message, null, "==" );
    }); // wrapper.on( message )

    return wrapper;

  }; // shouldNotEmit

  return shouldNotEmit;

}; // shouldNotEmitConstructor

module.exports = shouldNotEmitConstructor;