crosstalk.on( 'hello', function ( params ) {
  crosstalk.emit( 'world' );
});

crosstalk.on( 'async hello', function ( params ) {

  crosstalk.async.waterfall([

    function ( callback ) {
      crosstalk.emit( 'async1' );
      callback();
    },

    function ( callback ) {
      crosstalk.emit( 'async2' );
      callback();
    }

  ], function ( error ) {
    crosstalk.emit( 'done async' );
  }); // crosstalk.async.waterfall

}); // crosstalk.on 'async hello'