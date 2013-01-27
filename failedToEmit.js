/*
 * failedToEmit.js: Assertion failure generator when event is not emitted
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    util = require( 'util' );

//
// ### function failedToEmit ( workerName, message, params, scope )
// #### @workerName {string} name of the worker
// #### @eventToMatch {object} event that wasn't emitted
// Generates an assertion failure in response to failure to emit a message.
//
var failedToEmit = function failedToEmit( workerName, eventToMatch ) {

  var message = eventToMatch.message,
      params = eventToMatch.params,
      scope = eventToMatch.scope,
      type = eventToMatch.type;

  assert.fail( null, null, workerName + " failed to " 
      + ( type == "pubsub" ? "publish" : "emit" ) + " message `" + message + "`"
      + ( params ? " " + util.inspect( params, false, null ) : "" ) 
      + ( scope ? " " + util.inspect( scope, false, null ) : "" ), "!=" );

}; // failedToEmit

module.exports = failedToEmit;