var Define = require( './Define' );

function slice( a, s, l ) {
    return Array.prototype.slice.call( a, s, l );
}

/**
 * Make a deferred in a functional way.
 *
 * @param Function fn - I don't know what to call this, but this is called with a resolve
 *      function you can call when the async operation is done.
 *      TODO: fail the deferred.  In the curent form you could just pass some known value
 *          to the resolve callback, but I don't know if that's good enough.
 * @return Function "then".  This is equivalent to jQuery's promise object.  You you call
 *      it with a callback that will be called when the deferred resolves (with its arguments)
 *      The signature of the callback is function( arg1, ..., argN ){}
 */
function def( fn ) {
    var queue = [];
    var done = false;
    var result = [];

    fn( function() {
        result = slice( arguments );

        done = true;
        for ( var i = 0; i < queue.length; i++ ) {
            queue[i].apply( null, result );
        }
    });

    return function( then ) {
        if ( done ) {
            then.apply( null, result );
        } else {
            queue.push( then );
        }
    }
}

/**
 * creates a deferred that resolves when its arguments all resolve.
 * Can be called with 0 or more deferreds.
 */
function when() {
    var len = arguments.length,
        args = slice( arguments );

    if ( len === 0 ){
        return def( function( resolve ){ resolve(); } );
    } else if ( len === 1 ) {
        return args[0];
    } else {
        return def( function( resolve ){
            args[0]( function() {
                var res1 = slice( arguments );
                var then = when.apply( null, slice( args, 1 ) );
                then( function() {
                    resolve.apply( null, res1.concat( slice( arguments ) ) );
                });
            });
        });
    }
}

/**
 * Sort of like a map.  You pass it the return value of a call to def()
 * and give it a function which returns a (maybe) modified version of 
 * the resolve arguments.  
 *
 * @param Function then - return value from a call to def()
 * @param Function fn - a function that will be called with resolve
 *      arguments and returns them possibly modified.
 * @return Function a new 'then' function.
 */
function pipe( then, fn ) {
    return def( function( resolve ) {
        then( function() {
            resolve.apply( null, fn.apply( null, slice( arguments ) ) );
        });
    });
}

/**
 * For those not OK with functional code, this is an object
 * oriented wrapper around the above functions.
 */
var Deferred = Define( null, {
    
    promise: function() {
        return this.then;
    }

}, function()
{
    var self = this;

    var then = def( function( resolve ) {
        self.resolve = function() {
            resolve.apply( null, arguments );
            return this;
        };
    });

    this.then = function() {
        then.apply( null, arguments );
        return this;
    };
} );


module.exports = {
    Deferred: Deferred,
    def: def,
    when: when,
    pipe: pipe
};

