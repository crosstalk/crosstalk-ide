/*
 * proxy.js: demo of proxy test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of proxy test helper" );

var worker;

ide.comment( "proxy specified messages directly to Crosstalk Swarm" );

worker = ide.run( workerPath );
worker.crosstalkToken = "your-crosstalk-session-token"; // from when you login
worker.proxy = [ "~crosstalk.api.worker.version", "@my.production.worker" ]
worker.send( "test.proxy" );