var ide = require( '../index.js' ),
    workerPath = require.resolve( __dirname + '/test.worker.js' ),
    workerPath2 = require.resolve( __dirname + '/test.worker2.js' );

// instantiate new environment
var ide = ide();

var worker = ide.run( workerPath, { name : 'worker' } );

worker.shouldEmit( 'creating' );

worker.send( 'hello' );

worker.shouldEmit( 'world' );

worker.send( 'async hello' );

worker.shouldEmit( 'async1' )
  .shouldEmit( 'async2' )
  .shouldEmit( 'done async' )
  .send( 'async hello' )
  .shouldEmitNew( 'done async' )
  .shouldBeSilentFromNowOn();

worker = ide.run( workerPath, { name : 'worker' } );

worker.send( 'async hello' );

worker.shouldEmit( 'done async' );

worker = ide.run( workerPath2, { name : 'worker' } );

worker.shouldBeSilent();

worker = ide.run( workerPath, { name : 'worker' } );

worker.shouldEmit( 'creating' )
  .shouldBeSilentFromNowOn();