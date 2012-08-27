/**
 * This is my goofy little Javascript class helper.  Not sure if I like it yet,
 * but the idea is it handles making constructors, static methods, etc.
 * Part of the design idea is I wanted the "real" constructors to do nothing
 * (i.e. when you do "new Foo()" nothing happens).  This is to avoid putting
 * stuff in the prototype of a subclass that wasn't in the prototype of the parent.
 * Instead you call Foo.create() to make an instance.  create makes an instance
 * and then calls an init method.
 */
function BaseClass(){};

BaseClass.prototype = {
    init: function(){ return this; }
};
BaseClass.create = function() {
    var inst = new this();
    inst.init.apply( inst, arguments );
    return inst;
};

/**
 * Create a new class. 
 *
 * @param Function parentClass - an instance of this will be created and used as the prototype
 *      for the sub class.  If this is something falsy, the above BaseClass will be used.
 * @param Object prototype - the sub-class' prototype changes.
 * @param Function instanceInitFn - this will be used as the constructor.  It will also be
 *      added at newClass.prototype.init
 * @param Function classInitFn - the main purpose of this I think is to be a handy place to put
 *      some additional code to run related to the class.  This isn't that helpful yet.
 */
function Define( parentClass, prototype, instanceInitFn, classInitFn ) {

    var F = function(){};
    parentClass = parentClass || BaseClass;

    F.prototype = new parentClass();
    F.prototype.init = instanceInitFn || parentClass && parentClass.init || function(){};

    for ( var k in prototype ) {
        F.prototype[ k ] = prototype[ k ];
    }

    for ( k in parentClass ) {
        if ( parentClass.hasOwnProperty( k ) ) {
            F[ k ] = parentClass[ k ];
        }
    }

    if ( classInitFn ) {
        classInitFn.call( F );
    }

    return F;
}

module.exports = Define;
