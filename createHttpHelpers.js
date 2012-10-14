/*
 * createHttpHelpers.js: Helper for creating http helpers for workers in IDE
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var events = require( 'eventemitter2' ),
    httpResponseHelper = require( './httpResponseHelper' ),
    logHttpRequest = require( './logHttpRequest' ),
    logHttpResponse = require( './logHttpResponse' ),
    writeTo = require( './writeTo' );

//
// ### function createHttpHelpers ( wrapper, requestListeners, responseCache )
// #### @wrapper {object} the worker wrapper to create helpers for
// #### @requestListeners {object} map of request listeners registered for 
//        this worker
// #### @responseCache {object} map of cached responses for observability
// Creates http helpers object that is initialized to the specific worker.
//
var createHttpHelpers = function createHttpHelpers ( wrapper, requestListeners,
   responseCache ) {

  var httpHelper = {};

  var constructRequestWithBody = function constructRequestWithBody ( method ) {

    return function ( subdomain, path, body, options ) {

      var requestListener = requestListeners[ subdomain ];

      if ( ! requestListener ) { return wrapper; } // nothing to do

      options = options || {};
      options.method = options.method || method;

      var requestAndResponse = constructReqRes( requestListener, responseCache,
         subdomain, path, body, wrapper, options );

      // post, emit data events with body, then end the request
      if ( body ) {

        if ( typeof( body ) == "object" ) {
          body = JSON.stringify( body );
        }

        var encoding = requestAndResponse.request._encoding();
        if ( ! encoding ) {

          requestAndResponse.request.emit( "data", 
             new Buffer( body.toString() ) );

        } else if ( encoding == "utf8" ) {
          requestAndResponse.request.emit( "data", body.toString() );
        } else if ( encoding == "binary" ) {

          requestAndResponse.request.emit( "data", 
             new Buffer( body.toString(), "binary" ) );

        } // else if ( encoding == "binary" )

      } // if ( body )

      requestAndResponse.request.emit( "end" );

      return wrapper;

    }; // function ( subdomain, path, boyd, options )

  }; // constructRequestWithBody

  var constructRequestWithNoBody = 
     function constructRequestWithNoBody ( method ) {

    return function ( subdomain, path, options ) {

      var requestListener = requestListeners[ subdomain ];

      if ( ! requestListener ) { return wrapper; } // nothing to do

      options = options || {};
      options.method = options.method || method;

      var requestAndResponse = constructReqRes( requestListener, responseCache,
         subdomain, path, null, wrapper, options );

      // get, just end the request
      requestAndResponse.request.emit( 'end' );

      return wrapper;

    }; // function ( subdomain, path, options )

  }; // constructRequestWithNoBody

  httpHelper.get = constructRequestWithNoBody( "GET" );
  httpHelper.options = constructRequestWithNoBody( "OPTIONS" );
  httpHelper.post = constructRequestWithBody( "POST" );
  httpHelper.put = constructRequestWithBody( "PUT" );

  return httpHelper;

}; // createHttpHelpers

module.exports = createHttpHelpers;

//
// ### function constructReqRes ( requestListener, responseCache, subdomain,
//     path, body, wrapper, options ) 
// #### @requestListener {function} the request listener to call when executing
// #### @responseCache {object} the cache to place response helper in
// #### @subdomain {string} the subdomain of the request
// #### @path {string} the path of the request
// #### @body {any} the body to send with the request
// #### @wrapper {object} the wrapper for the worker to send this request to
// #### @options {object} request options like headers, trailers, and method
// Constructs the request response pair and hooks them together with the worker
// that will respond to the request for monitoring and observability.
//
var constructReqRes = function constructReqRes ( requestListener, responseCache,
   subdomain, path, body, wrapper, options ) {

  responseCache[ subdomain ] = responseCache[ subdomain ] || {};
  responseCache[ subdomain ][ path ] = responseCache[ subdomain ][ path ] || [];

  options = options || {};

  var request = new ( events.EventEmitter2 );
  var requestEncoding = null;

  request.method = options.method || "GET";
  request.url = path || "/";

  // lowercase all the headers
  var headers = options.headers || {};
  var lowercaseHeaders = {};

  Object.keys( headers ).forEach( function ( header ) {

    if ( ! header ) { return; } // if for some reason no header, return
    lowercaseHeaders[ header.toLowerCase() ] = headers[ header ];

  }); // Object.keys( headers ).forEach

  request.headers = lowercaseHeaders;

  request.trailers = options.trailers || {};
  request.httpVersion = options.httpVersion || '1.1';

  request.setEncoding = function setEncoding ( encoding ) {
    requestEncoding = encoding;
  };

  // private for emulation only
  request._encoding = function _encoding () {
    return requestEncoding;
  };

  var response = new ( events.EventEmitter2 );

  // creating a new responseObj here instead of attaching properties to
  // response so that we emulate correct behavior instead of allowing things
  // like response.body = 'blah' to happen
  var responseObj = {};
  responseObj.body = null;
  responseObj.headers = {};
  responseObj.reasonPhrase = null;
  responseObj.statusCode = null;
  responseObj.trailers = {};

  response.writeContinue = function writeContinue() {
    responseObj.statusCode = 100;
  };

  response.writeHead = 
     function writeHead ( statusCode, reasonPhrase, headers ) {

    if ( typeof( reasonPhrase ) == 'object' ) {
      headers = reasonPhrase;
      reasonPhrase = null;
    }

    responseObj.statusCode = statusCode;
    responseObj.reasonPhrase = reasonPhrase;
    responseObj.headers = headers;

  }; // writeHead

  response.setHeader = function setHeader ( name, value ) {
    responseObj.headers[ name ] = value;
  };

  response.getHeader = function getHeader ( name ) {
    return responseObj.headers[ name ];
  };

  response.removeHeader = function removeHeader ( name ) {
    delete responseObj.headers[ name ];
  };

  response.write = function write ( chunk, encoding ) {    
    responseObj.body = writeTo( responseObj.body, chunk, encoding );
  };

  response.addTrailers = function addTrailers ( headers ) {
    responseObj.trailers = headers;
  };

  response.end = function end ( data, encoding ) {

    responseObj.body = writeTo( responseObj.body, data, encoding );

    logHttpResponse( wrapper.workerName, responseObj );

    // create http response helper
    var helper = httpResponseHelper( wrapper, responseObj );

    responseCache[ subdomain ][ path ].push( helper );

    // after we finalized response, we can't mess with it anymore
    // we reinitialize responseObj to cut it off the one already stored in 
    // responseCache, and we dummy up the end function so that we won't store
    // multiples
    responseObj = {};
    response.end = function dummyEnd () {};

  }; // end

  var logBody = options.bodyIsBinary ? "<binary data>" : body;

  logHttpRequest( wrapper.workerName, request.method, path, options.headers, 
     logBody );

  // execute the request emulation
  requestListener( request, response );

  return {
    request : request,
    response : response
  };

}; // constructReqRes