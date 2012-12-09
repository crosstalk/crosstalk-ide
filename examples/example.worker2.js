var async = require( 'async' );

crosstalk.on( 'hello', function ( params ) {
  crosstalk.emit( 'world' );
});

crosstalk.on( 'async.hello', function ( params ) {

  async.waterfall([

    function ( callback ) {
      crosstalk.emit( 'async1' );
      callback();
    },

    function ( callback ) {
      crosstalk.emit( 'async2' );
      callback();
    }

  ], function ( error ) {
    crosstalk.emit( 'done.async' );
  }); // async.waterfall

}); // crosstalk.on 'async.hello'