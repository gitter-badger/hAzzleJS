/*!
 * DOM walker & getters
 */
var
// Prototype references.

    ArrayProto = Array.prototype,

    // Save a reference to some core methods

    indexOf = ArrayProto.indexOf,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,

    // Usefull regex

    parpreunall = /^(?:parents|prev(?:Until|All))/,

    specials = {},

    /**
     * Optimized map method for selector filtering
     *
     * @param {Array} arr
     * @param {Function} fn
     * @param {String} scope
     * @param {hAzzle}
     *
     */
    map = function(arr, fn, scope) {
        var value,
            i = arr.length,
            ret = [];

        while (i--) {

            value = fn(arr[i], i, scope);

            if (value !== null) {
                ret.push(value);
            }
        }
        // Flatten any nested arrays
        return concat.apply([], ret);
    };

hAzzle.extend({

    clean: function() {
        return this.filter(function(itm) {
            return itm !== null;
        });
    },

    empty: function() {
        this.length = 0;
        return this;
    },

    pluck: function(property) {
        return hAzzle.map(this, function(el) {
            return el[property];
        });
    },

    /**
     * Adds one element to the set of matched elements.
     *
     * @param {String} selector
     * @param {String} context
     * @return {hAzzle}
     */

    add: function(selector, context) {
        return hAzzle(
            hAzzle.unique(
                hAzzle.merge(this.get(), hAzzle(selector, context))
            )
        );
    },

    /**
     * Reduce the set of matched elements to the first in the set,
     * OR to the first Nth elements, if index is specified
     *
     * @param {Number} index
     * @return {hAzzle}
     *
     * @param {Number} index
     * @return {hAzzle}
     *
     * The index starts to count from left to right.
     *
     * Example:
     *
     *  hAzzle('li').first() - will return the first li elem
     *
     *  hAzzle('li').first(2) - will return the first 2 li elems
     *
     */

    first: function(index) {

        return index ? this.slice(0, index) : this.eq(0);
    },

    /**
     * Reduce the set of matched elements to the finale one in the set,
     * OR to the last Nth elements, if index is specified
     *
     * @param {Number} index
     * @return {hAzzle}
     *
     * The index starts to count from right to left.
     *
     * Example:
     *
     *  hAzzle('li').last() - will return the last li elem
     *
     *  hAzzle('li').last(2) - will return the last 2 li elems
     *
     */

    last: function(index) {

        return index ? this.slice(this.length - index) : this.eq(-1);
    },

    /**
     * Get the immediately following sibling of each element
     *
     * @param {Object} elem
     * @return {hAzzle}
     */

    next: function(selector) {
        return hAzzle(this.pluck('nextElementSibling')).filter(selector || '*');
    },

    /**
     * Get the immediately preceding sibling of each element
     * in the set of matched  elements, optionally filtered by a
     * selector.
     *
     * @param {Object} elem
     * @return {hAzzle}
     */

    prev: function(selector) {
        return hAzzle(this.pluck('previousElementSibling')).filter(selector || '*');
    },

    /**
     * Reduce the set of matched elements to a subset specified by a range of indices.
     */

    slice: function() {

        return hAzzle(slice.apply(this, arguments));
    },

    /**
     * Reduce the set of matched elements to the one at the specified index.
     * @param {number} index
     * @return {hAzzle}
     */

    eq: function(index) {

        index = +index;

        // Use the first identity optimization if possible

        if (index === 0 && this.length <= index) {

            return this;
        }

        if (index < 0) {

            index = this.length + index;
        }

        return this[index] ? hAzzle(this[index]) : hAzzle([]);

    },

    toArray: function() {

        return slice.call(this);
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array

    get: function(num) {

        return num !== null ?

            // Return just the one element from the set
            (this[num < 0 ? (this.length + num) : num]) :

            // Return all the elements in a clean array
            slice.call(this);
    },


    filter: function(selector) {
        return hAzzle(isnot(this, selector || [], false));
    },

    /**
     * Remove elements from the set of matched elements.
     *
     * @param {String} selector
     * @return {hAzzle}
     *
     */

    not: function(selector) {
        return hAzzle(isnot(this, selector || [], true));
    },

    /**
     * Check if the first element in the element collection matches the selector
     *
     * @param {String} selector
     * @return {Boolean}
     */

    is: function(selector) {
        return !!isnot(
            this,
            selector || [],
            false
        ).length;
    },

    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     *
     * @param {String} selector
     * @return {hAzzle}
     *
     */

    has: function(target) {
        var targets = hAzzle(target, this),
            l = targets.length;
        return this.filter(function() {
            var i = 0;
            for (; i < l; i++) {
                if (hAzzle.contains(this, targets[i])) {
                    return true;
                }
            }
        });
    },

    /** Determine the position of an element within the matched set of elements
     *
     * @param {string} selector
     * @return {hAzzle}
     */

    index: function(selector) {

        if (!selector) {

            var haystack = this.parentElement(),
                needle = this[0];

            // index in selector

        } else if (typeof selector === 'string') {

            haystack = hAzzle(selector);
            needle = this[0];

        } else {

            haystack = this;

            needle = selector.length ? selector[0] : selector;
        }

        return indexOf.call(this,
            selector.hAzzle ? selector[0] : selector
        );
    },

    /**
     * Get the element that matches the selector, beginning at the current
     * element and progressing up through the DOM tree.
     *
     * @param {String} selectors
     * @param {String} context
     * @return {hAzzle}
     */

    closest: function(selectors, context) {
        var cur,
            i = 0,
            l = this.length,
            matched = [],
            pos = typeof selectors !== "string" ?
            hAzzle(selectors, context) : 0;

        for (; i < l; i++) {

            cur = this[i];

            while (cur && cur !== context && cur.nodeType !== 11) {

                if (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && hAzzle.matches(selectors, cur)) {

                    matched.push(cur);
                    break;
                }
                cur = cur.parentElement;
            }
        }

        return hAzzle(matched.length > 1 ? hAzzle.unique(matched) : matched);
    },

    /**
     * Find the first element(s) that matches the selector by traversing down
     * through its descendants in the DOM tree level by level.
     *
     * @param {String|Object} selector
     * @return {hAzzle}
     *
     */

    closestChild: function(selector) {

        if ((typeof selector === 'string' ||
            typeof selector === 'object') && selector !== '') {

            var queue = [],
                node, children, i = 0,
                child;

            queue.push(this);

            while (queue.length > 0) {

                node = queue.shift();

                children = node.children();

                for (; i < children.length; ++i) {

                    child = hAzzle(children[i]);

                    // We find the child, stop processing

                    if (child.is(selector)) {

                        return child;
                    }

                    queue.push(child); //go deeper
                }
            }
        }
        // If no selector, return all nodes
        return this;
    },

    query: function(selector, count) {

        var self = this.each ? this : [this],
            list = [],
            i = 0,
            m = self.length,
            nodes, node,
            j = 0,
            l;

        for (; i < m && (!count || list.length < count); i++) {

            if (count === list.length + 1) {

                node = hAzzle.find(selector, self[i]);

                if (node) {

                    list.push(node);
                }

            } else {

                nodes = hAzzle.find(selector, self[i]);

                for (l = nodes.length; j < l && (!count || list.length < count); j++) {
                    list.push(nodes[j]);
                }
            }
        }

        return hAzzle(list);
    },

    /**
     * Deprecated but kept due to consistency with the jQuery API
     *
     */
    find: function(selector) {
        var i,
            len = this.length,
            ret = [],
            self = this;

        // String

        if (typeof selector === 'string') {

            // Loop through all elements, and check for match

            for (i = 0; i < len; i++) {

                hAzzle.find(selector, self[i], ret);
            }

            // If more then one element, make sure they are unique

            if (len > 1) {

                ret = hAzzle.unique(ret);

            }
            // return the result

            return hAzzle(ret);

        } else { // Object

            return hAzzle(selector).filter(function() {
                for (i = 0; i < len; i++) {
                    if (hAzzle.contains(self[i], this)) {
                        return true;
                    }
                }
            });
        }
    },

    /**
     * NOTE!! In the upcoming DOM level 4, the nextElementSibling and
     * previousElementSibling have been removed from the
     * 'documentType' for compatibility reasons.
     *
     * Therefor hAzzle choose to support this features with it's internal
     * API
     */

    parentElement: function() {
        return this.parent().children();
    },
    firstElementChild: function() {
        return this.children().first();
    },

    lastElementChild: function() {
        return this.children().last();
    },

    previousElementSibling: function() {
        return this.prev().last();
    },

    nextElementSibling: function() {
        return this.next().first();
    },

    childElementCount: function() {
        return this.children().length;
    }
});


hAzzle.extend({
    traverse: function(elem, dir, until) {
        var matched = [],
            cur = elem[dir];
        while (cur && cur !== document) {
            if (typeof until !== 'undefined' && hAzzle(cur).is(until)) {
                break;
            }
            matched.push(cur);
            cur = cur[dir];
        }
        return matched;
    },

    sibling: function(elem, skip) {

        var ret = [],
            tmp = elem.children,
            i = 0,
            l = tmp.length;

        if (skip) {
            for (; i < l; i++) {
                if (tmp[i] !== skip) {
                    ret.push(tmp[i]);
                }
            }
        }

        return ret;
    }
}, hAzzle);

hAzzle.forOwn({

    /**
     * Get the parent of each element in the current set of matched
     * elements, optionally filtered by a selector.
     */

    parent: function(elem) {
        var parent = elem.parentElement;
        return parent && parent.nodeType !== 11 ? parent : null;
    },

    /**
     * Get the ancestors of each element in the current set of matched
     *elements, optionally filtered by a selector.
     */

    parents: function(elem) {
        return hAzzle.traverse(elem, "parentElement");
    },

    /**
     * Get the ancestors of each element in the current set of matched elements, up to
     * but not including the element matched by the selector, DOM node, or hAzzle object.
     */

    parentsUntil: function(elem, i, until) {
        return hAzzle.traverse(elem, "parentElement", until);
    },

    /**
     * Get the siblings of each element in the set of matched elements, optionally
     * filtered by a selector.
     */

    siblings: function(elem) {
        return hAzzle.sibling(elem.parentElement, elem);
    },

    /**
     * Get the children of each element in the set of matched elements, optionally
     * filtered by a selector.
     */

    children: function(elem) {
        return elem && hAzzle.sibling(elem, true);
    },

    /**
     * Get all following siblings of each element in the set of matched
     * elements, optionally filtered by a selector.
     */

    nextAll: function(elem) {
        return hAzzle.traverse(elem, "nextElementSibling");
    },

    /**
     * Get all preceding siblings of each element in the set of matched elements
     * optionally filtered by a selector.
     */

    prevAll: function(elem) {
        return hAzzle.traverse(elem, "previousElementSibling");
    },

    /**
     * Get all following siblings of each element up to but not including the
     * element matched by the selector, DOM node, or jQuery object passed.
     */

    nextUntil: function(elem, i, until) {

        return hAzzle.traverse(elem, "nextElementSibling", until);
    },

    /**
     * Get all preceding siblings of each element up to but not including the
     * element matched by the selector, DOM node, or hAzzle object.
     */

    prevUntil: function(elem, i, until) {

        return hAzzle.traverse(elem, "previousElementSibling", until);
    },


    /**
     * Get the children of each element in the set of matched elements,
     * including text and comment nodes.
     */

    contents: function(elem) {
        return elem.contentDocument || hAzzle.merge([], elem.childNodes);
    }
}, function(fn, name) {

    hAzzle.Core[name] = function(until, selector) {

        var matched = map(this, fn, until);

        if (name.slice(-5) !== 'Until') {
            selector = until;
        }

        if (selector && typeof selector === 'string') {
            matched = hAzzle.matches(selector, matched);
        }

        if (this.length > 1) {
            // Remove duplicates
            if (!specials[name]) {
                hAzzle.unique(matched);
            }

            if (parpreunall.test(name)) {

                matched.reverse();
            }
        }

        return hAzzle(matched);
    };
});

function isnot(els, selector, not) {

    var type = typeof selector;

    if (type === "string") {
        selector = hAzzle.matches(selector, els);
        return hAzzle.grep(els, function(elem) {
            return (indexOf.call(selector, elem) >= 0) !== not;
        });
    }

    return type === 'function' ?
        hAzzle.grep(els, function(elem, i) {
            return !!selector.call(elem, i, elem) !== not;
        }) : selector.nodeType ?
        hAzzle.grep(els, function(elem) {
            return (elem === selector) !== not;
        }) : hAzzle.grep(els, function(elem) {
            return (indexOf.call(selector, elem) >= 0) !== not;
        });
}


hAzzle.each(['children contents next prev'.split(' ')], function(prop) {
    console.log(prop)
    specials[prop] = true;
});