// System.js - Collection of system functions for hAzzle Core
var push = Array.prototype.push;
hAzzle.extend({

    mergeArray: function(array, results) {
var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = hAzzle.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || hAzzle.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				hAzzle.merge( ret, array );
			}
		}

        return ret;
    },

    // Get size of Array or Objects

    size: function(obj, ownPropsOnly) {
        var count = 0,
            key;

        if (hAzzle.isArray(obj) || hAzzle.isString(obj)) {
            return obj.length;
        } else if (hAzzle.isObject(obj)) {
            for (key in obj) {
                if (!ownPropsOnly || obj.hasOwnProperty(key)) {
                    count++;
                }
            }
        }

        return count;
    },

    // Swap properties

    swap: function(elem, options, callback, args) {
        var ret, name,
            old = {};

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
            elem.style[name] = old[name];
        }

        return ret;
    },

    /**
     * Simple function for copy one object over
     * to another object
     */

    shallowCopy: function() {

        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {

            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && !hAzzle.isFunction(target)) {

            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            if ((options = arguments[i]) !== null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays

                    if (deep && copy && (hAzzle.isPlainObject(copy) || (copyIsArray = hAzzle.isArray(copy)))) {

                        if (copyIsArray) {

                            copyIsArray = false;
                            clone = src && hAzzle.isArray(src) ? src : [];

                        } else {

                            clone = src && hAzzle.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = hAzzle.extend(deep, clone, copy);

                        // Don't bring in undefined values

                    } else if (copy !== undefined) {

                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },

    /*
     * Finds the elements of an array which satisfy a filter function.
     */

    grep: function(elems, callback, invert) {
        var callbackInverse,
            matches = [],
            i = 0,
            length = elems.length,
            callbackExpect = !invert;

        for (; i < length; i++) {

            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
            }
        }

        return matches;
    },
    /**
     * Bind a function to a context, optionally partially applying any
     *
     * @param {Function} fn
     * @param {Object} context
     */

    bind: function(fn, context) {

        var tmp, args, proxy;

        if (typeof context === 'string') {

            tmp = fn[context];
            context = fn;
            fn = tmp;
        }

        if (typeof fn !== 'function') {
            return undefined;
        }

        // Simulated bind
        args = slice.call(arguments, 2);

        proxy = function() {

            return fn.apply(context || this, args.concat(slice.call(arguments)));
        };

        proxy.guid = fn.guid = fn.guid || hAzzle.getID(true, 'proxy_') + ' ';

        return proxy;
    },

    // Special detection for IE, because we got a lot of trouble
	// with it. Damn IE!!

    ie: (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {

            hAzzle.assert(function(div) {

                for (var i = 7; i > 4; i--) {

                    div.innerHTML = '<!--[if IE ' + i + ']><span></span><![endif]-->';

                    if (div.getElementsByTagName('span').length) {

                        return i;
                    }
                }
            });
        }

        return undefined;
    })(),
	
	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script = document.createElement( 'script' );
		script.text = code;
		document.head.appendChild( script ).parentNode.removeChild( script );
	}

}, hAzzle);