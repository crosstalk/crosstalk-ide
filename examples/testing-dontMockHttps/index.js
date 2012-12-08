/*
 * index.js : demo of dontMockHttps test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
var https = require( "https" ),
    logger = require( "logger" ),
    inspect = require( "inspect" );

crosstalk.on( "test.dontMockHttps", function () {

  var options = {
    hostname : "www.google.com"
  };

  var req = https.request( options, function ( res ) {
    logger.log( res.statusCode );
    logger.log( inspect( res.headers ) );
  });

  req.end();

});