/*
 * createVmErrorMessage.js: Helper for showing meaningful errors if vm crashes
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

//
// ### function findFirstAtLine ( lines )
// #### @lines {array} lines to find first at line in
// Returns the first line with occurence of / +at / or undefined
//
var findFirstAtLine = function findFirstAtLine ( lines ) {

  var firstLine = undefined;

  for ( var i = 0; i < lines.length; i++ ) {

    if ( lines[ i ].match( / +at /) ) {
      firstLine = i;
      break;
    }

  } // for i in lines.length

  return firstLine;

}; // findFirstAtLine

//
// ### function createVmErrorMessage ( error, workerPath )
// #### @error {object|string} An error raised
// #### @workerPath {string} The absolute path to the worker
// Wraps error reporting so that vm errors are easier to read.
//
var createVmErrorMessage = function createVmErrorMessage ( error, workerPath ) {

  var message = '';
  var errorStackLines = error.stack.split( '\n' );

  // find the first line indicating location (has "at" at the beginning)
  var firstLine = findFirstAtLine( errorStackLines );

  if ( typeof( firstLine ) === 'undefined' ) {
    return message += error.stack;
  }

  var pathMatch = errorStackLines[ firstLine ].match( /\((.*:)/ );
  var evalmachineMatch = errorStackLines[ firstLine ].match( /evalmachine/ );

  var lineAndColumnMatch = 
     errorStackLines[ firstLine ].match( /:([0-9]+):([0-9]+)/ );

  var errorName = errorStackLines[ 0 ];
  var errorLine = lineAndColumnMatch[ 1 ];
  var errorColumn = lineAndColumnMatch[ 2 ];

  var reportedPath = evalmachineMatch ? workerPath : pathMatch[ 1 ];

  message += "Error on line " + errorLine + ", column " + errorColumn +
     " in " + reportedPath;

  if ( evalmachineMatch ) {

    for ( var i = 0; i < firstLine; i++ ) {
      message += errorStackLines[ i ];
    }

  } else {
    message += error.stack;
  }

  return message;

}; // createVmErrorMessage

module.exports = createVmErrorMessage;