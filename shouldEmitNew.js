/*
 * shouldEmitNew.js:
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var createWorldPath = require( './createWorldPath' ),
    matchesHistoricalEvent = require( './matchesHistoricalEvent' );

//
// ### function shouldEmitNewConstructor ( wrapper )
// #### @wrapper {object} the worker wrapper to construct assertion for
// Constructs the shouldEmitNew helper assertion for the wrapper specified. This
// means that we expect a new event "from now on" instead of since start
// of history.
//
var shouldEmitNewConstructor = function shouldEmitNewConstructor ( wrapper ) {

  var history = wrapper.history;

  var shouldEmitNew = function shouldEmitNew ( message, params, scope, callback ) {

    var markedOutLength = history._out.length;

    var eventToMatch = {
      message : message,
      params : params,
      scope : scope,
      callback : callback
    };

    // 1. check history since markedOutLength if this already happened
    if ( matchesHistoricalEvent( history._out.slice( markedOutLength ), 
       eventToMatch ) ) {
      return wrapper;
    }

    // 2. hasn't happened yet so attach an event listener that will trigger 
    //   this world path
    return createWorldPath( wrapper, eventToMatch, 
       markedOutLength );

  }; // shouldEmitNew

  return shouldEmitNew;

}; // shouldEmitNewConstructor

module.exports = shouldEmitNewConstructor;