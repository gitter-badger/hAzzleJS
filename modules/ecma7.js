/**
 * ecma7.js
 *
 * Note! ECMA 7 ( ecma262 ) not supported by the browsers!
 *
 * Ref: https://github.com/tc39/ecma262
 *
 * This shims contains:
 * --------------------
 *
 * - values
 * - entries
 * - escape
 * - compare
 * - getPropertyNames
 * - getOwnPropertyDescriptors
 * - getPropertyDescriptor
 *
 */
var ObjectCreate = function(proto, internalDataList) {
        return Object.create(proto, internalDataList);
    },

    ToObject = function(v) {
        if (v === null || v === undefined) throw TypeError();
        return Object(v);
    };

if (![].values) {
    Object.defineProperty(Array.prototype, 'values', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(o) {
            return Object.keys(o).map(function(p) {
                return o[p];
            });
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
                i = 0, len = keys.length,
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