/*
 * httpBodyEquals.js: Convenience for checking body equality without serializing
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' );

var httpBodyEquals = function httpBodyEquals ( helper, obj ) {

  var bodyEquals = function bodyEquals ( body ) {

    if ( typeof( body ) == 'object' ) {

      try {

        var json = JSON.parse( obj.body.toString() );
        assert.deepEqual( json, body );

      } catch ( exception ) {

        if ( exception.name == 'AssertionError' ) {

          assert.fail( exception.actual, exception.expected, null,
             exception.operator );

        } // if AssertionError

        assert.fail( JSON.stringify( body ), obj.body.toString(), null, "==" );

      } // catch exception

    } else if ( typeof( body ) == 'string' ) {
      assert.equal( obj.body.toString(), body );
    } else if ( typeof( body ) == 'function' ) {
      body( obj.body );
    }

    return helper;

  }; // bodyEquals

  return bodyEquals;

}; // httpBodyEquals

module.exports = httpBodyEquals