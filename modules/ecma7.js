/**
 * ecma7.js
 *
 * Note! ECMA 7 ( ecma262 ) not supported by the browsers!
 *
 * Ref: https://people.mozilla.org/~jorendorff/es6-draft.html
 *
 * Current proposals: https://github.com/tc39/ecma262
 *
 * NOTE! If you want to add something here, make sure it's has a
 * value for hAzzle - e.g. many devs can have benefits of it in writing modules
 *
 * This shims contains:
 * --------------------
 *
 * - entries
 * - escape
 * - compare
 * - at
 * - getPropertyNames
 * - getOwnPropertyDescriptors
 * - getPropertyDescriptor
 *
 */
var _isNaN = function(value) {
        // `NaN` as a primitive is the only value that is not equal to itself
        return typeof value === 'number' && value != +value;
    },
    ObjectCreate = function(proto, internalSlotsList) {
        return Object.create(proto, internalSlotsList);
    },
    // Ecma 7.1.13
    ToObject = function(v) {
        if (v === null || v === undefined) {
            throw TypeError();
        }
        return Object(v);
    },
    ToInteger = function(n) {
        n = Number(n);
        if (_isNaN(n)) {
            return 0;
        }
        if (n === 0 || n === Infinity || n === -Infinity) {
            return n;
        }
        return ((n < 0) ? -1 : 1) * Math.floor(Math.abs(n));
    };

// ABSTRACT OPERATIONS 

// Ecma 7.1.13 
if (![].ToObject) {
    Object.defineProperty(Array.prototype, 'ToObject', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: ToInteger
    });
}

// Ecma 7.1.4
if (![].ToInteger) {
    Object.defineProperty(Array.prototype, 'ToInteger', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: ToInteger
    });
}

// Ecma 7.1.5
if (![].ToLength) {
    Object.defineProperty(Array.prototype, 'ToLength', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(v) {

            var len = ToInteger(v);
            if (len <= 0) {
                return 0;
            }
            return Math.min(len, 0x20000000000000 - 1); // 2^53-1
        }
    });
}


// Ecma 7.1.6
if (![].ToUint32) {
    Object.defineProperty(Array.prototype, 'ToUint32', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(v) {
            return v >>> 0;
        }
    });
}

// http://esdiscuss.org/topic/regexp-escape
if (![].escape) {
    Object.defineProperty(Array.prototype, 'escape', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(str) {
            return String(str).replace(/[^a-zA-Z0-9]/g, '\\$&');
        }
    });
}

if (![].entries) {
    Object.defineProperty(Array.prototype, 'entries', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(o) {
            return Object.keys(o).map(function(p) {
                return [p, o[p]];
            });
        }
    });
}

// http://wiki.ecmascript.org/doku.php?id=strawman:number_compare

if (![].compare) {
    Object.defineProperty(Array.prototype, 'compare', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(first, second, tolerance) {
            var difference = first - second;
            return Math.abs(difference) <= (tolerance || 0) ? 0 : difference < 0 ? -1 : 1;
        }
    });
}
// http://wiki.ecmascript.org/doku.php?id=harmony:extended_object_api
if (![].getPropertyNames) {
    Object.defineProperty(Array.prototype, 'getPropertyNames', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(o) {
            var names = ObjectCreate(null);
            do {
                Object.getOwnPropertyNames(o).forEach(function(name) {
                    names[name] = true;
                });
                o = Object.getPrototypeOf(o);
            } while (o);
            return Object.keys(names);
        }
    });
}
// http://wiki.ecmascript.org/doku.php?id=harmony:extended_object_api
if (![].getPropertyDescriptor) {
    Object.defineProperty(Array.prototype, 'getPropertyDescriptor', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(o, p) {
            do {
                var desc = Object.getOwnPropertyDescriptor(o, p);
                if (desc) {
                    return desc;
                }
                o = Object.getPrototypeOf(o);
            } while (o);
            return undefined;
        }
    });
}

if (![].getOwnPropertyDescriptors) {
    Object.defineProperty(Array.prototype, 'getOwnPropertyDescriptors', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(o) {
            var obj = ToObject(o),
                keys = Object.getOwnPropertyNames(obj),
                i = 0,
                len = keys.length,
                descriptors = {};
            for (; i < len; ++i) {
                var nextKey = keys[i],
                    desc = Object.getOwnPropertyDescriptor(obj, nextKey);
                descriptors[nextKey] = desc;
            }
            return descriptors;
        }
    });
}

if (![].at) {
    Object.defineProperty(Array.prototype, 'at', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(pos) {
            var s = String(this),
                position = ToInteger(pos),
                size = s.length;
            if (position < 0 || position >= size) {
                return '';
            }
            var first = s.charAt(position),
                cuFirst = first.charCodeAt(0);

            if (cuFirst < 0xD800 || cuFirst > 0xDBFF || position + 1 === size) {
                return first;
            }
            var cuSecond = s.charCodeAt(position + 1);
            if (cuSecond < 0xDC00 || cuSecond > 0xDFFF) {
                return first;
            }
            return String.fromCharCode(cuFirst, cuSecond);
        }
    });
}