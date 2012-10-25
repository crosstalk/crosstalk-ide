/*
 * require.js: Crosstalk require implementation
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    stdjson = require( 'stdjson' );

//
// ### function constructRequire ( options )
// #### @options {object} options to use when constructing crosstalk require
// {
//   config : <config>,
//   wrapHttpRequest : <wrapHttpRequest>,
//   wrapper : <wrapper>,
//   workerName : <workerName>
// }
// Constructs crosstalk implementation of require
//
var constructRequire = function constructRequire ( options ) {

  return function _require ( _module ) {

    _module = _module && _module.toLowerCase();

    switch ( _module ) {

      case 'assert':
        return require( 'assert' );

      case 'async':
        return require( 'async' );

      case 'clone':
        return require( './clone' );

      case 'config':
        return options.config;

      case 'crypto':
        return require( 'crypto' );

      case 'data2xml':
        return require( 'data2xml' );

      case 'dateformat':
        return require( 'dateformat' );

      case 'env':
        var env = {};
        env.development = true;
        env.production = false;
        return env;

      case 'http':
        var http = require( 'http' );
        return {
          STATUS_CODES : http.STATUS_CODES,
          get : http.get,
          request : options.wrapHttpRequest( options.wrapper, 'http' ),
          Router : require( 'director' ).http.Router
        };

      case 'https':
        var https = require( 'https' );
        return {
          STATUS_CODES : https.STATUS_CODES,
          get : https.get,
          request : options.wrapHttpRequest( options.wrapper, 'https' ),
          Router : require( 'director' ).http.Router
        };

      case 'inspect':
        return require( 'util' ).inspect;

      case 'logger':
        var logger = {};
        [ "debug", "log", "info", "warn", "error" ].forEach( 
           function ( method ) {

          logger[ method ] = function () {

            var _args = [],
                _arguments = arguments;

            Object.keys( _arguments ).forEach( function ( key ) {
              _args.push( _arguments[ key ] );
            });

            stdjson[ method ]( _args.join( ' ' ), {
              workerName : options.workerName
            });

          }; // logger[ method ]

        }); // forEach
        return logger;

      case 'multipart':
        return {
          parser : require( 'multipartser' )
        };

      case 'querystring':
        return require( 'querystring' );

      case 'semver':
        return require( 'semver' );

      case 'underscore':
        return require( 'underscore' );

      case 'url':
        return require( 'url' );

      case 'uuid':
        return require( 'prefixed-uuid' );

      case 'xml2js':
        return require( 'xml2js' );

      default:
        throw new Error( "module " + _module + " not available" );

    } // switch ( _module )

  }; // return function _require ( _module )

}; // constructRequire

module.exports = constructRequire;