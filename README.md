crosstalk-ide
=============

`crosstalk-ide` is a Crosstalk Swarm emulator enabling local Crosstalk Worker development and testing.

* <a href="#installation">Installation</a>
* <a href="#usge">Usage</a>
* <a href="#crosstalk-worker-environment">Crosstalk worker environment</a>
* <a href="#workers-gallery">Workers Gallery</a>
* <a href="#howtos">HOWTOs</a>
* <a href="#worker-examples">Worker Examples</a>
* <a href="#development-examples">Development Examples</a>

## Installation

    npm install crosstalk-ide

## Usage

For starters, take a look at the [examples](/crosstalk/crosstalk-ide/tree/master/examples) folder and run the examples via:

    node example.js

This simple initial example illustrates how to use the `crosstalk-ide` in order to run workers. 

With `example.js` as a start, the next place to look would be at `crosstalk.js` which creates the Crosstalk sandbox that a worker runs in. That is the complete list of emulated worker functionality.

Finally, for now, `addTestingArtifacts.js` shows more of the testing functionality available in the development environment.

More examples are forthcoming.

## Crosstalk worker environment

[Crosstalk global object and available modules](/crosstalk/crosstalk-ide/wiki/Crosstalk-environment)

## Workers Gallery

[Workers Gallery](/crosstalk/crosstalk-ide/wiki/workers-gallery)

## HOWTOs

[How to build a "Hello World" Crosstalk worker](/crosstalk/crosstalk-ide/wiki/Hello-World-HOWTO)

## Worker Examples

### Simple 'hello world' worker

```javascript
crosstalk.on( 'hello', function () {
  crosstalk.emit( 'distributed world' );
});
```

### Alice and a sandwich (messages between workers)

Alice's worker #1

```javascript
var sandwichesReceived = 0;

crosstalk.on( 'sandwich', function () {
  sandwichesReceived++; 
});
```

Alice's worker #2

```javascript
setInterval( function () {
  crosstalk.emit( 'sandwich' );
}, 5000 ); // every 5 seconds
```

### Alice and Bob

Alice's worker (Alice's account name is `alice`)

```javascript
var sandwichesReceived = 0;

crosstalk.on( 'sandwich', 'public', function () {
  sandwichesReceived++;
});
```

Bob's worker

```javascript
setInterval( function () {
  crosstalk.emit( '@alice.sandwich' );
}, 5000 ); // every 5 seconds
```

### Alice and Bob using request-reply

Alice's worker

```javascript
var sandwichesReceived = 0;

crosstalk.on( 'sandwich', 'public', function () {
  sandwichesReceived++; 
});

setInterval( function () {
  crosstalk.emit( '@bob.make.me.a.sandwich' );
}, 5000 ); // every 5 seconds
```

Bob's worker

```javascript
crosstalk.on( 'make.me.a.sandwich', 'public', function () {
  crosstalk.emit( '@alice.sandwich' ); 
});
```

### Eve sandwich spam

Eve's worker

```javascript
setInterval( function () {
  crosstalk.emit( '@alice.sandwich' ); 
}, 1000 ); // every 1 second
```

Alice's improved worker

```javascript
var sandwichesReceived = 0;

crosstalk.on( 'sandwich', '@bob', function () {
  sandwichesReceived++;
});

setInterval( function () {
  crosstalk.emit( '@bob.make.me.a.sandwich' );
}, 5000 ); // every 5 seconds
```

### Eve-n better (refactoring configuration)

Alice's configuration file

```json
{ "authorized": "@bob" }
```

Alice's refactored worker

```javascript
var config = require( 'config' );

var sandwichesReceived = 0;

crosstalk.on( 'sandwich', config.authorized, function () {
  sandwichesReceived++; 
});

setInterval( function () {
  crosstalk.emit( '@bob.make.me.a.sandwich' );
}, 5000 ); // every 5 seconds
```

### Generic Bob

Carl's worker

```javascript
crosstalk.on( 'sandwich', '@bob', function () {
  // got sandwich! 
});

crosstalk.emit( '@bob.make.me.a.sandwich', { requester : '@carl' } );
```

Generalized Bob's worker

```javascript
crosstalk.on( 'make.me.a.sandwich', 'public', function ( params ) {
   
  if ( params && params.requester ) {
    crosstalk.emit( params.requester + '.sandwich' );
  } else {
    crosstalk.emit( '@alice.sandwich' );
  }
   
}); // crosstalk.on 'make.me.a.sandwich'
```

### C-C-C-C-C-Callback!

Bob worker using callback

```javascript
crosstalk.on( 'make.me.a.sandwich', 'public', function ( params, callback ) {
  
  if ( callback ) {
    // convention is callback( <error>, <response> )
    callback( null, { sandwich : 'sandwich' } );
  }
  
}); // crosstalk.on 'make.me.a.sandwich
```

Carl's new worker

```javascript
crosstalk.emit( '@bob.make.me.a.sandwich', {}, function ( error, response ) {
   
  if ( ! error && response && response.sandwich == 'sandwich' ) {
    // got sandwich!
  }
   
}); // crosstalk.emit @bob.make.me.a.sandwich
```

### Secure Callback

Carl's more secure worker

```javascript
crosstalk.emit( '@bob.make.me.a.sandwich', {}, '@bob', function ( error, response ) {
  
  if ( ! error && response && response.sandwich == 'sandwich' ) {
    // got sandwich!
  }
  
}); // crosstalk.emit @bob.make.me.a.sandwich
```

### How many sandwiches? (web worker)

Alice's generic web sandwich worker

```javascript
var config = require( 'config' );

var sandwichesReceived = 0;

crosstalk.on( 'sandwich', config.authorized, function () {
  sandwichesReceived++; 
});

setInterval( function () {
  crosstalk.emit( '@bob.make.me.a.sandwich' ); 
}, 5000 ); // every 5 seconds

// we create a callback that will be fired every time
// when someone navigates to http(s)://alice-sandwiches.worker.crxtalk.com
var myRequestListener = function ( req, res ) {
  res.end( 'received ' + sandwichesReceived + ' sandwiches' );  
};

// register our callback at our subdomain (alice-sandwiches)
crosstalk.emit( '~crosstalk.api.http.listen', 
  {
    subdomain : 'alice-sandwiches',
    requestListener : myRequestListener
  }, 
  '~crosstalk',
  function ( error, response ) {
    // error or response to register call ~crosstalk.api.http.listen   
  }
); // crosstalk.emit ~crosstalk.api.http.listen
```

### How many secure sandwiches?

Alice's https we sandwich worker

```javascript

/* same code as in above http worker */

// register our callback at our subdomain (alice-sandwiches)
crosstalk.emit( '~crosstalk.api.http.listen', 
  {
    httpsOnly : true, // <- set 'httpsOnly' flag to true
    subdomain : 'alice-sandwiches',
    requestListener : myRequestListener
  }, 
  '~crosstalk',
  function ( error, response ) {
    // error or response to register call ~crosstalk.api.http.listen   
  }
); // crosstalk.emit ~crosstalk.api.http.listen
```

### Persistent sandwich (storing state)

Alice's persistent sandwich count worker

```javascript
var config = require( 'config' );

var sandwichesReceived = 0;

// periodically backup our sandwich count
setInterval( function () {
  
  crosstalk.emit( '~crosstalk.api.aws.s3.putObject', 
    {
      accessKeyId : config.accessKeyId,
      bucketName : config.bucketName,
      object : { sandwichCount : sandwichesReceived },
      objectName : 'sandwiches.json',
      secretAccessKey : config.secretAccessKey
    }, 
    '~crosstalk', 
    function ( error, response ) {
      // handle errors if any
    }
  ); // crosstalk.emit ~crosstalk.api.aws.s3.putObject
  
}, 1000 * 60 * 60 ); // every hour

/* the rest of Alice worker is as before */
```

### Recoverable sandwich

Alice's worker that initializes from existing sandwich count

```javascript
var config = require( 'config' );

var sandwichesReceived = 0;

// get saved sandwich count from an object in S3
crosstalk.emit( '~crosstalk.api.aws.s3.getObject',
  {
    accessKeyId : config.accessKeyId,
    bucketName : config.bucketName,
    objectName : 'sandwiches.json',
    secretAccessKey : config.secretAccessKey
  },
  '~crosstalk',
  function ( error, response ) {
    
    if ( ! error ) {
      sandwichesReceived += response.object.sandwichCount;
    }
    
  } // function ( error, response )
); // crosstalk.emit ~crosstalk.api.aws.s3.getObject

/* the rest of Alice's worker follows as before */
```

## Development Examples

Click on the links to see runnable worker project examples. All examples can be found [here](/crosstalk/crosstalk-ide/tree/master/examples).

### Make HTTP(S) requests from local worker in development

#### [HTTP example](/crosstalk/crosstalk-ide/blob/master/examples/testing-dontMockHttp/test/dontMockHttp.js)

```javascript
worker = ide.run( workerPath );
worker.dontMockHttp = true;
```

#### [HTTPS example](/crosstalk/crosstalk-ide/tree/master/examples/testing-dontMockHttps/test/dontMockHttps.js)

```javascript
worker = ide.run( workerPath );
worker.dontMockHttps = true;
```

### Mock HTTP(S) responses

#### [HTTP(S) response example](/crosstalk/crosstalk-ide/blob/master/examples/testing-sendHttpResponseTo/test/sendHttpResponseTo.js)

```javascript
worker = ide.run( workerPath );
worker
  .sendHttpResponseTo( "some.host.com", "/some/path" )
    .writeHead( 200, { "Content-Type" : "text/html" } )
    .write( "some response", "utf8" )
    .addTrailers( { "My-Trailer": "trailer-value" } )
    .end();
```

### Send messages to Crosstalk Swarm from local worker in development

#### [proxy example](/crosstalk/crosstalk-ide/blob/master/examples/testing-proxy/test/proxy.js)

```javascript
worker = ide.run( workerPath );
worker.crosstalkToken = "your-crosstalk-session-token"; // from when you login
worker.proxy = [ "~crosstalk.api.worker.version", "@my.production.worker" ]
```
