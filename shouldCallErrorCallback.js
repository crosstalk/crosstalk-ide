/*
 * shouldCallErrorCallback.js: Helper for asserting that the worker calls the 
 *                             error callback specified
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var shouldEmit = require( './shouldEmit' );

//
// ### function shouldCallCallback ( wrapper )
// #### @wrapper {object} the worker wrapper to construct assertion for
// Constructs the shouldCallErrorCallback helper assertion for the wrapper 
// specified
//
var shouldCallErrorCallback = function shouldCallErrorCallback ( wrapper ) {

  return shouldEmit( wrapper, { messagePrefix : '@callback', 
     messagePostfix : 'error' } );

}; // shouldCallErrorCallback

module.exports = shouldCallErrorCallback;