/*
 * worldPathWrapper.js: World path wrapper for capturing method calls
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var METHODS = [
  'bodyEquals', 
  'callCallback', 
  'execute', 
  'hasHeader', 
  'httpRequestFor',
  'httpResponseFor', 
  'response', 
  'send', 
  'sendHttpResponseTo',
  'shouldBeSilent', 
  'shouldBeSilentFromNowOn', 
  'shouldCallCallback', 
  'shouldCallErrorCallback',
  'shouldEmit', 
  'shouldEmitNew', 
  'statusCodeEquals', 
  'worker'
];

//
// ### function addMethodCall ( name, worldPath, worldPathWrapper )
// #### @name {string} the name of method that will be added
// #### @worldPath {object} the world path to add method call to
// #### @worldPathWrapper {object} the wrapper to return after adding method
//    to the world path
// Adds a new method call to the worldPathWrapper.
//
var addMethodCall = function addMethodCall ( name, worldPath, worldPathWrapper ) {

  return function () {

    var args = Array.prototype.slice.call( arguments );
    args.unshift( name );
    worldPath.push( args );

    return worldPathWrapper;

  }; // return function ()

}; // addMethodCall

//
// ### function worldPathWrapper ( worldPath )
// #### @worldPath {array} array holding methods to be called for this world
// Creates a new world path wrapper to capture method calls in provided world
// path.
//
var worldPathWrapper = function worldPathWrapper ( worldPath ) {

  var worldPathWrapper = {};

  METHODS.forEach( function ( method ) {

    worldPathWrapper[ method ] = 
       addMethodCall( method, worldPath, worldPathWrapper );
  
  }); // METHODS.forEach

  return worldPathWrapper;

}; // worldPathWrapper

module.exports = worldPathWrapper;