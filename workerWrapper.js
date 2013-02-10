/*
 * workerWrapper.js: Wrapper around Crosstalk worker to interact with IDE
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var addTestingArtifacts = require( './addTestingArtifacts' ),
    createWorkerName = require( './createWorkerName' ),
    crosstalk = require( './crosstalk' ),
    events = require( 'eventemitter2' ),
    history = require( './history' ),
    stdjson = require( 'stdjson' )(),
    util = require( 'util' );

//
// ### function workerWrapper ( options )
// #### @options {object} workerWrapper options
//   options = {
//     config : {}, // worker configuration
//     environmentId : 0, // the id of the environment this worker runs in
//     silent : false, // silence logging of messages
//     workerId : 0, // the id of the worker being wrapped
//     workerPath : "", // path of the worker script
//   }
// Creates a new wrapper according to the options
//
var workerWrapper = function workerWrapper ( options ) {

  options = options || {};

  var wrapper = new ( events.EventEmitter2 );

  wrapper.execute = function execute ( _function ) {

    stdjson.info( "EXECUTING FUNCTION", {
      workerName : createWorkerName( options ),
      "function" : _function.toString()
    });
    _function();
    return wrapper;

  }; // wrapper.execute

  wrapper.history = history();

  wrapper.publish = function publish ( message, data, scope, alreadyLogged ) {

    if ( ! alreadyLogged ) {
      logPublish( wrapper.environmentName, message, data, scope, options );
    }

    wrapper.emit( message, data, scope );

    return wrapper;

  }; // wrapper.publish

  wrapper.send = function send ( workerReference, message, data, scope, 
     callbackFunction ) {

    // workerReference is optional
    if ( typeof( workerReference ) != 'object' ) {
      
      callbackFunction = scope;
      scope = data;
      data = message;
      message = workerReference;
      workerReference = null;

    } else {

      if ( workerReference.__crosstalk__workerReference != 
         createWorkerName( options ) ) {

        throw new Error( "When providing workerReference in worker.send() ("+
           workerReference.__crosstalk__workerReference + "), it" +
           " must match the receiving worker reference (" +
           createWorkerName( options ) + ")" );

      } // if references don't match

    } // else

    // add callback if should have one (off by default)
    callbackFunction = callbackFunction || false;
    if ( callbackFunction ) {
      
      callbackFunction = function callbackFunction ( error, response ) {

        if ( error ) {

          if ( typeof( error ) == 'string' ) {
            error = { message : error };
          }

          error = error || {};

          wrapper.history.out( '@callback.' + message + '.error', error );
          if ( ! options.silent ) {
            logCallback( true, message, error, scope, options );
          }
          return wrapper.emit( '@callback.' + message + '.error', error );

        } // if ( error )

        if ( typeof( response ) != 'object' && 
           typeof( response ) != 'undefined' ) {
          response = { response : response };
        }

        response = response || {};

        wrapper.history.out( '@callback.' + message + '.response', response );
        if ( ! options.silent ) {
          logCallback( false, message, response, scope, options );
        }
        return wrapper.emit( '@callback.' + message + '.response', response );

      }; // callbackFunction

    } else {
      callbackFunction = null;
    }

    // make sure data is an object
    data = data || {};

    logSend( wrapper.environmentName, message, data, scope, callbackFunction,
       options );

    wrapper.emit( message, data, scope, callbackFunction, workerReference );

    return wrapper;

  }; // wrapper.send

  var crosstalkGlobal = crosstalk( wrapper, options );

  wrapper.env = {
    development : true,
    production : false
  };
  wrapper.envName = "env-" + options.environmentId ;
  wrapper.workerName = createWorkerName( options );
  wrapper.reference = { __crosstalk__workerReference : wrapper.workerName };

  wrapper = addTestingArtifacts( wrapper );

  return {
    crosstalkGlobal : crosstalkGlobal,
    wrapper : wrapper
  };

}; // workerWrapper

module.exports = workerWrapper;

//
// ### function logCallback ( isError, message, data, scope, options )
// #### @isError {boolean} determines if callback is error callback or response
// #### @message {string} message emmitted in the callback
// #### @data {object} data received with the callback
// #### @scope {string|object} callback emitted scope
// #### @options {object} options passed in on worker creation
// Logs to the console when a worker calls a callback.
//
var logCallback = function logCallback ( isError, message, data, scope, 
   options ) {

  var call = isError ? stdjson.error : stdjson.info;

  call( "CALLBACK", { 
    workerName : createWorkerName( options ),
    kind : isError ? "ERROR" : "RESPONSE",
    message : message,
    data : data,
    scope : scope,
    hasCallback : false
  });

}; // logCallback

//
// ### function logPublish ( environmentName, message, data, scope, options )
// #### @environmentName {string} environment name that is sending the message
// #### @message {string} message emitted by the worker
// #### @data {object} data received with the event
// #### @scope {string|object} callback scope
// #### @options {object} options passed in on worker creation
// Logs to the console when a worker publishes a message.
//
var logPublish = function logPublish ( environmentName, message, data, scope, 
   options ) {

  stdjson.log( "SEND PUBLISH", {
    workerName : createWorkerName( options ),
    environmentName : environmentName,
    message : message,
    data : data,
    scope : scope
  });

}; // logPublish

//
// ### function logSend ( environmentName, message, data, scope, callback,
//        options )
// #### @environmentName {string} environment name that is sending the message
// #### @message {string} message emitted by the worker
// #### @data {object} data received with the event
// #### @scope {string|object} callback scope
// #### @callback {any} callback presence indicator
// #### @options {object} options passed in on worker creation
// Logs to the console when a worker sends a message.
//
var logSend = function logSend ( environmentName, message, data, scope, 
   callback, options ) {

  stdjson.info( "SEND", {
    workerName : createWorkerName( options ),
    environmentName : environmentName,
    message : message,
    data : data,
    scope : scope,
    hasCallback : callback ? true : false
  });

}; // logSend