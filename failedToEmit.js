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
// #### @message {string} message that wasn't emitted
// #### @params {object} params that weren't emitted
// #### @scope {string|object} scope that wasn't emitted
// Generates an assertion failure in response to failure to emit a message.
//
var failedToEmit = function failedToEmit( workerName, message, params, scope ) {

  assert.fail( null, null, workerName + " failed to emit message `" + message + "`"
      + ( params ? " " + util.inspect( params, false, null ) : "" ) 
      + ( scope ? " " + util.inspect( scope, false, null ) : "" ), "!=" );

}; // failedToEmit

module.exports = failedToEmit;