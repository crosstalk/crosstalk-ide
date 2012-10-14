/*
 * httpResponseHelper.js: Helper for easier interaction with http response
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    httpBodyEquals = require( './httpBodyEquals' ),
    httpHasHeader = require( './httpHasHeader' );

//
// ### function helper ( wrapper, responseObj )
// #### @wrapper {object} the wrapper for the worker that responded
// #### @responseObj {object} the http response object from the worker
// Creates a helper for simpler interaction with http response from the worker.
//
var helper = function helper ( wrapper, responseObj ) {

  var helper = {};

  helper.bodyEquals = httpBodyEquals( helper, responseObj );
  helper.hasHeader = httpHasHeader( helper, responseObj );

  helper.response = function response () {
    return responseObj;
  };

  helper.statusCodeEquals = function statusCodeEquals ( statusCode ) {

    assert.equal( responseObj.statusCode, statusCode );

    return helper;

  }; // helper.statusCodeEquals

  helper.worker = function worker () {
    return wrapper;
  };

  return helper;

}; // helper

module.exports = helper;