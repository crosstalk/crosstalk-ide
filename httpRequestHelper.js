/*
 * httpRequestHelper.js: Helper for easier interaction with captured requests.
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    httpBodyEquals = require( './httpBodyEquals' ),
    httpHasHeader = require( './httpHasHeader' );

//
// ### function helper ( wrapper, requestObj )
// #### @wrapper {object} the wrapper for the worker that responded
// #### @requestObj {object} the http request object from the worker
// Creates a helper for simpler interaction with http request from the worker.
//
var helper = function helper ( wrapper, requestObj ) {

  var _helper = {};

  _helper.bodyEquals = httpBodyEquals( _helper, requestObj );
  _helper.hasHeader = httpHasHeader( _helper, requestObj );

  _helper.getCallback = function getCallback () {
    return requestObj.callback;
  }
  
  _helper.request = function request () {
    return requestObj.request;
  };

  _helper.requestObj = function requestObj () {
    return requestObj;
  };

  _helper.hostEquals = function hostEquals ( host ) {

    assert.equal( requestObj.host, host );
    return _helper;

  }; // hostEquals

  _helper.hostnameEquals = function hostnameEquals ( hostname ) {

    assert.equal( requestObj.hostname, hostname );
    return _helper;

  }; // hostnameEquals

  _helper.methodEquals = function methodEquals ( method ) {

    assert.equal( requestObj.method, method );
    return _helper;

  }; // methodEquals

  _helper.pathEquals = function pathEquals ( path ) {

    assert.equal( requestObj.path, path );
    return _helper;

  }; // pathEquals

  _helper.protocolEquals = function protocolEquals ( protocol ) {

    assert.equal( requestObj.protocol, protocol );
    return _helper;

  }; // protocolEquals

  _helper.worker = function worker () {
    return wrapper;
  };

  return _helper;

}; // helper

module.exports = helper;