/*
 * httpResponseFor.js: demo of httpResponseFor test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of httpResponseFor test helper" );

var worker;

ide.comment( "on GET /some/path should respond with http response" );

worker = ide.run( workerPath );
worker.http.get( 'subdomain-name', '/some/path' )
  .httpResponseFor( 'subdomain-name', '/some/path' )
    .statusCodeEquals( 200 )
    .hasHeader( 'response-header', 'value' )
    .bodyEquals( 'hello' );
