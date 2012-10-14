/*
 * shouldBeSilentFromNowOn.js: Helper for asserting that the worker should not
 *                             emit any more messages from when this is called
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' );

//
// ### function shouldBeSilentFromNowOnConstructor ( wrapper ) 
// #### @wrapper {object} the worker wrapper to construct assertion for
// Constructs the shouldBeSilentFromNowOn helper assertion for the wrapper 
// specified
//
var shouldBeSilentFromNowOnConstructor = 
   function shouldBeSilentFromNowOnConstructor ( wrapper ) {

  var history = wrapper.history;

  var shouldBeSilentFromNowOn = function shouldBeSilentFromNowOn () {

    var markedOutLength = history._out.length;

    // attach a listener to check that no more events happen
    var listener = function () {

      if ( history._out.length > markedOutLength ) {
        assert.fail( '<no more messages (silent)>',
           history._out[ history._out.length - 1 ], null, '==' );
      }

    }; // listener

    wrapper.onAny( listener );

    return wrapper;

  }; // shouldBeSilentFromNowOn

  return shouldBeSilentFromNowOn;

}; // shouldBeSilentFromNowOnConstructor

module.exports = shouldBeSilentFromNowOnConstructor;