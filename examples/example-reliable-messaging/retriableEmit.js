/*
 * retriableEmit.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

// NOTICE: this wrapper is not generic enough, it does not consider
//         workerReference, or callback scope in parameters, note that full
//         crosstalk.emit signature is:
//         crosstalk.emit( workerReference, message, params, scope, callback )
//
var retriableEmit = function retriableEmit ( message, params, callback ) {

  callback = callback || function () {};

  let attempt = function () {

    crosstalk.emit( message, params, function ( error, response ) {

      if ( error && error.timeout ) return attempt();

      return callback( error, response );

    }); // crosstalk.emit( message, params, <callback wrapper> )

  }; // attempt

  attempt();

}; // retriableEmit

module.exports = retriableEmit;