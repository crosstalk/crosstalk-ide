/*
 * createWorldPath.js: Creates a world path for future execution
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var executeWorldPath = require( './executeWorldPath' ),
    failedToEmit = require( './failedToEmit' ),
    matchesHistoricalEvent = require( './matchesHistoricalEvent' ),
    worldPathWrapper = require( './worldPathWrapper' );

//
// ### function createWorldPath ( wrapper, message, params, scope, callback )
// #### @wrapper {object} the worker wrapper to create world path for
// #### @eventToMatch {object} the event to match
// #### @markedOutLength {integer} optional marker for matching historical
//      event from either beginning or a specific spot
// Because shouldEmit and other assertions can be chained together, if
// the assertion hasn't happened yet, the world path is what other
// assertions will be chained to. Once this assertion passes, the follow-on
// assertions will then be tested/triggered.
//
// Additionally, since we can either chain assertions, or just set them
// on the wrapper itself, multiple world paths can be pending to be
// checked on a worker wrapper at any given time.
//
// This creates a world path for future execution.
//
var createWorldPath = function createWorldPath ( wrapper, eventToMatch, 
   markedOutLength ) {

  var worldPath = [];

  // attach to process.on( 'exit' ) in case this world path is never 
  // triggered
  var exitListener = function exitListener () {
    failedToEmit( wrapper.workerName, eventToMatch );
  };

  process.on( 'exit', exitListener );

  var listener = function () {

    // if we are here, this event was already recorded in history
    var _history;

    if ( markedOutLength ) {
      _history = wrapper.history._out.slice( markedOutLength );
    } else {
      _history = wrapper.history._out;
    }

    if ( ! matchesHistoricalEvent( _history, eventToMatch ) ) {
      return; // keep waiting if this isn't it
    }

    // event matches

    wrapper.removeListener( eventToMatch.message, listener );
    process.removeListener( 'exit', exitListener );

    // execute this world path
    var execute = executeWorldPath( worldPath );
    execute( wrapper );

  }; // listener

  wrapper.on( eventToMatch.message, listener );

  // return a world path wrapper that will wait for the listener to fire
  return worldPathWrapper( worldPath );

}; // createWorldPath

module.exports = createWorldPath;