/*
 * shouldCallCallback.js: Helper for asserting that the worker will call the
 *                        provided callback
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var shouldEmit = require( './shouldEmit' );

//
// ### function shouldCallCallback ( wrapper )
// #### @wrapper {object} the worker wrapper to construct assertion for
// Constructs the shouldCallCallback helper assertion for the wrapper specified
//
var shouldCallCallback = function shouldCallCallback ( wrapper ) {

  return shouldEmit( wrapper, { messagePrefix : '@callback', 
     messagePostfix : 'response' } );

}; // shouldCallCallback

module.exports = shouldCallCallback;