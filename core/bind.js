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
    // Replacement for bind() - ECMA-5 15.3.4.5

    var bind = function(callback, context) {

        var
        // Internal slice are faster then native slice

            slice = collection.slice,
            curryArgs = arguments.length > 2 ?
            slice(arguments, 2) : [],
            tmp;

        if (typeof context === 'string') {
            tmp = callback[context];
            context = callback;
            callback = tmp;
        }

        if (typeof callback === 'function' && !(context instanceof RegExp)) {

            return curryArgs.length ? function() {
                return arguments.length ?
                    callback.apply(context || this, curryArgs.concat(slice(arguments, 0))) :
                    callback.apply(context || this, curryArgs);
            } : function() {
                return arguments.length ?
                    callback.apply(context || this, arguments) :
                    callback.call(context || this);
            };

        } else {
            return context;
        }
    };
    // Expose
    return {
        bind: bind
    };
});