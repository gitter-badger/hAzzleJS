// types.js
hAzzle.define('Types', function() {

    var i,
        oString = Object.prototype.toString,
        isArray = Array.isArray,
        twinClasses = {},

        positive = ('Arguments Array Boolean Date Error Function Map Number Object RegExp Set String' +
            'WeakMap ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32Array' +
            'Uint8Array Uint8ClampedArray Uint16Array Uint32Array').split(' '),

        negative = ('ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32Array ' +
            'Uint8Array Uint8ClampedArray Uint16Array Uint32Array').split(' '),

        isString = function(value) {
            return typeof value === 'string';
        },

        isArrayLike = function(value) {
            return (value && typeof value === 'object' && typeof value.length === 'number' &&
                twinClasses[oString.call(value)]) || false;
        },
        isNumber = function(value) {
            return typeof value === 'number';
        },
        isBoolean = function(value) {
            return typeof value === 'boolean';
        },

        isEmpty = function(value) {
            if (value == null) {
                return true;
            }
            if (isArray(value) ||
                isString(value) ||
                isType('Arguments')(value)) {
                return value.length === 0;
            }
            var key;
            for (key in value)
                if (value != null && Object.prototype.hasOwnProperty.call(value, key)) {
                    return false;
                }
            return true;
        },

        isElement = function(value) {
            return !!(value && value.nodeType === 1);
        },
        isNaN = function(value) {
            // `NaN` as a primitive is the only value that is not equal to itself
            return isNumber(value) && value != +value;
        },
        isUndefined = function(value) {
            return typeof value === 'undefined';
        },
        isDefined = function(value) {
            return typeof value !== 'undefined';
        },
        isEmptyObject = function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        isWindow = function(obj) {
            return obj && obj.window === obj;
        },

        // Returns a function that returns `true` if `arg` is of the correct `type`, otherwise `false`.
        // e.g isType('Function')( fn )

        isType = function(type) {
            return type ? function(arg) {
                return oString.call(arg) === '[object ' + type + ']';
            } : function() {};
        },

        isObject = function(value) {
            return value != null && typeof value === 'object';
        },

        isPlainObject = function(obj) {
            return isType(obj) !== 'object' && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
        },

        isNode = function(elem) {
            return !!elem && typeof elem === 'object' && 'nodeType' in elem;
        },
        isNodeList = function(nodes) {
            var result = Object.prototype.toString.call(nodes);
            // Modern browser such as IE9 / firefox / chrome etc.
            if (result === '[object HTMLCollection]' || result === '[object NodeList]') {
                return true;
            }
            // Detect length and item 
            if (!('length' in nodes) || !('item' in nodes)) {
                return false;
            }
            try {
                if (nodes(0) === null || (nodes(0) && nodes(0).tagName)) return true;
            } catch (e) {
                return false;
            }
            return false;
        };

    this.isNodeList = isNodeList;

    i = positive.length;

    while (i--) {
        twinClasses['[object ' + positive[i] + ']'] = true;
    }

    i = negative.length;
    while (i--) {

        twinClasses['[object ' + negative[i] + ']'] = false;
    }

    return {

        isType: isType,
        isArray: isArray,
        isEmpty: isEmpty,
        isWindow: isWindow,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isNode: isNode,
        isElement: isElement,
        isString: isString,
        isArrayLike: isArrayLike,
        isNumber: isNumber,
        isBoolean: isBoolean,
        isNaN: isNaN,
        isDefined: isDefined,
        isUndefined: isUndefined,
        isNodeList: isNodeList
    };
});