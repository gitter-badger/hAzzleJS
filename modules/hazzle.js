/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight & Mehran Hatami
 * Version: 0.9.9d RC3
 * Released under the MIT License.
 *
 * Date: 2014-09-14
 */
(function(global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error('hAzzle requires a window with a document');
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function(window, noGlobal) {

    // Usefull variabels

    var document = window.document,

        docElem = window.document.documentElement,

        // Prototype references.

        ArrayProto = Array.prototype,

        // Save a reference to some core methods

        indexOf = ArrayProto.indexOf,
        concat = ArrayProto.concat,

        // Holds javascript natives

        natives = {},

        // Whitespace regexp for hAzzle.trim()

        trwl = /^\s+|\s+$/g,

        camelCache = [],

        // Define a local copy of hAzzle

        hAzzle = function(selector, context) {

            // Force domReady if the selector is a
            // function

            return typeof selector === 'function' ?
                hAzzle.ready(selector) :
                new Core(selector, context);
        };

    // Access to main function.

    function Core(selector, context) {

        if (!selector) {
            return this;
        }

        if (typeof selector === 'string') {
            selector = hAzzle.find(selector, context); // Instanceof hAzzle
        } else if (selector instanceof hAzzle) {
            return selector;
        } else if (selector.nodeType === 11) { // document fragment
            selector = selector.childNodes;
        } else if (selector.nodeType) { // nodeType
            selector = [selector];
        } else if (hAzzle.isNodeList(selector)) {
            selector = hAzzle.makeArray(selector);
        } else if (hAzzle.isElement(selector) ||
            hAzzle.isDocument(selector) ||
            (selector === window)) {
            selector = [selector];
        }

        if (selector) {

            // Initialize a new hAzzle Object with the
            // given `selector`

            var i = this.length = this.size = selector.length;

            while (i--) {

                this[i] = selector[i];
            }
        }
        return this;
    }

    // Easy access variable for the Prototype function

    hAzzle.Core = Core.prototype = {

        constructor: hAzzle,

        length: 0,

        /**
         * Returns a new array with the result of calling callback on each element of the array
         * @param {function} fn
         * @return {hAzzle}
         */

        twist: function(fn) {
            var elems = this,
                i = 0,
                len = elems.length;
            for (i = len; i--;) {
                return hAzzle(fn(elems[i]));
            }
        },

        /**
         * @param {Function} callback
         * @param {Boolean} reverse
         * @return {hAzzle}
         */

        each: function(callback, reverse) {
            return hAzzle.each(this, callback, reverse);
        },

        /**
         * @param {Function} callback
         * @param {Boolean} rev
         * @return {Array}
         */

        map: function(callback) {
            return hAzzle(hAzzle.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        }
    };

    /**
     * Extend the contents of two objects
     */

    hAzzle.extend = function() {
        var length = arguments.length,
            source = arguments,
            target = arguments[1],
            i = 0,
            k,
            extend = function(target, source) {
                for (k in source) {
                    source.hasOwnProperty(k) && ((target || Core.prototype)[k] = source[k]);
                }
            };

        // Don't do iteration if we can avoid it,
        // better performance

        if (length === 1) {
            extend(target, source[0]);

        } else {

            source = arguments[0];

            for (; i < length; i++) {
                extend(target, arguments[i]);
            }
        }
    };

    hAzzle.extend({

        // A global UID counter for objects

        UID: 1,

        /** 
         * Return current time
         */

        now: Date.now,

        /**
         * Error function
         */

        error: function(msg) {
            throw new Error(msg);
        },

        getID: function(node, name, /* OPTIONAL */ exposed) {

            name = name || 'hAzzle_';

            // if boolean true / false value, we are returning
            // a new UID without attaching it to a object

            if (typeof node === 'boolean') {
                return hAzzle.UID++;
            } else if (typeof node === 'object') {

                // If 'exposed' are true, we are setting the UID as
                // an attribute value on the node,
                // This could be tampered with

                if (exposed) {

                    // Try to get the id

                    var uid = node.getAttribute(hAzzle.UID);

                    if (!uid) {

                        uid = hAzzle.UID++;

                        // Set the new ID

                        node.setAttribute(name, uid);
                    }

                    return uid;
                }

                if (typeof node.hiD === 'undefined') {

                    // Attach the UID directly on a Object

                    node.hiD = name + hAzzle.UID++;
                }

                // tamperFix(node, name);

                return node.hiD;
            }

            // If no boolean or Object, return false;

            return false;
        },

        /**
         * Run callback for each element in the collection
         * @param {Array|Function|Object} obj
         * @param {Function} callback
         * @param {String} context
         * @return {hAzzle}
         */

        each: function(collection, callback, reverse) {

            if (!collection) {
                return;
            }
            var i = 0,
                l = collection.length,
                element = null;

            // Iterate through array	

            if (isArraylike(collection)) {

                if (reverse) {
                    for (i = collection.length - 1; i >= 0; i--) {
                        element = collection[i];
                        if (callback.call(element, element, i) === false) {
                            break;
                        }
                    }
                } else {

                    for (; i < l; i++) {
                        element = collection[i];
                        if (callback.call(element, element, i) === false) {
                            break;
                        }
                    }
                }

                // Iterate through functions

            } else if (typeof collection === 'function') {

                for (i in collection) {

                    if (i != 'prototype' && i != 'length' &&
                        i != 'name' && (!collection.hasOwnProperty ||
                            collection.hasOwnProperty(i))) {
                        element = collection[i];
                        if (callback.call(element, element, i) === false) {

                            break;
                        }
                    }
                }

                // Iterate through 
            } else {

                for (i in collection) {
                    if (collection.hasOwnProperty(i)) {
                        element = collection[i];
                        if (callback.call(element, element, i) === false) {
                            break;
                        }
                    }
                }

            }
            return collection;
        },

        // Convert camelCase to  CSS-style
        // e.g. boxSizing -> box-sizing

        decamelize: function(str) {
            return str ? str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : str;
        },

        /**
         *  Convert dashed to camelCase
         *
         * @param {string} str
         * @return {string}
         */

        camelize: function(property) {
            return camelCache[property] ? camelCache[property] :
                camelCache[property] = property.replace(/-(\w)/g, function(match, subMatch) {
                    return subMatch.toUpperCase();
                });
        },

        /**
         * toString
         */

        str: Object.prototype.toString,

        indexOf: function(elem, arr, i) {

            return arr === null ? -1 : indexOf.call(arr, elem, i);
        },

        /**
         * Check if an element exist in an array
         */

        inArray: function(val, arr, i) {

            var len = arr.length;
            i = i ? i < 0 ? Math.max(0, l + i) : i : 0;

            for (; i < len; i++) {

                if (i in arr && arr[i] === val) {

                    return true;
                }
            }
            return -1;
        },

        map: function(elems, callback, arg) {

            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike(elems),
                ret = [];

            // Go through the array, translating each of the items to their new values

            if (isArray) {

                for (; i < length; i++) {

                    value = callback(elems[i], i, arg);

                    if (value !== null) {
                        ret.push(value);
                    }
                }

                // Go through every key on the object

            } else {

                for (i in elems) {
                    value = callback(elems[i], i, arg);

                    if (value !== null) {
                        ret.push(value);
                    }
                }
            }

            // Flatten any nested arrays

            return concat.apply([], ret);
        },

        /**
         * Faster alternative till native prototype reduce
         *
         * @param {Array} array
         * @param {Function} fn
         * @param {Object} initial value
         */

        reduce: function(arr, callback, val) {

            var rval = val,
                i = 0,
                l = arr.length;

            for (; i < l; i++) {

                rval = callback(rval, arr[i], i, arr);
            }
            return rval;
        },

        isNode: function(node) {

            return node && node.nodeName && (node.nodeType === 1 ||
                node.nodeType === 9 ||
                node.nodeType === 11);
        },

        /**
         * Check if it's an XML or HTML document
         */

        isXML: function(elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== 'HTML' : false;
        },

        /**
         * Return the elements nodeName
         */

        nodeName: function(el, name) {
            return el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase();
        },

        merge: function(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        // Nothing


        noop: function() {},

        /**
         * Return only nodes matching the filter
         *
         * @param {String|nodeType|Function} sel
         * @return {Array}
         
         *
         */

        filter: function(obj, predicate, context) {

            var results = [];

            if (obj === null) {
                return results;
            }

            hAzzle.each(obj, function(value, index, list) {

                if (predicate.call(context, value, index, list)) {

                    results.push(value);
                }
            });

            return hAzzle(results);
        },

        makeArray: function(nodeList) {

            if (nodeList instanceof Array) {
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

        // Loop through Objects

        forOwn: function(obj, iterator, context) {
            var key;
            if (obj === null) return obj;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
            return obj;
        },

        /**
         * Feature detection of elements
         *
         * @param {Function} fn
         * @return {Boolean}
         */

        assert: function(fn) {

            var div = document.createElement('div');

            try {

                return !!fn(div);

            } catch (e) {

                return false;

            } finally {

                // Remove from its parent by default
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                // release memory in IE
                div = null;
            }
        },

        /**
         * Determine the type of object being tested.
         *
         * @param {Mixed} object
         * @return {String} object type
         *
         * NOTE! Use of switch{} here will slow down the
         * performance with 1 -2% in all browsers
         *
         */

        type: function(obj) {
            if (obj == null) {
                return obj + '';
            }
            return typeof obj === 'object' || typeof obj === 'function' ?
                natives[toString.call(obj)] || 'object' :
                typeof obj;

        },

        isSVG: function(elem) {
            return window.SVGElement && (elem instanceof SVGElement);
        },

        hasOwn: natives.hasOwnProperty

    }, hAzzle);

    /**
     * Remove leading and trailing whitespaces of the specified string.
     *
     * @param{String} str
     * @return{String}
     */

    hAzzle.trim = (function() {

        // IE9

        if (!String.prototype.trim) {
            return function(str) {
                return str.replace(trwl, '');
            };
        }
        return function(str) {
            return typeof str === 'string' ? str.trim() : str;
        };
    })();

    function tamperFix(node, name) {
        var tmp = node.hiD.replace(name, '');
        // The counter should be a number
        if (typeof tmp !== 'number') {
            // set a new valid number
            node.hiD = name + hAzzle.UID++;
        }
        return node.hiD;
    }

    //  Checks if `obj` is a window object.

    var isWindow = hAzzle.isWindow = function(obj) {
            return obj !== null && obj === obj.window;
        },

        isArraylike = hAzzle.isArraylike = function(obj) {
            var length = obj.length,
                type;

            if (typeof obj === 'function' || isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            type = hAzzle.type(obj);

            return type === 'array' || length === 0 ||
                typeof length === 'number' && length > 0 && (length - 1) in obj;
        };

    // Expose

    hAzzle.docElem = docElem;

    // Tells if the document are XML or HTML
    // Set to true as default, but it can be
    // overwritten by the document.js module

    hAzzle.documentIsHTML = true;
    hAzzle.natives = natives;

    // Populate the native list

    hAzzle.each(['Boolean',
        'Number',
        'String',
        'Function',
        'Array',
        'Date',
        'RegExp',
        'Object',
        'Error',
    ], function() {
        natives['[object ' + this + ']'] = this.toLowerCase();
    });

    // Expose hAzzle to the global object

    if (typeof noGlobal === 'undefined') {
        window.hAzzle = hAzzle;
    }
    return hAzzle;

}));