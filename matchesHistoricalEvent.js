/*
 * matchesHistoricalEvent.js: Searches through history to find a matching event
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var clone = require( './clone' ),
    equals = require( './equals' ), // TODO
    util = require( 'util' );

//
// ### function matchesHistoricalEvent ( history, expected, backwards )
// #### @history {array} particular history to inspect for expected event
// #### @expected {object} event to check history for
// #### @backwards {bool} if true, searches backwards
// Searches the given history for the expected event. Returns the event if found.
//
var matchesHistoricalEvent = function matchesHistoricalEvent ( history, 
   expected, backwards ) {

  var i, event;

  if ( backwards ) {

    for ( i = history.length - 1; i >= 0; i-- ) {

      event = matches( history, expected, i );
      if ( event ) {
        return event;
      }

    } // for i in history.length..0

  } else {

    for ( i = 0; i < history.length; i++ ) {

      event = matches( history, expected, i );
      if ( event ) {
        return event;
      }

    } // for i in 0..history.length

  } // else

  return false;

}; // matchesHistoricalEvent

var matches = function matches ( history, expected, i ) {

  var event = history[ i ];

  if ( event.message != expected.message ) { return false; }

  var _params = event.params;

  if ( typeof( expected.params ) !== "undefined" 
     && ! equals( _params, expected.params ) ) {
    return false;
  }

  if ( typeof( expected.scope ) !== "undefined" 
     && ! equals( event.scope, expected.scope ) ) {
    return false;
  }

  if ( typeof( expected.callback ) !== "undefined" 
     && ! equals( event.callback, expected.callback ) ) {
    return false;
  }

  if ( typeof( expected.type ) !== "undefined" 
     && ! equals( event.type, expected.type ) ) {
    return false;
  }

  return event;

}; // matches

module.exports = matchesHistoricalEvent;