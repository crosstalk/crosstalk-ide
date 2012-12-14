/*
 * eventIsAuthorized.js: Helper for authorizing events based on given scope.
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

//
// ### function eventIsAuthorized ( scope, emmittedScope )
// #### @scope {string|object} the scope accepted by the listener
// #### @emmittedScope {string|object} the scope emmitted in the event
// Provides development environment emulation of determining whether the event
// is authorized to trigger the listener.
//
var eventIsAuthorized = function eventIsAuthorized( scope, emmittedScope ) {

  var acceptsPublic = false;
  var acceptsSelf = false;
  var acceptable = [];

  if ( ! scope ) {
    acceptsSelf = true;
  }

  if ( scope && typeof( scope ) === 'string' ) {

    switch ( scope ) {

      case 'public':
        acceptsPublic = true;
        break;

      case 'self':
        acceptsSelf = true;
        break;

      case 'crosstalk':
        acceptable.push( '~crosstalk' );
        break;

      case 'org':
      case 'organization':
        acceptable.push( 'org' );
        acceptable.push( 'organization' );
        break;

      default:
        acceptable.push( scope );
        break;

    } // switch ( scope )

  } // if scope is a string
  else if ( scope && Array.isArray( scope ) ) {

    scope.forEach( function ( element ) {

      switch ( element ) {

        case 'public':
          acceptsPublic = true;
          break;

        case 'org':
        case 'organization':
          acceptable.push( 'org' );
          acceptable.push( 'organization' );

        default:
          acceptable.push( element );
          break;

      } // switch( element )

    }); // scope.forEach

  } // else if scope is an array
  else if ( scope && typeof( scope ) === 'object' ) {

    Object.keys( scope ).forEach( function ( key ) {

      switch ( key ) {

        case 'public':
          scope[ key ] ? acceptsPublic = true : null;
          break;

        case 'self':
          scope[ key ] ? acceptsSelf = true : null;
          break;

        case 'org':
        case 'organization':
          if ( scope[ key ] ) {
            acceptable.push( 'org' );
            acceptable.push( 'organization' );
          }
          break;

        case 'crosstalk':
          scope[ key ] ? acceptable.push( '~crosstalk' ) : null;
          break;

        default:
          scope[ key ] ? acceptable.push( key ) : null;
          break;

      } // switch ( key )

    }); // for each scope key

  } // if scope is an object

  // now that we know what is acceptable, see if event is ok to deliver

  if ( acceptsPublic ) {
    return true;
  }

  if ( ! emmittedScope ) {
    return acceptsSelf;
  }

  if ( emmittedScope && typeof( emmittedScope ) === 'string' ) {

    switch ( emmittedScope ) {

      case 'public':
        return acceptsPublic;

      case 'self':
        return acceptsSelf;

      default:
        return acceptable.indexOf( emmittedScope ) > -1;
        break;

    } // switch ( emmittedScope )

  } // if emmittedScope is a string

  if ( emmittedScope && typeof( emmittedScope ) === 'object' ) {

    var accepted = false;

    Object.keys( emmittedScope ).forEach( function ( key ) {

      switch ( key ) {

        case 'public':
          emmittedScope[ key ] && acceptsPublic ? accepted = true : null;
          break;

        case 'self':
          emmittedScope[ key ] && acceptsSelf ? accepted = true : null;
          break;

        default:
          for ( var i = 0; i < acceptable.length; i++ ) {

            if ( emmittedScope[ key ] && key == acceptable[ i ] ) {
              accepted = true;
              break;
            }

          } // for i in acceptable.length
          break;

      } // switch ( key )

    }); // for each emmittedScope key

    if ( accepted ) {
      return true;
    }

  } // if emmittedScope is an object

  return false;

}; // eventIsAuthorized

module.exports = eventIsAuthorized;