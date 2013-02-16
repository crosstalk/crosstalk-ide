/*
 * index.js: demo of how to accomplish reliable messaging
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var retriableEmit = require( './retriableEmit' );

var doImportantStuff = function ( importantData ) {
  // do things...
  crosstalk.emit( 'doing.important.stuff' );
};

crosstalk.on( 'acknowledge.me', function ( params, callback ) {

  // process the data
  doImportantStuff( params );

  // acknowledge message after done processing it
  if ( callback ) callback( null, { your : 'protocol for acknowledging' } );

});

crosstalk.on( 'dont.acknowledge.me', function () {});


// send message that will be acknowledged
retriableEmit( 'acknowledge.me', { important : 'data' }, function ( error, response ) {
  crosstalk.emit( 'called back', response );
});

// send message that will not be acknowledged, and retry on failure
// see test/reliable.js that this keeps on retrying
retriableEmit( 'dont.acknowledge.me', {} );