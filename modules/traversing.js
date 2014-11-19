// traversing.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('traversing', function() {

    var jiesa = hAzzle.require('jiesa'),
        collection = hAzzle.require('collection'),
        types = hAzzle.require('types'),
        core = hAzzle.require('core'),
        util = hAzzle.require('util'),

        // Return correct index value

        inVal = function(sel, index) {
            return typeof sel === 'undefined' && !types.isNumber(index) ? 0 :
                types.isNumber(sel) ? sel : types.isNumber(index) ? index : null;
        },
        gather = function(els, fn) {
            var ret = [],
                res, i = 0,
                j, len = els.length,
                f;
            for (; i < len;) {
                for (j = 0, f = (res = fn(els[i], i++)).length; j < f;) {
                    ret.push(res[j++]);
                }
            }
            return ret;
        },
        traverse = function(els, method, sel, index) {
            index = inVal(sel, index);
            return gather(els, function(el) {
                var i = index || 0,
                    ret = [],
                    elem = el[method];
                while (elem && (index === null || i >= 0)) {
                    if (types.isElement(elem) &&
                        jiesa.matches(elem, typeof sel === 'string' ? sel : '*') &&
                        (index === null || i-- === 0)) {
                        if (index === null &&
                            method !== 'nextElementSibling' &&
                            method !== 'parentElement') {
                            ret.unshift(elem);
                        } else {
                            ret.push(elem);
                        }
                    }
                    elem = elem[method];
                }
                return ret;
            });
        };

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

                if (cur.nodeType < 11 &&
                    cur.nodeType === 1 &&
                    jiesa.matches(cur, selector)) {

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

    // Traverse up the DOM tree
    // E.g hAzzle('test').up(2) or hAzzle('test').up('li', 2) 

    this.up = function(sel, index) {
        return hAzzle(traverse(this.elements, 'parentElement', sel, index));
    };

    // Traverse down the DOM tree 
    // E.g hAzzle('test').down(2) or hAzzle('test').down('nav') 

    this.down = function(sel, index) {
        index = inVal(sel, index);
        return hAzzle(gather(this.elements, function(elem) {
            var jf = jiesa.find(typeof sel === 'string' ? sel : '*', elem);
            return index === null ? jf : ([jf[index]] || []);
        }));
    };

    // This methods will overwrite the existing first() and prev() methods already
    // included in the Core, and add extra features.
    // E.g hAzzle('test').next('nav', 4) or hAzzle('test').prev('nav') 

    util.each({
        next: 'nextElementSibling',
        prev: 'previousElementSibling'
    }, function(value, prop) {
        this[prop] = function(sel, index) {
            if (index) {
                return hAzzle(traverse(this.elements, value, sel, index));
            } else {
                return this.map(function(elem) {
                    return elem[value];
                }).filter(sel);
            }
        };
    }.bind(this));

    return {};
});