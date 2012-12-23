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
// #### @request {object} http(s) request object
// #### @body {string|object} http request body
// #### @options {object} logging options
// Logs the http request to stdout.
//
var logHttpRequest = function logHttpRequest ( workerName, request, body, 
   options ) {

  options = options || {};
  request = request || {};

  var protocol = options.protocol || "HTTP";
  var notice = options.outbound ? "REQUESTING" : "HANDLING";

  stdjson.log( notice + " " + protocol.toUpperCase(), {
    workerName : workerName,
    host : request.host,
    method : request.method,
    path : request.path,
    url : request.url,
    headers : request.headers,
    body : body ? body.toString() : ""
  });

}; // logHttpRequest

module.exports = logHttpRequest;