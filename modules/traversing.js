// traversing.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

// Support W3C ElementTraversal interface
 
hAzzle.define('traversing', function() {

    var jiesa = hAzzle.require('jiesa'),
        collection = hAzzle.require('collection'),
        types = hAzzle.require('types'),
        core = hAzzle.require('core'),
        util = hAzzle.require('util');

    // Returns all sibling elements for nodes
    // Optionally takes a query to filter the sibling elements.

    this.siblings = function(selector) {
        var ret = [],
            i, nodes;
        this.each(function(element) {
            nodes = element.parentElement.children;
            i = nodes.length;
            while (i--) {
                if (nodes[i] !== element) {
                    ret.push(nodes[i]);
                }
            }
        });
        return selector === undefined ? hAzzle(ret) : hAzzle(ret).filter(selector);
    };

    // Get immediate parents of each element in the collection.
    // If CSS selector is given, filter results to include only ones matching the selector.

    this.parent = function(sel) {
        var matched = this.map(function(elem) {
            var parent = elem.parentElement;
            return parent && parent.nodeType !== 11 ? parent : null;
        }).filter(sel);

        if (this.length > 1) {
            // Remove duplicates
            matched = core.unique(matched.elements);
        }
        return hAzzle(matched);
    };

    // Returns all parent elements for nodes
    // Optionally takes a query to filter the child elements.

    this.parents = function(selector) {
        var ancestors = [],
            elements = this.elements;
        while (elements.length > 0 && elements[0] !== undefined) {
            elements = util.map(elements, function(elem) {
                if (elem && (elem = elem.parentElement) && elem.nodeType !== 9) {
                    ancestors.push(elem);
                    return elem;
                }
            });
        }

        if (this.length > 1) {
            // Remove duplicates
            core.unique(ancestors);
            // Reverse order for parents
            ancestors.reverse();
        }
        return selector === undefined ? hAzzle(ancestors) : hAzzle(ancestors).filter(selector);
    };

    // For each element in the set, get the first element that matches the 
    // selector by testing the element itself and traversing up through its 
    // ancestors in the DOM tree.

    this.closest = function(selector, ctx) {
        var cur,
            i = 0,
            l = this.length,
            matched = [];

        for (; i < l; i++) {
            for (cur = this.elements[i]; cur && cur !== ctx; cur = cur.parentNode) {
                // Always skip document fragments

                if (cur.nodeType === 1 &&+ jiesa.matches(cur, selector)) {

                    matched.push(cur);
                    break;
                }
            }
        }

        return hAzzle(matched.length > 1 ? core.unique(matched) : matched);
    };

    // Get immediate children of each element in the current collection.
    // If selector is given, filter the results to only include ones matching the CSS selector.

    this.children = function(selector) {
        var children = [];
        this.each(function(elem) {
            util.each(collection.slice(elem.children), function(value) {
                children.push(value);
            });
        });
        return selector === undefined ? hAzzle(children) : hAzzle(children).filter(selector);
    };

    // Return elements that is a descendant of another.
    // 'contains' would be a better name, but it will conflict with ECMA 7

    this.descendant = function(selector) {
        var matches;
        return new hAzzle(collection.reduce(this.elements, function(elements, element) {
            matches = jiesa.find(element, selector);
            return elements.concat(matches.length ? element : null);
        }, []));
    };

    // Reduce the set of matched elements to those that have a descendant that matches the 
    //selector or DOM element.

    this.has = function(sel) {
        return hAzzle(util.filter(
            this.elements,
            types.isElement(sel) ? function(el) {
                return core.contains(sel, el);
            } : typeof sel === 'string' && sel.length ? function(el) {
                return jiesa.find(sel, el).length;
            } : function() {
                return false;
            }
        ));
    };

    return {};
});