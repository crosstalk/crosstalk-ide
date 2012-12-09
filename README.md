crosstalk-ide
=============

`crosstalk-ide` is a Crosstalk Swarm emulator enabling local Crosstalk Worker development and testing.

* <a href="#installation">Installation</a>
* <a href="#usge">Usage</a>
* <a href="#howtos">HOWTOs</a>
* <a href="#examples">Examples</a>
* <a href="#crosstalk-worker-environment">Crosstalk worker environment</a>

## Installation

    npm install crosstalk-ide

## Usage

For starters, take a look at the [examples](/crosstalk/crosstalk-ide/tree/master/examples) folder and run the examples via:

    node example.js

This simple initial example illustrates how to use the `crosstalk-ide` in order to run workers. 

With `example.js` as a start, the next place to look would be at `crosstalk.js` which creates the Crosstalk sandbox that a worker runs in. That is the complete list of emulated worker functionality.

Finally, for now, `addTestingArtifacts.js` shows more of the testing functionality available in the development environment.

More examples are forthcoming.

## HOWTOs

[How to build a "Hello World" Crosstalk worker](/crosstalk/crosstalk-ide/wiki/Hello-World-HOWTO)

## [Examples](/crosstalk/crosstalk-ide/tree/master/examples)

Click on the links to see runnable worker project examples.

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

## Crosstalk worker environment

[Crosstalk global object and available modules](/crosstalk/crosstalk-ide/wiki/Crosstalk-environment)
