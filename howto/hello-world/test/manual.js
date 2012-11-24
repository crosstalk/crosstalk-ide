var ide = require( 'crosstalk-ide' )();

ide.send(
  "<YOUR CROSSTALK TOKEN>",
  "hello",
  {},
  null,
  function ( error, response ) {
    console.log( error, response );
  }
);