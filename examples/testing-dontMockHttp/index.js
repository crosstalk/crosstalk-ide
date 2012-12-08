/*
 * index.js : demo of dontMockHttp test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
var http = require( "http" ),
    logger = require( "logger" ),
    inspect = require( "inspect" );

crosstalk.on( "test.dontMockHttp", function () {

  var options = {
    hostname : "www.google.com"
  };

  var req = http.request( options, function ( res ) {
    logger.log( res.statusCode );
    logger.log( inspect( res.headers ) );
  });

  req.end();

});