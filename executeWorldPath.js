/*
 * executeWorldPath.js: Constructor for world path execute function
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

//
// ### function executeWorldPath ( worldPath )
// #### @worldPath {array} the world path to execute
// Constructs the execute function that executes the assertions 
// and other methods attached to the world path.
//
var executeWorldPath = function executeWorldPath ( worldPath ) {

  var execute = function execute ( world ) {

    if ( worldPath.length <= 0 ) {
      return;
    }

    var args = worldPath.shift();
    var method = args.shift();

    var result = world[ method ].apply( world, args );
    execute( result );

  }; // execute

  return execute;

}; // executeWorldPath

module.exports = executeWorldPath;