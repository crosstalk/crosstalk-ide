crosstalk.on( 'hello', function ( params, callback ) {
  if ( callback ) callback( null, { hello : "world" } );
});