/*
 * createWorkerName.js: Helper for consistent worker naming in the IDE
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

//
// ### function createWorkerName ( options )
// #### @options {object} options passed in on worker creation
// Creates a worker name based on options when worker was created. Purpose is
// to provide for easier debugging via REPL
//
var createWorkerName = function createWorkerName ( options ) {

  var workerName = "env-" + options.environmentId + "-worker-" +
     options.workerId;

  if ( options.name ) {
    workerName = options.name + '|' + workerName;
  }

  return workerName;

}; // createWorkerName

module.exports = createWorkerName;