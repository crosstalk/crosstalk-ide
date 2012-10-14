/*
 * logHttpRequest.js: Helper for logging http requests
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var stdjson = require( 'stdjson' )(),
    util = require( 'util' );

//
// ### function logHttpRequest ( workerName, method, path, headers, body,
//        options )
// #### @workerName {string} the name of the worker
// #### @method {string} http method
// #### @path {string} http path
// #### @headers {object} http headers
// #### @body {string|object} http request body
// #### @options {object} logging options
// Logs the http request to stdout.
//
var logHttpRequest = function logHttpRequest ( workerName, method, path, 
    headers, body, options ) {

  options = options || {}

  var protocol = options.protocol || "HTTP";
  var notice = options.outbound ? "REQUESTING" : "HANDLING";

  stdjson.log( notice + " " + protocol.toUpperCase(), {
    workerName : workerName,
    method : method,
    path : path,
    headers : headers,
    body : body
  });

}; // logHttpRequest

module.exports = logHttpRequest;