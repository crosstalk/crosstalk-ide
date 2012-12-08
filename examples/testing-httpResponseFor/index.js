/*
 * index.js : demo of httpResponseFor test helper
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
var http = require( "http" );

var DEFAULT_HEADERS = {
      'Content-Type' : 'text/html',
      'Server' : 'MyServer'
    };

var some_path_get = function some_path_get () {

  var self = this;

  self.res.writeHead( 200, { 'response-header' : 'value' } );
  self.res.end( 'hello' );
  return;

}; // some_path_get

var router = new http.Router({
  '/some' : {
    '/path' : {
      get : some_path_get
    } // path
  } // some
}).configure( { stream : true } );

var requestListener = function ( req, res ) {

  router.dispatch( req, res, function ( error ) {
  
    if ( error ) {
      res.writeHead( 404, DEFAULT_HEADERS );
      res.end();
    }

  }); // router.dispatch

}; // requestListener

crosstalk.emit( "~crosstalk.api.http.listen", {
  subdomain : "subdomain-name",
  requestListener : requestListener
});