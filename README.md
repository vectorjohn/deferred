Deferred - a functional deferred
================================

This was a learning project for myself.  I recently read over a good explanation of deferreds and decided I wanted to make an implementation so I could play with it.  What I read was about jQuery Deferreds, so there may be similarities but I wanted to do it purely functional.

TODO: I still need to package it up as an NPM package.

Example:
--------

    var D = require('./Deferred');

    function doSomethingAsync() {
        return D.def( function( resolve ) {
            setTimeout( function() {
                resolve( 'resolved', new Date() );
            }, 2000 );
        });
    }

    var d = doSomethingAsync();

    d( function() {
        // arguments should be {0: 'resolved', 1: [Date instance]}
        console.log( 'A deferred resolved.  Args: ', arguments );

        //this logs it again even though it resolved already
        d( console.log );
    });



Something that looks more realisitic:
-------------------------------------

    var D = require('./Deferred');

    function getAuthor( userId ) {
        return D.def( function( resolve ) {
            setTimeout( function() {
                resolve( {
                    name: 'User ' + userId,
                    books: [ 1234, 4563 ]
                });
            }, 2000 );
        });
    }

    function getBook( bookId ) {
        return D.def( function( resolve ) {
            setTimeout( function() {
                resolve( {
                    title: 'A cool book',
                    description: 'This is really a neato book.'
                });
            }, 1000 );
        });
    }

    
    var bothReady = D.when( getAuthor( 3 ), getBook( 124 ) );

    bothReady( function( author, book ) {
        console.log( 'Author: ', author );
        console.log( 'Book: ', book );
    });


