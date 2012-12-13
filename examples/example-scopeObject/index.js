/*
 * index.js : demo of scopeObject
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var allowedScope = {
  'self' : true,
  '@bob' : true
};

crosstalk.on( "test.scopeObject", allowedScope, function () {
  crosstalk.emit( 'ok' );
});

crosstalk.on( "test.addToScope", 'self', function ( params ) {
  
  if ( params && params.addThis ) {
    allowedScope[ params.addThis.name ] = params.addThis.value;
  }

}); // crosstalk.on 'test.addToScope'