/*
 * index.js: Crosstalk Integrated Development Envirionment
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var clone = require( './clone' ),
    createVmErrorMessage = require( './createVmErrorMessage' ),
    fs = require( 'fs' ),
    matchers = require( './matchers' ),
    request = require( 'request' ),
    stdjson = require( 'stdjson' )(),
    workerWrapper = require( './workerWrapper' ),
    vm = require( 'vm' );

var ENVIRONMENT_ID = 0, // global environment id counter
    FAIL_CODES = {
      400 : 'Bad Request',
      401 : 'Not Authorized',
      403 : 'Forbidden',
      404 : 'Item Not Found',
      405 : 'Method Not Allowed',
      409 : 'Conflict',
      500 : 'Internal Server Error'
    };
//
// ### function comment ( message, wrapper )
// #### @message {string} the message to log
// #### @wrapper {object} optional worker wrapper for identifiying comment to 
//      specific worker
// Logs the comment, and optionally tags it with specific worker
//
var comment = function comment ( message, wrapper ) {

  stdjson.log( "COMMENT", {
    workerName : wrapper ? wrapper.workerName : undefined,
    message : message
  });

}; // comment

//
// ### function run ( workerPath, options, callback )
// #### @workerPath {string} The path for the worker module to be created
// #### @options {object} Run options
// #### @callback {function} optional callback to call when done
// Runs the selected worker in the development environment
// Returns an EventEmitter for interacting with the running worker via the 
// callback provided.
//
var run = function run ( workerPath, options, callback ) {

  // Check if we have path to worker or should we work from the current module.
  // Need to do this here so we have a workerPath for error reporting.
  if ( ! workerPath ) {
    workerPath = require.resolve( process.cwd() );
  }

  var wrapperOptions = clone( options );
  wrapperOptions.workerPath = workerPath;

  // load worker script
  var workerScript = fs.readFileSync( workerPath, 'utf8' );

  var wrapperAndCrosstalkGlobal = workerWrapper( wrapperOptions );
  var wrapper = wrapperAndCrosstalkGlobal.wrapper;
  var crosstalkGlobal = wrapperAndCrosstalkGlobal.crosstalkGlobal;

  // create worker context
  var context = {
    crosstalk : Object.freeze( crosstalkGlobal ),
    Buffer : Object.freeze( Buffer ),
    setInterval : Object.freeze( setInterval ),
    setTimeout : Object.freeze( setTimeout )
  };

  // log creating a worker
  stdjson.info( "CREATING", { workerId : wrapper.workerName } );

  // provide a meaningful message after failure inside worker context
  try {

    vm.runInContext( workerScript, vm.createContext( context ) );
    stdjson.info( "CREATED", { workerId : wrapper.workerName } );

  } catch ( error ) {

    stdjson.error( createVmErrorMessage( error, workerPath ), error );
    return callback ? callback( error ) : error;

  } // catch ( error )

  // attach proxySend so that we can send messages to crosstalk
  wrapper.proxySend = send;

  return callback ? callback( null, wrapper ) : wrapper;

}; // run

//
// ### function send ( crosstalkToken, message, params, scope, callback )
// #### @crosstalkToken {string} authorized Crosstalk token
// #### @message {string} message name to send
// #### @params {object} params to send with message
// #### @scope {string|object} authorized callback scope
// #### @callback {function} callback( error, result ) to process error/response
// This send (as opposed to worker.send), sends the message to Crosstalk and
// provides the response via callback
//
var send = function send ( crosstalkToken, message, params, scope, callback ) {

  var body = {
    crosstalkToken : crosstalkToken,
    message : message,
    params : params,
    scope : scope
  };

  callback ? body.callback = true : null;

  stdjson.log( "SENDING TO CROSSTALK", {
    message : message,
    params : params,
    scope : scope
  });

  var options = {
    method : "POST",
    uri : "https://send.worker.crxtalk.com/send",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify( body )
  }; // options

  request( options, function ( error, response, body ) {

    // pretty format for connection refused error
    if ( error && error.errno === 'ECONNREFUSED' ) {
      error.message = "Unable to connect to " + options.uri;
      error.message += " (Connection Refused)";
      delete error.stack;
    }

    if ( error ) {

      stdjson.error( "ERROR", error );
      return; // done

    } // if ( error )

    var statusCode, result, err;

    try {

      statusCode = response.statusCode.toString();
      result = JSON.parse( body );

    } catch ( ex ) {
      // ignore errors
    }

    stdjson.log( "STATUS CODE", {
      statusCode : statusCode
    });

    if ( Object.keys( FAIL_CODES ).indexOf( statusCode ) !== -1 ) {

      err = new Error( "Crosstalk Error (" + statusCode + "): " +
         FAIL_CODES[ statusCode ] );
      err.statusCode = statusCode;
      err.result = result;
      stdjson.error( "ERROR", err );
      return; // done

    } // if ( Object.keys( FAIL_CODES ).indexOf( statusCode ) !== -1 )

    if ( ! result ) {
      stdjson.log( "BODY", body );
      return; // done
    }

    if ( result.error ) {

      stdjson.log( "ERROR RESPONSE", {
        message : message,
        error : result.error
      });
      return callback ? callback( result.error ) : null;

    } else {

      stdjson.log( "RESPONSE", {
        message : message,
        response : result.response
      });
      return callback ? callback( null, result.response ) : null;

    } // else

  }); // request

}; // send

//
// ### function ide ()
// Initializes a new Crosstalk environment for workers to run in.
// 
var ide = function ide () {

  var WORKER_ID = 0; // environment specific worker id counter

  var environmentId = ENVIRONMENT_ID++;

  var _run = function _run ( workerPath, options, callback ) {

    // options are optional and not a function
    if ( typeof( options ) === 'function' ) {
      callback = options;
      options = {};
    }

    options = options || {};
    options.environmentId = options.environmentId || environmentId;
    options.eventListeners = options.eventListeners || {};
    options.silent = options.silent || false;
    options.workerId = options.workerId || WORKER_ID++;

    return run( workerPath, options, callback );

  }; // _run

  return {
    anyFunction : matchers.anyFunction,
    anyString : matchers.anyString,
    capture : matchers.capture,
    clone : clone,
    comment : comment,
    run : _run,
    send : send // TODO
  };

}; // ide

module.exports = ide;