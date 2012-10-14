/*
 * matchers.js: List of matchers used for testing equality in assertions
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

exports.anyFunction = { matcher : "function" };
exports.anyString = { matcher : "string" };

//
// ### function capture ( worker )
// #### @worker {object} the worker to attach capture to
// A way for the tester to capture callbacks for execution.
//
exports.capture = function capture ( worker ) {
  return { matcher : "capture", worker : worker };
};