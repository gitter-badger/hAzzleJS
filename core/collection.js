// collection.js
hAzzle.define('Collection', function() {

    var
    // Dependencies

        util = hAzzle.require('util'),
        types = hAzzle.require('types'),
        arrayProto = Array.prototype,
        aConcat = arrayProto.concat,
        aPush = arrayProto.push,
        
        // Create array
        
        makeArray = function(arr, results) {
            var ret = results || [];
            if (arr !== undefined) {
                if (types.isArrayLike(Object(arr))) {
                    util.merge(ret, types.isString(arr) ? [arr] : arr);
                } else {
                    aPush.call(ret, arr);
                }
            }

            return ret;
        },
        
        // Replacement for native slice ( better performance)
        
        slice = function(array, start, end) {
           
           start = typeof start === 'undefined' ? 0 : start;

            var index = -1,
                length = (typeof end === 'undefined' ? (array ? array.length : 0) : end) - start || 0,
                result = Array(length < 0 ? 0 : length);

            while (++index < length) {
                result[index] = array[start + index];
            }
            return result;
        };

    // Convert hAzzle '.elements Array' to a jQuery / Zepto array
    // where 'this' contains the elements. The '.elements Array 
    // will be kept, but it will be possible to run jQuery / Zepto functions

    this.toJqueryZepto = function() {
        var i = this.length;
        while (i--) {
            this[i] = this.elements[i];
        }
        return this;
    };

    // Return an array or a specific DOM element matched by the hAzzle object

    this.get = function(index) {
        return index === undefined ?
            slice(index, 0) :
            index < 0 ?
            this.elements[this.length + index] :
            this.elements[index];
    };

    // Get the element at position specified by index from the current collection.
    
    this.eq = function(index) {
        var len = this.length,
            j = +index + (index < 0 ? len : 0);
        return hAzzle(j >= 0 && j < len ? [this.elements[j]] : []);
    };

    this.reduce = function(fn, accumulator, args) {
        return util.reduce(this.elements, fn, accumulator, args);
    };

    this.indexOf = function(elem, arr, i) {
        return arr == null ? -1 : arrayProto.indexOf.call(arr, elem, i);
    };

    this.map = function(fn, args) {
        return hAzzle(util.map(this.elements, fn, args));
    };

    this.each = function(fn, args, /*reverse*/ rev) {
        util.each(this.elements, fn, args, rev);
        return this;
    };

    this.slice = function(start, end) {
        return hAzzle(slice(this.elements, start, end));
    };

    // Concatenate two elements lists

    this.concat = function() {
        var args = util.map(slice(arguments), function(arr) {
            return arr instanceof hAzzle ? arr.elements : arr;
        });
        return hAzzle(aConcat.apply(this.elements, args));
    };

    // Get the children of each element in the set of matched elements, 
    // including text and comment nodes.

    this.contents = function() {
        return this.map(function() {
            return this.contentDocument || slice(this.childNodes) || [];
        });
    };

    // Check the current matched set of elements against a selector, element, or 
    // hAzzle object and return true if at least one of these elements matches the given arguments.

    this.is = function(sel) {
        return sel ? this.length > 0 && this.filter(sel).length > 0 : false;
    };

    // Remove elements from the set of matched elements

    this.not = function(sel) {
        return this.filter(sel, true);
    };

    // Search for a given element from among the matched elements

    this.index = function(node) {
        var els = this.elements;
        if (!node) {
            return (els[0] && els[0].parentElement) ? this.first().prevAll().length : -1;
        }

        // Index in selector
        if (typeof node === 'string') {
            return util.indexOf(hAzzle(node).elements, els[0]);
        }

        // Locate the position of the desired element
        return util.indexOf(els, node instanceof hAzzle ? node.elements[0] : node);
    };
    // Concatenate new elements to the '.elements array
    // Similar to jQuery / Zepto's .add() method

    this.add = function(sel, ctx) {
        return this.concat(typeof sel === 'string' ? hAzzle(sel, ctx).elements : sel);
    };

    // Reduce the set of matched elements to the first in the set, or 
    // to the 'num' first element in the set

    this.first = function(num) {
        return num ? this.slice(0, num) : this.eq(0);
    };

    // Reduce the set of matched elements to the final one in the set, or 
    // to the 'num' last element in the set
    this.last = function(num) {
        return num ? this.slice(this.length - num) : this.eq(-1);
    };

    this.next = function(sel) {
        return this.map(function() {
            return this.nextElementSibling;
        }).filter(sel);
    };

    this.prev = function(sel) {
        return this.map(function() {
            return this.previousElementSibling;
        }).filter(sel);
    };
    
    // Get all preceding siblings of each element in 
    // the set of matched elements, optionally filtered by a selector
    
    this.prevAll = function() {
        var matched = [];
        this.each(function(elem) {
            while ((elem = elem.previousElementSibling) && 
                    elem.nodeType !== 9) {
                matched.push(elem);
            }
        });
        return hAzzle(matched);
    };
    // Get all following siblings of each element in 
    // the set of matched elements, optionally filtered by a selector.

    this.nextAll = function() {
        var matched = [];
        this.each(function(elem) {
            while ((elem = elem.nextElementSibling) && 
                    elem.nodeType !== 9) {
                matched.push(elem);
            }
        });
        return hAzzle(matched);
    };

    // Return 'even' elements from the '.elements array'
    this.even = function() {
        return this.filter(function(i) {
            return i % 2 !== 0;
        });
    };
    // Return 'odd' elements from the '.elements array'

    this.odd = function() {
        return this.filter(function(i) {
            return i % 2 === 0;
        });
    };
    // Native prototype methods that return a usable value (ECMA 5+)
    this.shift = function() {
        return this.elements.shift.apply(this.elements, arguments);
    };
    this.lastIndexOf = function() {
        return this.elements.lastIndexOf.apply(this.elements, arguments);
    };
    this.reduceRight = function() {
        return this.elements.rediceRight.apply(this.elements, arguments);
    };
    this.forEach = function() {
        return this.elements.forEach.apply(this.elements, arguments);
    };
    this.splice = function() {
        return this.elements.splice.apply(this.elements, arguments);
    };

    return {
        makeArray: makeArray,
        slice: slice
    };
});