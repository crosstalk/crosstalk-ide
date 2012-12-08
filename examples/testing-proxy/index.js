/*
 * index.js : demo of proxy test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var inspect = require( "inspect" ),
    logger = require( "logger" );

crosstalk.on( "test.proxy", function () {
  
  crosstalk.emit( 
    "~crosstalk.api.worker.version", 
    {}, 
    "~crosstalk",
    function ( error, response ) {
      logger.error( error );
      logger.log( inspect( response ) );
    }
  );

});