// bind.js
// Overwrite native Function.prototype.bind() with a faster solution,
// and make it PhantomJS compatible
Function.prototype.bind = function() {
    var funcObj = this,
        slice = Array.prototype.slice,
        original = funcObj,
        extraArgs = slice.call(arguments),
        thisObj = extraArgs.shift(),
        func = function() {
            var thatObj = thisObj;
            return original.apply(thatObj, extraArgs.concat(
                slice.call(
                    arguments, extraArgs.length
                )
            ));
        };
    func.bind = function() {
        var args = slice.call(arguments);
        return Function.prototype.bind.apply(funcObj, args);
    };
    return func;
};

hAzzle.define('bind', function() {

    // Dependencies    

    var collection = hAzzle.require('collection');

    // Bind a function to a context, optionally partially applying any
    // Replacement for bind() - ECMAScript 5 15.3.4.5

    var bind = function(fn, context) {

        var curryArgs = arguments.length > 2 ?
            collection.slice(arguments, 2) : [],
            tmp;

        if (typeof context === 'string') {

            tmp = fn[context];
            context = fn;
            fn = tmp;
        }

        if (typeof fn === 'function' && !(context instanceof RegExp)) {

            return curryArgs.length ? function() {
                return arguments.length ?
                    fn.apply(context || this, curryArgs.concat(collection.slice(arguments, 0))) :
                    fn.apply(context || this, curryArgs);
            } : function() {
                return arguments.length ?
                    fn.apply(context || this, arguments) :
                    fn.call(context || this);
            };

        } else {
            return context;
        }
    };
    return {
        bind: bind
    };
});