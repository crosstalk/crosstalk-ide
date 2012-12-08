/*
 * index.js : demo of httpRequestFor test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
var http = require( "http" );

crosstalk.on( "test.httpRequestFor", function () {

  var options = {
    headers : {
      "my-header": "my-header-value"
    },
    host : "www.mydomain.com",
    hostname : "www.mydomain.com",
    path : "/some/path?param=value"
  };

  var req = http.request( options, function ( res ) {
    crosstalk.emit( "some.message" );
  });

  req.write( "body" );

  req.end();

});