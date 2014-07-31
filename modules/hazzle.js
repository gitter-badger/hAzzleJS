/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight & Mehran Hatami
 * Version: 0.9.7b RC2
 * Released under the MIT License.
 *
 * Date: 2014-07-30
 */

(function (global, factory) {

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error('hAzzle requires a window with a document');
        }
        return factory(w);
    };
  } else {
    factory(global);
  }

  // Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {

  // Usefull variabels

  var document = window.document,


    // Prototype references.

    ArrayProto = Array.prototype,

    // Save a reference to some core methods

    indexOf = ArrayProto.indexOf,
    concat = ArrayProto.concat,

    // Holds javascript natives

    natives = {},

    nl = ['Boolean',
      'String',
      'Function',
      'Array',
      'Date',
      'RegExp',
      'Object',
      'Error',
      'Arguments'
    ],

    i = nl.length,

    // Left and right whitespace regexp for hAzzle.trim()

    trwl = /^\s\s*/,
    trwr = /\s\s*$/,

    // Define a local copy of hAzzle

    hAzzle = function (selector, context) {

      // Force domReady if the selector is a
      // function

      return typeof selector === 'function' ?
        hAzzle.domReady.add(selector) :
        new Core(selector, context);
    };

  // Access to main function.

  function Core(selector, context) {

    if (!selector) {
      return this;
    }

    if (typeof selector === 'string') {

      selector = hAzzle.find(selector, context);

      // Instanceof hAzzle          

    } else if (selector instanceof hAzzle) {

      return selector;

      // document fragment

    } else if (selector.nodeType === 11) {

      // collect the child nodes
      selector = selector.childNodes;

      // nodeType			

    } else if (selector.nodeType) {

      selector = [selector];

    } else if (hAzzle.isNodeList(selector)) {

      selector = hAzzle.makeArray(selector);

      // Wrap DOM nodes.

    } else if (hAzzle.isElement(selector) || hAzzle.isDocument(selector) || (selector.window === selector)) {

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

    twist: function (fn) {
      var elems = this,
        i = 0,
        len = elems.length;
      for (i = len; i--;) {
        return hAzzle(fn(elems[i]));
      }
    },

    /**
     * @param {function} callback
     * @param {Object} args
     * @return {hAzzle}
     */

    each: function (callback, args) {
      return hAzzle.each(this, callback, args);
    },

    /**
     * @param {Function} callback
     * @param {Object} args
     * @return {hAzzle}
     */

    deepEach: function (callback, args) {

      return hAzzle.deepEach(this, callback, args);
    },

    /**
     * @param {Function} callback
     * @return {Array}
     */

    map: function (callback) {
      return hAzzle(hAzzle.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      }));
    }
  };

  /**
   * Extend the contents of two objects
   */

  hAzzle.extend = function () {
    var destination = arguments[0],
      source = arguments[1],
      property;
    for (property in destination) {
      // Objects only
      if (destination[property] && destination[property].constructor && typeof destination[property] === 'object') {
        (source || Core.prototype)[property] = destination[property] || {};
      } else {
        if (destination.hasOwnProperty(property)) {
          (source || Core.prototype)[property] = destination[property];
        }
      }
    }
  };

  hAzzle.extend({

    // documentElement after adjustments
    // Note! This can / will be overwritten 
    // by the document.js module

    docElem: window.document.documentElement,

    // Tells if the document are XML or HTML
    // Set to true as default, but it can be
    // overwritten by the document.js module

    documentIsHTML: true,

    /** 
     * Return current time
     */

    now: Date.now,

    /**
     * Error function
     */

    error: function (msg) {
      throw new Error(msg);
    },

    /**
     * Run callback for each element in the collection
     * @param {Array|Function|Object} obj
     * @param {Function} callback
     * @param {String} context
     * @return {hAzzle}
     */

    each: function (obj, callback, context) {

      var i = 0,
        l = obj.length;

      // Iterate through array	

      if (isArraylike(obj)) {

        for (; i < l; i++) {
          if (callback.call(obj[i], obj[i], i) === false) {
            break;
          }
        }

        // Iterate through functions

      } else if (typeof obj === 'function') {

        for (i in obj) {

          if (i != 'prototype' && i != 'length' &&
            i != 'name' && (!obj.hasOwnProperty ||
              obj.hasOwnProperty(i))) {

            if (callback.call(context, obj[i], i) === false) {

              break;
            }
          }
        }

        // Iterate through objects

      } else {

        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (callback.call(context, obj[i], i) === false) {
              break;
            }
          }
        }

      }
      return obj;
    },

    /**
     * @param {Array} obj
     * @param {function} callback
     * @param {Object} context
     * @return {hAzzle|Array}
     */

    deepEach: function (obj, callback, context) {
      var i = 0,
        l = obj.length;

      for (; i < l; i++) {

        if (obj[i].nodeName && (obj[i].nodeType === 1 ||
          obj[i].nodeType === 11)) {

          hAzzle.deepEach(obj[i].childNodes, callback, context);

          callback.call(context || obj[i], obj[i], i, obj);
        }
      }
      return obj;
    },

    // Convert camelCase to  CSS-style
    // e.g. boxSizing -> box-sizing

    decamelize: function (str) {

      return str ? str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : str;
    },

    /**
     *  Convert dashed to camelCase
     *
     * @param {string} str
     * @return {string}
     */

    camelize: function (str) {

      return str.replace(/-(.)/g, function (matches, letter) {
        return letter.toUpperCase();
      });
    },

    /**
     * toString
     */

    str: Object.prototype.toString,

    indexOf: function (elem, arr, i) {

      return arr === null ? -1 : indexOf.call(arr, elem, i);
    },

    /**
     * Check if an element exist in an array
     */

    inArray: function (array, value, index) {

      if (!array) {

        return;
      }

      var i = (index || 0),
        m = array.length;

      for (; i < m; i++) {

        if (array[i] === value) {

          return i;

        }
      }
      return -1;
    },

    map: function (elems, callback, arg) {

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

    reduce: function (arr, callback, val) {

      var rval = val,
        i = 0,
        l = arr.length;

      for (; i < l; i++) {

        rval = callback(rval, arr[i], i, arr);
      }
      return rval;
    },

    isNode: function (node) {

      return node && node.nodeName && (node.nodeType === 1 ||
        node.nodeType === 9 ||
        node.nodeType === 11);
    },

    /**
     * Check if it's an XML or HTML document
     */

    isXML: function (elem) {
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== 'HTML' : false;
    },

    /**
     * Return the elements nodeName
     */

    nodeName: function (el, name) {
      return el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase();
    },

    merge: function (first, second) {
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


    noop: function () {},

    /**
     * Return only nodes matching the filter
     *
     * @param {String|nodeType|Function} sel
     * @return {Array}
     
     *
     */

    filter: function (obj, predicate, context) {

      var results = [];

      if (obj === null) {

        return results;
      }

      hAzzle.each(obj, function (value, index, list) {

        if (predicate.call(context, value, index, list)) {

          results.push(value);
        }
      });

      return hAzzle(results);
    },

    makeArray: function (nodeList) {

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

    forOwn: function (obj, iterator, context) {
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

    assert: function (fn) {

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

    type: function (obj) {

      var type = typeof obj,
        str;

      if (obj === null) {

        return obj + '';
      }

      if (type === 'boolean') {

        return 'boolean';
      }
      if (type === 'object') {

        return 'object';
      }
      if (type === 'string') {

        return 'string';
      }

      str = hAzzle.str.call(obj);

      if (natives[str]) {

        return natives[str];
      }

      return type;

    },
    hasOwn: natives.hasOwnProperty
  }, hAzzle);

  /**
   * Remove empty whitespace from beginning and end of a string
   *
   * @param{String} str
   * @return{String}
   *
   * String.prototype.trim() are only supported in IE9+ Standard mode.
   */

  hAzzle.trim = (function () {

    if (!String.prototype.trim) {
      return function (value) {
        return typeof value === 'string' ? value.replace(trwl, '').replace(trwr, '') : value;
      };
    }
    return function (value) {
      return typeof value === 'string' ? value.trim() : value;
    };
  })();


  //  Checks if `obj` is a window object.

  var isWindow = hAzzle.isWindow = function (obj) {

      return obj !== null && obj === obj.window;
    },

    isArraylike = hAzzle.isArraylike = function (obj) {
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

  /* =========================== INTERNAL ========================== */

  // Populate the native list

  while (i--) {

    natives['[object ' + nl[i] + ']'] = nl[i].toLowerCase();
  }

  // Expose hAzzle to the global object

  if (typeof noGlobal === 'undefined') {
    window.hAzzle = window.hAzzle = hAzzle;
  }


  return hAzzle;

}));