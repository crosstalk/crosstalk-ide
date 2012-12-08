/*
 * httpRequestFor.js: demo of httpRequestFor test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of httpRequestFor test helper" );

var worker;

ide.comment( "on test.httpRequestFor should make http request" );

worker = ide.run( workerPath );
worker.send( "test.httpRequestFor" );
worker
  .httpRequestFor( "www.mydomain.com", "/some/path?param=value" )
    .bodyEquals( "body" )
    .hasHeader( "my-header", "my-header-value" )
    .hostEquals( "www.mydomain.com" )
    .hostnameEquals( "www.mydomain.com" )
    .methodEquals( "GET" )
    .pathEquals( "/some/path?param=value" )
    .protocolEquals( "http" )
    .urlEquals( "/some/path?param=value" );