/*
 * index.js : demo of httpResponseFor test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
var http = require( "http" );

var options = {
  hostname : "some.host.com",
  path : "/some/path"
};

var req = http.request( options, function ( res ) {
  if ( res.statusCode == 200 ) crosstalk.emit( "some.message" );
});

req.end();