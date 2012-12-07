/*
 * shouldBeSilent.js: demo of shouldBeSilent test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var ide = require( "crosstalk-ide" )(),
    workerPath = require.resolve( "../index.js" );

ide.comment( "demo of shouldBeSilent test helper" );

var worker;

ide.comment( "on test.shouldBeSilent worker should be silent" );

worker = ide.run( workerPath );
worker.send( "test.shouldBeSilent" );
worker.shouldBeSilent();