/*
 * history.js: History object providing observability into workers interactions.
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var eventIsAuthorized = require( './eventIsAuthorized' );

var history = function history () {

  var _all = [];
  var _in = [];
  var _out = [];

  var inPush = function inPush ( message, params, scope, emmittedScope, type, 
     workerReference ) {
    
    var event = {};
    message ? event.message = message : null;
    params ? event.params = params : null;
    scope ? event.scope = scope : null;
    emmittedScope ? event.emmittedScope = emmittedScope : null;
    type ? event.type = type : null;
    workerReference ? event.workerReference = workerReference : null;

    event.authorized = eventIsAuthorized( scope, emmittedScope );
    event.in = true;

    _all.push( event );
    _in.push( event );

  }; // inPush

  var outPush = function outPush ( message, params, scope, callback, type,
     workerReference ) {

    var event = {};
    message ? event.message = message : null;
    params ? event.params = params : null;
    scope ? event.scope = scope : null;
    callback ? event.callback = callback : null;
    type ? event.type = type : null;
    workerReference ? event.workerReference = workerReference : null;

    event.out = true;

    _all.push( event );
    _out.push( event );

  }; // outPush

  return {
    _all : _all,
    _in : _in,
    _out : _out,
    in : inPush,
    out : outPush
  }; // return

}; // history

module.exports = history;