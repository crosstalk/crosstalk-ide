/*
 * eventIsAuthorized.test.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    eventIsAuthorized = require( '../eventIsAuthorized' ),
    stdjson = require( 'stdjson' );

var log = stdjson();

//
// test helper
//
var test = function test ( message, expected, scope, emmittedScope ) {

  var result = eventIsAuthorized( scope, emmittedScope );

  assert( result === expected, message );
  log.info( message, { status : "OK" } );

}; // test

//
// scope is undefined
//
test( 'by default accept only messages from self', true );

test( 'by default reject messages not from self', false, undefined, '@bob' );

//
// scope is a string
//
test( "string scope accepts specified account", true, '@alice', '@alice' );

test( "string scope rejects other than specified account", false, '@alice',
   '@bob' );

test( "string scope accepts specified organization", true, '~acme', '~acme' );

test( "string scope rejects other than specified organization", false, '~acme',
   '~bopo' );

test( "'self' accepts only messages from self", true, 'self', undefined );

test( "'self' rejects messges not from self", false, 'self', '@bob' );

test( "'crosstalk' accepts messages from '~crosstalk'", true, 'crosstalk', 
   '~crosstalk' );

test( "'crosstalk' rejects messages not from '~crosstalk'", false, 'crosstalk',
   '~acme' );

test( "'org' accepts messages from 'org'", true, 'org', 'org' );

test( "'org' accepts messages from 'organization'", true, 'org', 
   'organization' );

test( "'org' rejects messages not from 'org' or 'organization'", false, 'org', 
   '~acme' );
  
test( "'organization' accepts messages from 'org'", true, 'organization', 
   'org' );

test( "'organization' accepts messages from 'organization'", true, 
   'organization', 'organization' );

test( "'organization' rejects messages not from 'org' or 'organization'", false,
   'organization', '~acme' );

test( "'public' accepts self", true, 'public', 'self' );

test( "'public' accepts another account", true, 'public', '@bob' );

test( "'public' accepts same organization ('org')", true, 'public', 'org' );

test( "'public' accepts same organization ('organization')", true, 'public', 
   'organization' );

test( "'public' accepts another organization", true, 'public', '~acme' );

//
// scope is an object
//
test( "object scope accepts one of specified accounts set to true", true, 
   { '@bob' : false, '@carl' : true }, '@carl' );

test( "object scope rejects if none of specified accounts is set to true", 
   false, { '@bob' : false, '@carl' : false }, '@carl' );

test( "object scope rejects other than specified accounts", false,
   { '@bob' : true, '@carl' : true }, '@dan' );

test( "object scope accepts one of specified organizations set to true", true,
   { '~acme' : false, '~bopo' : true }, '~bopo' );

test( "object scope rejects if none of specified organizations is set to true", 
   false, { '~acme' : false, '~bopo' : false }, '~bopo' );

test( "object scope rejects other than specified organizations", false,
   { '~acme' : false, '~bopo' : true }, '~coco' );

test( "object scope acceps ~crosstalk if 'crosstalk' set to true", true,
   { 'crosstalk' : true }, '~crosstalk' );

test( "object scope rejects other than ~crosstalk if only 'crosstalk' set to" +
   " true", false, { 'crosstalk' : true }, '~acme' );

test( "object scope accepts own organization ('org') if 'org' set to true", 
   true, { 'org' : true }, 'org' );

test( "object scope accepts own organization ('organization') if 'org' set " +
   "to true", true, { 'org' : true }, 'organization' );

test( "object scope rejects other than own organization if only 'org' set to" +
   " true", false, { 'org' : true }, '~bopo' );

test( "object scope accepts own organization ('org') if 'organization' set to" +
   " true", true, { 'organization' : true }, 'org' );

test( "object scope accepts own organization ('organization') if " +
   "'organization' set to true", true, { 'organization' : true }, 
   'organization' );

test( "object scope rejects other than own organization if only " +
   "'organization' set to true", false, { 'organization' : true }, '~bopo' );

test( "object scope with 'public' true accepts default self", true, 
   { 'public' : true } );

test( "object scope with 'public' true accepts self", true, 
   { 'public' : true }, 'self' );

test( "object scope with 'public' true accepts another account", true,
   { 'public' : true }, '@bob' );

test( "object scope with 'public' true accepts same organization ('org')", true,
   { 'public' : true }, 'org' );

test( "object scope with 'public' true accepts same organization " +
   "('organization')", true, { 'public' : true }, 'organization' );

test( "object scope with 'public' true accepts another organization", true,
   { 'public' : true }, '~acme' );