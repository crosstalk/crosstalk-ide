/*
 * writeTo.js: Helper for writing stuff to buffers
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var writeTo = function writeTo ( buffer, data, encoding ) {

  // no side effects
  var _buffer = null;

  data = data || '';

  if ( ! buffer ) {

    // no side effects
    _buffer = new Buffer( data, encoding );

  } else {

    var newBufferLength = Buffer.byteLength( data, encoding );

    // no side effects
    _buffer = new Buffer( buffer.length + newBufferLength );
    buffer.copy( _buffer );

    _buffer.write( data, buffer.length, newBufferLength, encoding );

  } // else

  return _buffer;

}; // writeTo

module.exports = writeTo;