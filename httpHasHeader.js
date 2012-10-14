/*
 * httpHasHeader.js: Checks if request has the indicated header
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' );

var httpHasHeader = function httpHasHeader ( helper, obj ) {

  var hasHeader = function hasHeader ( header, value ) {

    if ( ! obj.headers ) { return false; }

    if ( obj.headers[ header ] != value ) {

      assert.fail( null, null, "Header " + header + ": " + value +
         "not found." );

    } // if ( obj.headers[ header ] != value )

    return helper;

  }; // hasHeader

  return hasHeader;

}; // httpHasHeader

module.exports = httpHasHeader