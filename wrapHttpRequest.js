/*
 * wrapHttpRequest.js: Wraps outgoing http made by worker so we can inspect it
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var events = require( 'events' ),
    http = require( 'http' ),
    https = require( 'https' ),
    httpRequestHelper = require( './httpRequestHelper' ),
    logHttpRequest = require( './logHttpRequest' ),
    writeTo = require( './writeTo' );

var wrapHttpRequest = function wrapHttpRequest ( wrapper, protocol ) {

  var httpRequest = function httpRequest ( options, callback ) {

    // if we specifically don't want to mock http requests
    if ( protocol == 'http' && wrapper.dontMockHttp ) {

      logHttpRequest( wrapper.workerName, options, '',
        { outbound : true, protocol : protocol } );

      return http.request.apply( http, arguments );

    } // if ( protocol == 'http' && wrapper.dontMockHttp )

    if ( protocol == 'https' && wrapper.dontMockHttps ) {

      logHttpRequest( wrapper.workerName, options, '', 
        { outbound : true, protocol : protocol } );

      return https.request.apply( https, arguments );
      
    } // if ( protocol == 'http' && wrapper.dontMockHttps )

    // hostname is preferable, so let's make sure we have that
    options.hostname = options.hostname || options.host;

    wrapper.requestCache[ options.hostname ] = 
       wrapper.requestCache[ options.hostname ] || [];
    wrapper.requestCache[ options.hostname ][ options.path ] =
       wrapper.requestCache[ options.hostname ][ options.path ] || [];

    var request = new events.EventEmitter();

    // creating a new requestObj here instead of attaching properties to
    // request so that we emulate correct behavior instead of allowing things
    // like request.body = 'blah' to happen
    var requestObj = {};
    requestObj.body = null;
    requestObj.callback = callback;
    requestObj.request = request;
    requestObj.headers = options.headers || {};
    requestObj.host = options.host;
    requestObj.hostname = options.hostname;
    requestObj.port = options.port;
    requestObj.protocol = protocol;
    requestObj.localAddress = options.localAddress;
    requestObj.socketPath = options.socketPath;
    requestObj.method = options.method || "GET";
    requestObj.url = options.path;
    requestObj.auth = options.auth;
    requestObj.agent = options.agent;

    var wroteBinaryData = false;

    request.setHeader = function setHeader ( name, value ) {
      requestObj.headers[ name ] = value;
    };

    request.getHeader = function getHeader ( name ) {
      return requestObj.headers[ name ];
    };

    request.removeHeader = function removeHeader ( name ) {
      delete requestObj.headers[ name ];
    };
    
    request.abort = function abort () {
      
      requestObj = {};
      request.end = function dummyEnd () {};

    }; // request.abort

    request.write = function write ( chunk, encoding ) {

      if ( ! encoding && typeof ( chunk == 'string' ) ) {
        encoding = 'utf-8';
      }

      requestObj.body = writeTo( requestObj.body, chunk, encoding );

      if ( encoding == 'binary' ) {
        wroteBinaryData = true;
      }

    }; // request.write

    request.end = function end ( data, encoding ) {

      if ( ! encoding && typeof ( data == 'string' ) ) {
        encoding = 'utf-8';
      }

      requestObj.body = writeTo( requestObj.body, data, encoding );

      if ( encoding == 'binary' ) {
        wroteBinaryData = true;
      }

      // don't dump binary data to the log unencoded
      var logBody = wroteBinaryData ? 
         "<binary data>" : requestObj.body.toString( 'utf-8' );

      logHttpRequest( wrapper.workerName, requestObj, logBody, 
        { outbound : true, protocol : protocol } );

      // create http testing helper
      var helper = httpRequestHelper( wrapper, requestObj );

      wrapper.requestCache[ options.hostname ][ options.path ].push( helper );

      requestObj = {};
      request.end = function dummyEnd () {};

    }; // request.end

    request.setTimeout = function setTimeout ( timeout, callback ) {
      // dummy mock
    }; // request.setTimeout

    request.setNoDelay = function setNoDelay ( noDelay ) {
      // dummy mock
    }; // request.setNoDelay

    request.setSocketKeepAlive = function setSocketKeepAlive ( enable, 
       initialDelay ) {
      // dummy mock
    }; // request.setSocketKeepAlive

    return request;

  }; // httpRequest

  return httpRequest;

}; // wrapHttpRequest

module.exports = wrapHttpRequest;