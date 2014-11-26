// util.js
hAzzle.define('util', function() {

    var // Dependencies
    
        types = hAzzle.require('types'),
        oKeys = Object.keys,

        // Optimized each function
        // For ECMA 5+ standard, use native forEach()
        each = function(obj, callback, args, /*reverse*/ rev) {
            var i, length;

            if (args) {

                if (typeof obj === 'function') {
                    for (i in obj) {
                        if (i !== 'prototype' && i !== 'length' && i !== 'name') {
                            if (callback.call(obj[i], obj[i], i, args) === false) {
                                break;
                            }
                        }
                    }
                } else if (types.isArrayLike(obj)) {
                    for (; i < length; i++) {
                        i = rev ? obj.length - i - 1 : i;
                        if (callback.apply(obj[i], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        if (callback.apply(obj[i], args) === false) {
                            break;
                        }
                    }
                }
            } else {

                if (obj) {
                    if (typeof obj === 'function') {
                        for (i in obj) {
                            if (i !== 'prototype' && i !== 'length' && i !== 'name') {
                                if (callback.call(obj[i], obj[i], i) === false) {
                                    break;
                                }
                            }
                        }
                    } else if (types.isArray(obj) || types.isArrayLike(obj)) {

                        for (i = 0, length = obj.length; i < length; i++) {
                            i = rev ? obj.length - i - 1 : i;
                            if (callback.call(obj[i], obj[i], i) === false) {
                                break;
                            }
                        }
                    } else {
                        for (i in obj) {
                            if (callback.call(obj[i], obj[i], i) === false) {
                                break;
                            }
                        }
                    }
                }
            }
            return obj;
        },

    createCallback = function(fn, arg, count) {
            if (typeof fn === 'function') {
                if (arg === undefined) {
                return fn;
                }
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

            if (!fn) {
                return function(value) {
                    return value;
                };
            }
        },

        // Determine if at least one element in the object matches a truth test. 
        // ECMA-5 15.4.4.17

        some = function(obj, fn, context) {
            if (obj) {
                fn = iterate(fn, context);

           var keys = obj.length !== +obj.length && oKeys(obj),
               length = (keys || obj).length,
                i = 0, currentKey;

                for (; i < context; i++) {

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

        mixin = function extend() {
            var options, name, src, copy, clone, target = arguments[0],
                i = 1,
                length = arguments.length;

            for (; i < length; i++) {
                if ((options = arguments[i]) !== null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        if (copy && (types.isObject(copy))) {
                            clone = src && types.isObject(src) ? src : {};
                            target[name] = mixin(clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
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

        iterate = function(value, context, argCount) {
            return value ?
                typeof value === 'function' ?
                createCallback(value, context, argCount) :
                types.isObject(value) ?
                matches(value) :
                property(value) :
                function(value) {
                    return value;
                };
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

        unique = function(arr, isSorted, fn, context) {
            if (!arr) {
                return [];
            }
            if (types.isBoolean(isSorted)) {
                context = fn;
                fn = isSorted;
                isSorted = false;
            }
            if (fn !== undefined) {
                fn = iterate(fn, context);
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
        // ECMA-5 15.4.4.14

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

        sortedIndex = function(arr, obj, fn, context) {
            fn = iterate(fn, context, 1);
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
        // ECMA-5 15.4.4.19

        map = function(obj, fn, context) {
            if (obj) {
                fn = iterate(fn, context);
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
        // ECMA-5 15.4.4.21     
        reduce = function(collection, fn, accumulator, args) {

            if (collection) {
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
        // ECMA-5 15.4.4.20  

        filter = function(arr, fn, context) {
            var results = [];
            if (!arr) {
                return results;
            }
            fn = iterate(fn, context);
            each(arr, function(val, index, list) {
                if (fn(val, index, list)) {
                    results.push(val);
                }
            });
            return results;
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
        now: Date.now
    };
});