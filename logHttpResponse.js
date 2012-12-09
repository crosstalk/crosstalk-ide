/*
 * logHttpResponse.js: Helper for logging http responses
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var stdjson = require( 'stdjson' )(),
    util = require( 'util' );

//
// ### function logHttpResponse ( workerName, response )
// #### @workerName {string} name of the worker that's responding
// #### @response {object} the http response object
// Logs the http response to the stdout.
// 
var logHttpResponse = function logHttpResponse ( workerName, response ) {

  stdjson.log( "HTTP RESPONSE", {
    workerName : workerName,
    statusCode : response.statusCode,
    headers : response.headers,
    body : response.body ? response.body.toString() : "",
    trailers : response.trailers
  });

}; // logHttpResponse

module.exports = logHttpResponse;