/*
 * sendHttpResponseTo.js: demo of sendHttpResponseTo test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of sendHttpResponseTo test helper" );

var worker;

ide.comment( "on starting up worker should emit an http request" +
  " and we should be able to fake the response to it based on which the" +
  " worker will then emit some.message" );

worker = ide.run( workerPath );
worker
  .sendHttpResponseTo( "some.host.com", "/some/path" )
    .writeHead( 200, { "Content-Type" : "text/html" } )
    .write( "some response", "utf8" )
    .addTrailers( { "My-Trailer": "trailer-value" } )
    .end();
worker.shouldEmit( "some.message" );
