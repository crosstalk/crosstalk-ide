/* 
 * shouldBeSilent.js: Helper for asserting that the worker should not emit any
 *                    messages at all
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' );

//
// ### function shouldBeSilentConstructor ( wrapper )
// #### @wrapper {object} the worker wrapper to construct assertion for
// Constructs the shouldBeSilent helper assertion for the wrapper specified
//
var shouldBeSilentConstructor = function shouldBeSilentConstructor ( wrapper ) {

  var history = wrapper.history;

  var shouldBeSilent = function shouldBeSilent () {

    if ( history._out.length > 0 ) {
        assert.fail( '<no message (silent)>', 
           history._out[ history._out.length - 1 ], null, '==' );
    }

    // no events yet, plant a listener
    var listener = function () {

      if ( history._out.length > 0 ) {
        assert.fail( '<no message (silent)>', 
           history._out[ history._out.length - 1 ], null, '==' );
      }

    }; // listener

    wrapper.onAny( listener );

    return wrapper;

  }; // shouldBeSilent

  return shouldBeSilent;

}; // shouldBeSilentConstructor

module.exports = shouldBeSilentConstructor;