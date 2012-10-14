/*
 * crosstalk.js: Crosstalk context emulator constructor helper.
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    clone = require( './clone' ),
    createVmErrorMessage = require( './createVmErrorMessage' ),
    createWorkerName = require( './createWorkerName' ),
    crypto = require( 'crypto' ),
    data2xml = require( 'data2xml' ),
    dateformat = require( 'dateformat' ),
    director = require( 'director' ),
    eventIsAuthorized = require( './eventIsAuthorized' ),
    http = require( 'http' ),
    https = require( 'https' ),
    multipartParser = require( 'multipartser' ),
    semver = require( 'semver' ),
    stdjson = require( 'stdjson' )(),
    underscore = require( 'underscore' ),
    url = require( 'url' ),
    util = require( 'util' ),
    uuid = require( 'prefixed-uuid' ),
    wrapHttpRequest = require( './wrapHttpRequest' ),
    xml2js = require( 'xml2js' );

//
// ### function crosstalk ( wrapper, options )
// #### @wrapper {object} the wrapper object using this sandbox
// #### @options {object} options to use when creating the sandbox
//   options = {
//     config : {}, // worker configuration
//     environmentId : 0, // the id of the environment the worker runs in
//     silent : false, // silence logging of messages
//     workerId : 0, // the id of the worker
//     workerPath : "", // path of the worker using this context
//   }
// Creates a crosstalk context emulation to execute workers in.
//
var crosstalk = function crosstalk ( wrapper, options ) {

  var context = {};

  // expose various libraries
  context.assert = assert;
  context.async = async;
  context.clone = clone;
  context.config = options.config;
  context.crypto = crypto;
  context.data2xml = data2xml;
  context.dateformat = dateformat;
  context.inspect = util.inspect;
  context.multipart = {
    parser : multipartParser
  };
  context.semver = semver;
  context.underscore = underscore;
  context.url = url;
  context.uuid = uuid;
  context.xml2js = xml2js;

  // set the development environment
  context.env = {};
  context.env.development = true;
  context.env.production = false;

  // expose partial http library
  context.http = {
    STATUS_CODES : http.STATUS_CODES,
    get : http.get,
    request : wrapHttpRequest( wrapper, 'http' ),
    Router : director.http.Router
  };

  // expose partial https library
  context.https = {
    STATUS_CODES : https.STATUS_CODES,
    get : https.get,
    request : wrapHttpRequest( wrapper, 'https' ),
    Router : director.http.Router
  };

  // add loggers
  [ "debug", "log", "info", "warn", "error" ].forEach( function ( logger ) {

    context[ logger ] = function () {

      var _args = [],
          _arguments = arguments;

      Object.keys( _arguments ).forEach( function ( key ) {
        _args.push( _arguments[ key ] );
      });

      stdjson[ logger ]( _args.join( ' ' ), {
        workerName : createWorkerName( options )
      });

    }; // context[ logger ]

  }); // forEach [ "debug", "log", "info", "warn", "error" ]

  // create the emit method
  context.emit = function emit ( message, data, scope, callback ) {

    wrapper.history.out( message, data, scope, callback );
    options.silent ? null : logEmit( message, data, scope, options );

    wrapper.emit( message, data, scope, callback );

  }; // context.emit

  // create the on method
  context.on = function on ( message, scope, handler ) {

    // scope is optional and not a function
    if ( typeof( scope ) === 'function' ) {
      handler = scope;
      scope = null;
    }

    wrapper.on( message, function ( params, emittedScope, callback ) {

      wrapper.history.in( message, params, scope, emittedScope );

      if ( ! eventIsAuthorized( scope, emittedScope ) ) {
        return logDeliveryFailure( message, params, scope, emittedScope,
           options );
      }

      options.silent ? null : logReceive( message, params, options );

      // provide meaningful message after failure inside worker vm
      try {
        handler( params, callback );
      } catch ( error ) {
        stjdson.error( createVmErrorMessage( error, options.workerPath ), 
           error );
      }

    }); // wrapper.on

  }; // context.on

  return context;

}; // crosstalk

module.exports = crosstalk;

//
// ### function logDeliverFailure ( message, data, options )
// #### @message {string} message to be logged
// #### @data {object} data to be logged
// #### @scope {string|object} scope accepted by listener
// #### @emmittedScope {string|object} scope emmitted in the event
// #### @options {object} options passed in on worker creation
// Logs failure of message delivery due to scope mismatch
//
var logDeliveryFailure = function logDeliveryFailure ( message, data, scope,
   emmittedScope, options ) {

  if ( ! scope ) {
    scope = "not provided (self)";
  }

  if ( ! emmittedScope ) {
    emmittedScope = "not provided (self)";
  }

  stdjson.log( "NOT AUTHORIZED", {
    workerName : createWorkerName( options ),
    acceptsScope : scope,
    emittedScope : emittedScope,
    message : message,
    data : data
  });

}; // logDeliverFailure

//
// ### function logEmit ( message, data, options )
// #### @message {string} message emitted by the worker
// #### @data {object} data received with the event
// #### @scope {string|object} callback scope
// #### @options {object} options passed in on worker creation
// Logs to the console when a worker sends a message.
//
var logEmit = function logEmit ( message, data, scope, options ) {

  stdjson.log( "EMIT", {
    workerName : createWorkerName( options ),
    message : message,
    data : data,
    scope : scope
  });
  
}; // logEmit

//
// ### function logReceive ( message, data, options )
// #### @message {string} message received by the worker
// #### @data {object} data received with the event
// #### @options {object} options passed in on worker creation
// Logs to the console when a worker receives a message.
//
var logReceive = function logReceive ( message, data, options ) {

  stdjson.log( "ON", {
    workerName : createWorkerName( options ),
    message : message,
    data : data
  });

}; // logReceive