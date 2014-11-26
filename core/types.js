// types.js
hAzzle.define('Types', function() {

    var oString = Object.prototype.toString,

        // Determines if a reference is an `Array`

        isArray = Array.isArray,

        // Determines if a reference is a `String`

        isString = function(value) {
            return typeof value === 'string';
        },
        // Returns true if `obj` is an array or array-like object (NodeList, Arguments, String ...)
        isArrayLike = function(obj) {
            if (obj == null || isWindow(obj)) {
                return false;
            }

            var length = obj.length;

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return isString(obj) || isArray(obj) || length === 0 ||
                typeof length === 'number' && length > 0 && (length - 1) in obj;
        },
        isNumber = function(value) {
            return typeof value === 'number';
        },
        isNumeric = function( obj ) {
		return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
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

        isElement = function(node) {
            return !!(node && node.nodeName // we are a direct element
            );
        },
        isNaN = function(value) {
            // `NaN` as a primitive is the only value that is not equal to itself
            return isNumber(value) && value != +value;
        },
        // Determines if a reference is undefined
        isUndefined = function(value) {
            return typeof value === 'undefined';
        },
        // Determines if a reference is defined
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
        // Checks if `obj` is a window object
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

        // Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
        // considered to be objects. Note that JavaScript arrays are objects.

        isObject = function(value) {
            // http://jsperf.com/isobject4
            return value !== null && typeof value === 'object';
        },

        isPlainObject = function(obj) {
            return isType('Object')(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
        },

        isPromiseAlike = function(object) {
            return isObject(object) && typeof object.then === 'function';
        },

        isNode = function(elem) {
            return !!elem && typeof elem === 'object' && 'nodeType' in elem;
        },
        isNodeList = function(elem) {
            var result = Object.prototype.toString.call(elem);
            // Modern browser such as IE9 / firefox / chrome etc.
            if (result === '[object HTMLCollection]' ||
                result === '[object NodeList]' ||
                // https://developer.mozilla.org/en/docs/Web/API/HTMLFormControlsCollection
                result === '[object HTMLFormControlsCollection]') {
                return true;
            }
            // Detect length and item 
            if (!('length' in elem) || !('item' in elem)) {
                return false;
            }
            try {
                if (elem(0) === null || (elem(0) && elem(0).tagName)) return true;
            } catch (e) {
                return false;
            }
            return false;
        },
        // Check for SVG namespace
        isSVGElem = function(elem) {
            return (elem.nodeType === 1 && elem.namespaceURI === 'http://www.w3.org/2000/svg') ||
                window.SVGElement && (elem instanceof window.SVGElement);
        };

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
        isSVGElem:isSVGElem,
        isDefined: isDefined,
        isUndefined: isUndefined,
        isNodeList: isNodeList,
        
        // This method are *only* added here to do it easier for developers
       
        isFunction: isType('Function')
    };
});