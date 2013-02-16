/*
 * index.js: demo of how to accomplish reliable messaging
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var doImportantStuff = function ( importantData ) {
  // do things...
  crosstalk.emit( 'doing.important.stuff' );
};

crosstalk.on( 'acknowledge.me', function ( params, callback ) {

  // acknowledge message right away
  if ( callback ) callback( null, { your : 'protocol for acknowledging' } );

  // process the data
  doImportantStuff( params );

});

crosstalk.on( 'dont.acknowledge.me', function () {});


// send message that will be acknowledged
var sendImportantMessage = function sendImportantMessage () {

  crosstalk.emit( 'acknowledge.me', { important : 'data' }, function ( error, response ) {

    // if the callback isn't called within the timeout (default 5 seconds)
    // send the important message again
    if ( error && error.timeout ) return sendImportantMessage();

    crosstalk.emit( 'called back', response );

  }); // crosstalk.emit @you.acknowledge.me

}; // sendImportantMessage

sendImportantMessage();

// send message that will not be acknowledged, and retry on failure
// see test/reliable.js that this keeps on retrying
var sendNotAcknowledgeMessage = function sendNotAcknowledgeMessage () {

  crosstalk.emit( 'dont.acknowledge.me', {}, function ( error, response ) {
    if ( error && error.timeout ) return sendNotAcknowledgeMessage();
  });

}; // sendNotAcknowledgeMessage

sendNotAcknowledgeMessage();