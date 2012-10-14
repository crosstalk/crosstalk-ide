/*
 * addTestingArtifacts.js: Adds useful testing artifacts to wrapper worker
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var createHttpHelpers = require( './createHttpHelpers' ),
    events = require( 'events' ),
    matchesHistoricalEvent = require( './matchesHistoricalEvent' ),
    shouldBeSilent = require( './shouldBeSilent' ),
    shouldBeSilentFromNowOn = require( './shouldBeSilentFromNowOn' ),
    shouldCallCallback = require( './shouldCallCallback' ),
    shouldCallErrorCallback = require( './shouldCallErrorCallback' ),
    shouldEmit = require( './shouldEmit' ),
    shouldEmitNew = require( './shouldEmitNew' ),
    shouldNotEmit = require( './shouldNotEmit' ),
    stdjson = require( 'stdjson' )();

//
// ### function addTestingArtifacts ( wrapper )
// ### @wrapper {object} the event emitter associated with the worker
// Adds testing artifacts to the worker.
//
var addTestingArtifacts = function addTestingArtifacts ( wrapper ) {

  wrapper.shouldBeSilent = shouldBeSilent( wrapper );
  wrapper.shouldBeSilentFromNowOn = shouldBeSilentFromNowOn( wrapper );
  wrapper.shouldCallCallback = shouldCallCallback( wrapper );
  wrapper.shouldCallErrorCallback = shouldCallErrorCallback( wrapper );
  wrapper.shouldEmit = shouldEmit( wrapper );
  wrapper.shouldEmitNew = shouldEmitNew( wrapper );
  wrapper.shouldNotEmit = shouldNotEmit( wrapper );

  // calls the callback for the last message that matches 'message'
  var callCallback = function callCallback ( message, error, response ) {

    var event = matchesHistoricalEvent( wrapper.history._out,
       { message : message }, true );

    if ( ! event || ! event.callback ) {
      missingCallback( message );
    }

    logCallCallback( wrapper.workerName, message, error, response );

    event.callback( error, response );

    return wrapper;

  }; // callCallback

  wrapper.callCallback = callCallback;

  // request cache for http & https requests
  var requestCache = {};

  wrapper.requestCache = requestCache;

  // returns the last call that matches the host and path without regard for
  // what http method was used
  var httpRequestFor = function httpRequestFor ( host, path ) {

    var requests = requestCache[ host ];

    if ( ! requests ) {
      noRequestsForHost( host );
    }

    var pathRequests = requests[ path ];

    if ( ! pathRequests || pathRequests.length == 0 ) {
      noRequestsForPath( path );
    }

    return pathRequests[ pathRequests.length - 1 ]; // last one

  }; // httpRequestFor

  wrapper.httpRequestFor = httpRequestFor;

  // response cache for http & https responses
  var responseCache = {};

  wrapper.responseCache = responseCache;

  // returns the last http response that matches the subdomain or path without 
  // regard for what http method was used
  var httpResponseFor = function httpResponseFor( subdomain, path ) {

    var responses = responseCache[ subdomain ];

    if ( ! responses ) {
      noResponsesForSubdomain( subdomain );
    }

    var pathResponses = responses[ path ];

    if ( ! pathResponses || pathResponses.length == 0 ) {
      noResponsesForPath( path );
    }

    return pathResponses[ pathResponses.length - 1 ]; // last one

  }; // httpResponseFor

  wrapper.httpResponseFor = httpResponseFor;

  // returns a response object that will write directly to the response object
  // being handled by the worker
  var sendHttpResponseTo = function sendHttpResponseTo ( host, path ) {

    var helper = httpRequestFor( host, path );

    // response object writable to by the development environment
    var writable = new events.EventEmitter();

    // response object that the worker listens to for response contents
    var readable = new events.EventEmitter();
    readable.headers = {};

    var readableEncoding = null;

    readable.setEncoding = function setEncoding ( encoding ) {
      readableEncoding = encoding || 'utf8';
    }

    var responseStarted = false;

    // helper for starting a response (used in write() and end())
    var startResponse = function startResponse ( response ) {

      if ( responseStarted ) { return response; } // already started

      // lowercase headers
      if ( response.headers ) {

        var headers = {};

        Object.keys( response.headers ).forEach( function ( key ) {
          headers[ key.toLowerCase() ] = response.headers[ key ];
        });

        response.headers = headers;

      } // if ( response.headers );

      var responseCallback = helper.getCallback();

      // call the callback if it was provided
      responseCallback ? responseCallback( response ) : null;

      // emit the 'response' event if something is listening to it
      helper.request().emit( 'response', response );

      responseStarted = true;

      return response;

    } // startResponse

    var createWritableChunk = function createWritableChunk ( chunk ) {

      var writableChunk;

      if ( readableEncoding ) {
        writableChunk = ( new Buffer( chunk ) ).toString( readableEncoding );
      } else {
        writableChunk = new Buffer( chunk );
      }

      return writableChunk;

    }; // createWritableChunk

    writable.writeContinue = function writeContinue () {

      readable.statusCode = 100;
      return readable;

    } // writable.writeContinue

    writable.writeHead = function writeHead ( statusCode, reasonPhrase, 
       headers ) {

      if ( typeof( reasonPhrase ) == 'object' ) {
        headers = reasonPhrase;
        reasonPhrase = null;
      }

      readable.statusCode = statusCode;
      readable.reasonPhrase = reasonPhrase;
      readable.headers = headers;
      return writable;

    }; // writable.writeHead

    writable.setHeader = function setHeader ( name, value ) {

      readable.headers[ name ] = value;
      return writable;

    }; // writable.setHeader

    writable.getHeader = function getHeader ( name ) {
      return readable.headers[ name ];
    }

    writable.removeHeader = function removeHeader ( name ) {

      delete readable.headers[ name ];
      return writable;

    }; // writable.removeHeader

    writable.write = function write ( chunk /*, encoding */ ) {

      readable = startResponse( readable );
      readable.emit( 'data', createWritableChunk( chunk ) );
      return writable;

    }; // writable.write

    writable.addTrailers = function addTrailers ( headers ) {

      readable.trailers = headers;
      return writable;

    }; // writable.addTrailers

    writable.end = function end ( data /*, encoding */ ) {

      readable = startResponse( readable );

      if ( data ) {
        readable.emit( 'data', createWritableChunk( data ) );
      }

      readable.emit( 'end' );
      return helper;

    } // writable.end

    return writable;

  }; // sendHttpResponseTo

  wrapper.sendHttpResponseTo = sendHttpResponseTo;

  var requestListeners = wrapper.requestListeners || {};

  wrapper.requestListeners = requestListeners;

  var sinkHandler = function sinkHandler ( data, scope, callback ) {

    var message = this.event;

    // handle http listen special case
    if ( message == '~crosstalk.api.http.listen' && data.subdomain
       && data.requestListener ) {

      requestListeners[ data.subdomain ] = data.requestListener;

      // add http helpers
      wrapper.http = createHttpHelpers( wrapper, requestListeners, 
         responseCache );

    } // if registering a request listener

  }; // sinkHandler

  wrapper.onAny( sinkHandler );

  return wrapper;

}; // addTestingArtifacts

module.exports = addTestingArtifacts;

//
// ### function logCallCallback ( workerName, message, error, response )
// #### @workerName {string} name fo the worker
// #### @message {string} message name for which this callback is for
// #### @error {object|string} error for the callback
// #### @response {any} response for the callback
// Logs the callback being called.
//
var logCallCallback = function logCallCallback ( workerName, message, error,
   response ) {

  stdjson.info( "CALLBACK", {
    workerName : workerName,
    message : message,
    params : {
      error : error,
      response : response
    }
  });

}; // logCallCallback

//
// ### function missingCallback ( message )
// #### @message {string} message that wasn't emitted
// Generates an assertion failure in response to no callback available for
// last emitted message that was specified
//
var missingCallback = function missingCallback( message ) {

  assert.fail( null, null, "no callback found for message `" + message + "`", 
      "!=" );

}; // missingCallback

//
// ### function noRequestsForHost ( host )
// #### @host {string} host for which there are no requests
// Generates an assertion failure in response to lack of requests for specified
// host.
//
var noRequestsForHost = function noRequestsForHost ( host ) {
  assert.fail( null, null, "no requests for host `" + host + "`", "!=" );
};

//
// ### function noRequestsForPath ( path )
// #### @path {string} path for which there are no requests
// Generates an assertion failure in response to lack of requests for specified
// path.
//
var noRequestsForPath = function noRequestsForPath ( path ) {
  assert.fail( null, null, "no requests for path `" + path + "`", "!=" );
};

//
// ### function noResponsesForPath ( path )
// #### @path {string} path for which there are no responses
// Generates an assertion failure in response to lack of responses for specified
// path.
//
var noResponsesForPath = function noResponsesForPath( path ) {
  assert.fail( null, null, "no responses for path `" + path + "`", "!=" );
};

//
// ### function noResponsesForSubdomain ( subdomain )
// #### @subdomain {string} subdomain for which there are no responses
// Generates an assertion failure in response to lack of responses for specified
// subdomain.
//
var noResponsesForSubdomain = function noResponsesForSubdomain( subdomain ) {
  assert.fail( null, null, "no responses for subdomain `" + subdomain + "`", 
     "!=" );
}; // noResponsesForSubdomain