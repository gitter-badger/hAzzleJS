// util.js
hAzzle.define('util', function() {

    var // Modules
        aSlice = Array.prototype.slice,
        types = hAzzle.require('types'),
        oKeys = Object.keys,

        // Optimized each function
        // Replacement for forEach - ECMAScript 5 15.4.4.18 

        each = function(obj, fn, args, /*reverse*/ rev) {

            if (obj === undefined || obj == null) {
                return obj;
            }

            hAzzle.err(typeof fn !== 'function', 5, "'fn' must be a function in util.each()");

            var i, length = obj.length,
                key;

            if (typeof fn === 'function' &&
                typeof args === 'undefined' &&
                typeof rev === 'undefined' &&
                types.isArray(obj)) {

                while (++i < length) {
                    i = rev ? obj.length - i - 1 : i;
                    if (fn.call(obj[i], obj[i], i, obj) === false) {
                        break;
                    }
                }
            }

            if (length === +length) {
                for (i = 0; i < length; i++) {
                    i = rev ? obj.length - i - 1 : i;
                    if (fn.call(obj[i], obj[i], i, obj) === false) {
                        break;
                    }
                }
            } else {
                if (obj) {
                    for (key in obj) {
                        if (fn.call(obj[key], obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },

        createCallback = function(fn, arg, count) {
            if (typeof fn === 'function') {
                if (arg === undefined) return fn;
                count = !count ? 3 : count;
                return count === 1 ? function(value) {
                        return fn.call(arg, value);
                    } : count === 2 ?
                    function(value, other) {
                        return fn.call(arg, value, other);
                    } : count === 3 ?
                    function(value, index, collection) {
                        return fn.call(arg, value, index, collection);
                    } : count === 4 ?
                    function(accumulator, value, index, collection) {
                        return fn.call(arg, accumulator, value, index, collection);
                    } : function() {
                        return fn.apply(arg, arguments);
                    };
            }

            if (!fn) return identity;
        },

        // Determine if at least one element in the object matches a truth test. 
        // ECMAScript 5 15.4.4.17

        some = function(obj, fn, ctx) {
            if (obj) {
                fn = iterate(fn, ctx);

                ctx = (keys || obj).length;

                var keys,
                    i = 0,
                    currentKey;

                if (obj.length !== +obj.length) {
                    keys = keys(obj);
                }

                for (; i < ctx; i++) {

                    if (keys) {
                        currentKey = keys[i];
                    } else {
                        currentKey = i;
                    }
                    if (fn(obj[currentKey], currentKey, obj)) {
                        return true;
                    }
                }
            }
            return false;
        },
        merge = function(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        // Extends the destination object `obj` by copying all of the 
        // properties from the `src` object(s)

        mixin = function(obj) {
            if (types.isObject(obj)) {
                var source, prop, i = 1,
                    length = arguments.length;

                for (; i < length; i++) {
                    source = arguments[i];
                    for (prop in source) {
                        if (Object.prototype.hasOwnProperty.call(source, prop)) {
                            obj[prop] = source[prop];
                        }
                    }
                }
            }
            return obj;
        },
        makeArray = function(nodeList) {

            if (types.isArray(nodeList)) {
                return nodeList;
            }

            var index = -1,
                length = nodeList.length,
                array = Array(length);

            while (++index < length) {
                array[index] = nodeList[index];
            }
            return array;
        },

        iterate = function(value, ctx, argCount) {
            return value ?
                typeof value === 'function' ?
                createCallback(value, ctx, argCount) :
                types.isObject(value) ?
                matches(value) :
                property(value) :
                identity;
        },
        // Keep the identity function around for default iteratees.
        identity = function(value) {
            return value;
        },

        // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
        matches = function(attrs) {

            var prs = pairs(attrs),
                length = prs.length;

            return function(obj) {

                if (!obj) {
                    return !length;
                }
                obj = new Object(obj);
                var i = 0,
                    pair, key;
                for (; i < length; i++) {
                    pair = prs[i];
                    key = pair[0];
                    if (pair[1] !== obj[key] || !(key in obj)) {
                        return false;
                    }
                }
                return true;
            };
        },

        // Convert an object into a list of `[key, value]` pairs.
        pairs = function(obj) {
            var keys = oKeys(obj),
                length = keys.length,
                pairs = Array(length),
                i = 0;
            for (; i < length; i++) {
                pairs[i] = [keys[i], obj[keys[i]]];
            }
            return pairs;
        },

        property = function(key) {
            return function(obj) {
                return obj[key];
            };
        },

        unique = function(arr, isSorted, fn, ctx) {
            if (!arr) {
                return [];
            }
            if (types.isBoolean(isSorted)) {
                ctx = fn;
                fn = isSorted;
                isSorted = false;
            }
            if (fn !== undefined) {
                fn = iterate(fn, ctx);
            }

            var result = [],
                seen = [],
                i = 0,
                value,
                length = arr.length;

            for (; i < length; i++) {
                value = arr[i];
                if (isSorted) {
                    if (!i || seen !== value) {
                        result.push(value);
                    }
                    seen = value;
                } else if (fn) {
                    var computed = fn(value, i, arr);
                    if (indexOf(seen, computed) < 0) {
                        seen.push(computed);
                        result.push(value);
                    }
                } else if (indexOf(result, value) < 0) {
                    result.push(value);
                }
            }
            return result;
        },

        // Replacement for indexOf
        // ECMAScript 5 15.4.4.14

        indexOf = function(arr, item, isSorted) {

            if (arr == null) {
                return -1;
            }

            var i = 0,
                length = arr.length;

            if (isSorted) {
                if (typeof isSorted === 'number') {

                    if (isSorted < 0) {
                        i = Math.max(0, length + isSorted);
                    } else {
                        i = isSorted;
                    }

                } else {
                    i = sortedIndex(arr, item);
                    return arr[i] === item ? i : -1;
                }
            }
            for (; i < length; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        sortedIndex = function(arr, obj, fn, ctx) {
            fn = iterate(fn, ctx, 1);
            var value = fn(obj),
                low = 0,
                high = arr.length;
            while (low < high) {
                var mid = low + high >>> 1;
                if (fn(arr[mid]) < value) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            return low;
        },

        // Return the results of applying the callback to each element.
        // ECMAScript 5 15.4.4.19

 map = function(obj, fn, ctx) {
            if (obj) {
                fn = iterate(fn, ctx);
                var keys = obj.length !== +obj.length && oKeys(obj),
                    length = (keys || obj).length,
                    results = Array(length),
                    currentKey, index = 0;
                for (; index < length; index++) {
                    currentKey = keys ? keys[index] : index;
                    results[index] = fn.call(obj[currentKey], obj[currentKey], currentKey, obj);
                }
                return results;
            }
            return [];
        },
        // Reduces a collection
        // ECMAScript 5 15.4.4.21     
        reduce = function(collection, fn, accumulator, args) {

            if (!collection) {
                collection = [];
            }

            fn = createCallback(fn, args, 4);

            var keys = collection.length !== +collection.length && oKeys(collection),
                length = (keys || collection).length,
                index = 0,
                currentKey;

            if (arguments.length < 3) {
                hAzzle.err(!length, 7, ' no collection length exist in collection.reduce()');
                accumulator = collection[keys ? keys[index++] : index++];
            }
            for (; index < length; index++) {
                currentKey = keys ? keys[index] : index;
                accumulator = fn(accumulator, collection[currentKey], currentKey, collection);
            }
            return accumulator;
        },

        // Return the elements nodeName

        nodeName = function(el, name) {
            return name && el && el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase();
        },

        // Native solution for filtering arrays. 
        // ECMAScript 5 15.4.4.20  

        filter = function(arr, fn, ctx) {
            var results = [];
            if (!arr) {
                return results;
            }
            fn = iterate(fn, ctx);
            each(arr, function(val, index, list) {
                if (fn(val, index, list)) {
                    results.push(val);
                }
            });
            return results;
        },
        // Bind a function to a ctx, optionally partially applying any
        // Replacement for bind() - ECMAScript 5 15.3.4.5

        bind = function(fn, ctx) {

            var curryArgs = arguments.length > 2 ?
                aSlice.call(arguments, 2) : [],
                tmp;

            if (typeof ctx === 'string') {

                tmp = fn[ctx];
                ctx = fn;
                fn = tmp;
            }

            if (typeof fn === 'function' && !(ctx instanceof RegExp)) {

                return curryArgs.length ? function() {
                    return arguments.length ?
                        fn.apply(ctx || this, curryArgs.concat(aSlice.call(arguments, 0))) :
                        fn.apply(ctx || this, curryArgs);
                } : function() {
                    return arguments.length ?
                        fn.apply(ctx || this, arguments) :
                        fn.call(ctx || this);
                };

            } else {
                return ctx;
            }
        };

    return {
        map: map,
        some: some,
        reduce: reduce,
        each: each,
        mixin: mixin,
        makeArray: makeArray,
        merge: merge,
        nodeName: nodeName,
        unique: unique,
        indexOf: indexOf,
        filter: filter,
        now: Date.now,
        bind: bind
    };
});