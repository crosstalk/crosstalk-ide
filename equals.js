/*
 * equals.js: Wrapper around Node.js deepEquals incorporating custom matchers
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var matchers = require( './matchers' ); // TODO

// Taken from node/lib/assert.js
function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

// Taken from node/lib/assert.js
function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

//
// Adapted from node/lib/assert.js
//
function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  if (a.prototype !== b.prototype) return false;
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return exports.deepEqual(a, b);
  }
  try {
    var ka = Object.keys(a),
        kb = Object.keys(b),
        key, i;
  } catch (e) {
    return false;
  }
  if (ka.length != kb.length)
    return false;
  ka.sort();
  kb.sort();
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

//
// Adapted from node/lib/assert.js
// 
function deepEqual(actual, expected) {
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;
  } else if ( objEquiv( expected, matchers.anyFunction ) ) { // any function
    return ( typeof( actual ) == 'function' );
  } else if ( objEquiv( expected, matchers.anyString ) ) { // any string
    return ( typeof( actual ) == 'string' );
  } else if ( expected && expected.matcher == 'capture' ) { // capture matcher
    expected.worker.captured = expected.worker.captured || [];
    expected.worker.captured.push( actual );
    return true;
  } else {
    return objEquiv(actual, expected);
  }
};

module.exports = deepEqual;