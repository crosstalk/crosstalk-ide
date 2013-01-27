/*
 * shouldPublish.js: Helper for assert that the worker should publish an event
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var createWorldPath = require( './createWorldPath' ),
    matchesHistoricalEvent = require( './matchesHistoricalEvent' );

var shouldPublishConstructor = function shouldPublishConstructor ( wrapper,
   options ) {

  var history = wrapper.history,
      options = options || {};

  var messagePrefix = options.messagePrefix || null;
  var messagePostfix = options.messagePostfix || null;

  var shouldPublish = function shouldPublish ( message, params, scope, 
     callback ) {

    var _message = message;

    if ( messagePrefix ) {
      _message = messagePrefix + '.' + _message;
    }

    if ( messagePostfix ) {
      _message = _message + '.' + messagePostfix;
    }

    _message = _message;

    var eventToMatch = {
      message : _message,
      params : params,
      scope : scope,
      callback : callback,
      type : 'pubsub'
    };

    // 1. check history to see if this already happened
    if ( matchesHistoricalEvent( history._out, eventToMatch ) ) {
      return wrapper;
    }

    // 2. hasn't happened yet so attach an event listener that will trigger
    //  this world path
    return createWorldPath( wrapper, eventToMatch );

  }; // shouldPublish

  return shouldPublish;

}; // shouldPublishConstructor

module.exports = shouldPublishConstructor;