/*
 * shouldEmit.js: Helper for asserting that the worker should emit an event
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var createWorldPath = require( './createWorldPath' ),
    matchesHistoricalEvent = require( './matchesHistoricalEvent' );

//
// ### function shouldEmitConstructor ( wrapper, options )
// #### @wrapper {object} the worker wrapper to construct assertion for
// #### @options {object} used for message prefix and postfix to simplify code
//      when testing for response and error callbacks
// Constructs the shouldEmit helper assertion for the wrapper specified
//
var shouldEmitConstructor = function shouldEmitConstructor ( wrapper, options ) {

  var history = wrapper.history,
      options = options || {};

  var messagePrefix = options.messagePrefix || null;
  var messagePostfix = options.messagePostfix || null;

  var shouldEmit = function shouldEmit ( workerReference, message, params, 
     scope, callback ) {

    // workerReference is optional
    if ( typeof( workerReference ) != 'object' ) {

      callback = scope;
      scope = params;
      params = message;
      message = workerReference;
      workerReference = null;

    } // if ( typeof( workerReference ) != 'object' )

    var _message = message;

    if ( messagePrefix ) {
      _message = messagePrefix + '.' + _message;
    }

    if ( messagePostfix ) {
      _message = _message + '.' + messagePostfix;
    }

    var eventToMatch = {
      message : _message,
      params : params,
      scope : scope,
      callback : callback
    };

    if ( workerReference ) eventToMatch.workerReference = workerReference;

    // 1. check history to see if this already happened
    if ( matchesHistoricalEvent( history._out, eventToMatch ) ) {
      return wrapper;
    }

    // 2. hasn't happened yet so attach an event listener that will trigger 
    //   this world path
    return createWorldPath( wrapper, eventToMatch );

  }; // shouldEmit

  return shouldEmit;

}; // shouldEmitConstructor

module.exports = shouldEmitConstructor;