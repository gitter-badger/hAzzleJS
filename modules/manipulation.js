// manipulation.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('manipulation', function() {

    var _doc = window.document,

        // Dependencies

        util = hAzzle.require('util'),
        features = hAzzle.require('has'),
        collection = hAzzle.require('collection'),
        types = hAzzle.require('types'),
        core = hAzzle.require('core'),

        // RegExp

        shortTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        checkradioRegExp = (/^(?:checkbox|radio)$/i),
        htmlRegexp = /<|&#?\w+;/,
        tagRegExp = /<([\w:]+)/,
        scriptRegExp = /<(?:script|style|link)/i,
        xhtmlRegxp = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,

        validTypes = {
            '1': 1,
            '3': 1,
            '8': 1,
            '10': 1
        },

        // 'after' and 'insertAfter' methods need to be in reverse order

        reversable = {
            'after': 1
        },

        // HTML stuff

        table = [1, '<table>', '</table>'],
        td = [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        option = [1, '<select multiple="multiple">', '</select>'],
        noop = [0, '', ''],
        wrapMap = {
            'col': [2, '<table><colgroup>', '</colgroup></table>'],
            'tr': [2, '<table><tbody>', '</tbody></table>'],
            'thead': table,
            'tbody': table,
            'tfoot': table,
            'colgroup': table,
            'caption': table,
            'option': option,
            'optgroup': option,
            'td': td,
            'th': td
        },

        imcHTML = (function() {

            // Because this technology's specification has not stabilized, and not all browsers support 
            // it yet, we need to check for createHTMLDocument existent
            // https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument

            if (typeof _doc.implementation.createHTMLDocument === 'function') {
                return true;
            }
            return false;
        })(),

        // Support: IE<=11+
        // Make sure textarea (and checkbox) defaultValue is properly cloned

        cloneChecked = (function() {

            var div = _doc.createElement('div'),
                res,
                fragment = _doc.createDocumentFragment(),
                fragdiv = fragment.appendChild(div),
                input = _doc.createElement('input');

            input.setAttribute('type', 'radio');
            input.setAttribute('checked', 'checked');
            input.setAttribute('name', 't');

            fragdiv.appendChild(input);
            fragdiv.innerHTML = '<textarea>x</textarea>';
            res = !!div.cloneNode(true).lastChild.defaultValue;
            div = null;
            return res;
        }()),

        fixInput = function(src, dest) {
            var nodeName = dest.nodeName.toLowerCase();

            // Fails to persist the checked state of a cloned checkbox or radio button.
            if (nodeName === 'input' && checkradioRegExp.test(src.type)) {
                dest.checked = src.checked;

                // Fails to return the selected option to the default selected state when cloning options
            } else if (nodeName === 'input' || nodeName === 'textarea') {
                dest.defaultValue = src.defaultValue;
            }
        },

        // Returns a duplicate of `elem`
        // - deep (Boolean): Whether to clone events as well.
        // - evtName: event type to be cloned (e.g. 'click', 'mouseenter')
        cloneElem = function(elem, deep, evtName) {

            if (elem === null || elem === undefined) {
                return elem;
            }

            elem = elem instanceof hAzzle ? elem.elements[0] ? elem.length : elem[0] : elem;

            var source = elem.nodeType && elem.cloneNode(true),
                destElements,
                srcElements,
                i, l;
            if (source) {
                // Fix IE cloning issues
                if (!cloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) &&
                    // no XML document
                    !core.isXML(elem)) {

                    destElements = grab(source);
                    srcElements = grab(elem);

                    for (i = 0, l = srcElements.length; i < l; i++) {
                        fixInput(srcElements[i], destElements[i]);
                    }
                }

                // Clone events if the Events.js module are installed

                if (hAzzle.installed.events && deep && (source.nodeType === 1 || source.nodeType === 9)) {
                    // Copy the events from the original to the clone
                    destElements = grab(source);
                    srcElements = grab(elem);
                    for (i = 0; i < srcElements.length; i++) {
                        hAzzle.require('events').clone(destElements[i], srcElements[i], typeof evtName === 'string' ? evtName : '');
                    }
                }
                return source;
            }
        },

        deepEach = function(array, fn, context) {
            if (array) {
                var index = array.length;
                while (index--) {
                    if (types.isNode(array[index])) {
                        deepEach(array[index].children, fn, context);
                        fn.call(context || array[index], array[index], index, array);
                    }
                }
            }
            return array;
        },

        buildFragment = function(html, context) {
            var tmp, tag, wrap,
                elem,
                fragment = context.createDocumentFragment(),
                nodes = [],
                i;
            if (typeof html === 'string' && html !== '') {
                if (!htmlRegexp.test(html)) {
                    // Convert non-html into a text node
                    nodes.push(context.createTextNode(html));
                } else {

                    // Convert html into DOM nodes
                    tmp = tmp || fragment.appendChild(context.createElement('div'));
                    tag = (tagRegExp.exec(html) || ['', ''])[1].toLowerCase();
                    wrap = wrapMap[tag] || noop;
                    tmp.innerHTML = wrap[1] + html.replace(xhtmlRegxp, '<$1></$2>') + wrap[2];

                    // Descend through wrappers to the right content
                    i = wrap[0];
                    while (i--) {
                        tmp = tmp.lastChild;
                    }

                    nodes = util.merge(nodes, tmp.childNodes);

                    tmp = fragment.firstChild;
                    tmp.textContent = '';
                }

                // Remove wrapper from fragment
                fragment.textContent = '';
                fragment.innerHTML = ''; // Clear inner HTML

                // Multiple elements return a NodeList

                if (fragment.childNodes.length) {

                    i = 0;

                    while ((elem = nodes[i++])) {
                        fragment.appendChild(elem);
                    }
                } else {
                    fragment.appendChild(nodes[0]);
                }
                return fragment;
            }
        },

        create = function(html, context) {

            var parsed, defaultContext;

            // create() will stop working in IE if we feature check for createHTMLDocument, so 
            // only use this for non-ie browsers (same issue in IE 11 / 12 on the Windows 10tp )   

            if (features.ie || !imcHTML) {
                defaultContext = context || _doc;
            } else {
                defaultContext = context || (imcHTML ? _doc.implementation.createHTMLDocument() : _doc);
            }

            if ((parsed = shortTag.exec(html))) {
                return [defaultContext.createElement(parsed[1])];
            }

            if ((parsed = buildFragment(html, defaultContext))) {
                return collection.slice(parsed.childNodes);
            }

            return [];
        },

        // Grab childnodes

        grab = function(context, tag) {
            var ret = context.getElementsByTagName(tag || '*');
            return tag === undefined || tag && util.nodeName(context, tag) ?
                util.merge([context], ret) :
                ret;
        },

        // Removes events associated with an element

        clearData = function(elems) {
            hAzzle.installed.events && util.each(elems instanceof hAzzle ? 
                     elem.elements ? elems.length : 
                     elems : 
                     [elems], function(elem) {
                if (elem && elem.nodeType === 1 || elem.nodeType === 9 || !(+elem.nodeType)) {
                    hAzzle(elem).off();
                }
            });
        },
        normalize = function(node, clone) {

            var i, l, ret;

            if (typeof node === 'string') {
                return create(node);
            }

            node = getElem(node);

            if (clone) {
                ret = []; // Don't change original array

                for (i = 0, l = node.length; i < l; i++) {
                    ret[i] = cloneElem(node[i], true);
                }
                return ret;
            }
            return node;
        };

    this.domManip = function(content, method, /*reverse */ rev) {
        var i = 0,
            r = [],
            self = this.elements,
            nodes = hAzzle(content);

        // Start the iteration and loop through the content

        util.each(normalize(nodes), function(elem, index) {
            util.each(self, function(el) {
                elem && elem[method](index > 0 ? el.cloneNode(true) : el); // DOM Level 4
            }, null, rev);

        }, this, rev);
        self.length = i;
        util.each(r, function(e) {
            self[--i] = e;
        }, null, !rev);
        return self;
    };

    // Replace each element in the set of matched elements with the 
    // provided new content and return the set of elements that was removed

    this.replaceWith = function(node) {
        return this.each(function(el, index) {
            util.each(normalize(node, index), function(content) {
                el.replace(content); // DOM Level 4
            });
        });
    };

    // Text

    this.text = function(value) {
        return value === undefined ?
            hAzzle.require('text').getText(this.elements) :
            this.each(function(elem) {
                if (elem !== null && (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9)) {
                    this.textContent = value;
                }
            });
    };

    // HTML

    this.html = function(value) {
        var that = this,
            elem = this.elements[0],
            append = function(el, i) {
                util.each(normalize(value, that, i), function(node) {
                    el.append(node); // DOM Level 4
                });
            },
            updateElement = function(el, i) {

                try {
                    if (el.nodeType === 1 && typeof value === 'string' && !scriptRegExp.test(value) &&
                        !wrapMap[(tagRegExp.exec(value) || ['', ''])[1].toLowerCase()]) {
                        value = value.replace(xhtmlRegxp, '<$1></$2>');
                        // Remove element nodes and prevent memory leaks
                        clearData(grab(el, false));
                        return el.innerHTML = value;
                    }
                } catch (e) {}
                append(el, i);
            };
        return typeof value != 'undefined' ? this.empty().each(updateElement) : elem ? elem.innerHTML : '';
    };

    this.deepEach = function(fn, scope) {
        deepEach(this.elements, fn, scope);
        return this;
    };

    this.detach = function() {
        return this.each(function(elem) {
            if (elem.parentElement) {
                elem.parentElement.removeChild(elem);
            }
        });
    };

    //  Remove all child nodes of the set of matched elements from the DOM

    this.empty = function() {
        return this.each(function(elem) {
            if (elem != null && elem.nodeType === 1) {
                // Do a 'deep each' and clear all listeners if any 
                deepEach(elem.children, clearData);
                // Remove children
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
        });
    };

    // Remove the set of matched elements from the DOM.

    this.remove = function() {
        return this.deepEach(clearData).detach();
    };

    // Creates a copy of a DOM element, and returns the clone
    // If 'deep' it will clone all events OR the specified event 

    this.clone = function(deep, event) {
        return this.map(function() {
            return cloneElem(this, deep, event);
        });
    };

    // append / prepend / before and after methods

    util.each({

        // Insert content, specified by the parameter, to the end of 
        // each element in the set of matched elements.

        append: 'beforeend',

        // Insert content, specified by the parameter, to the beginning 
        // of each element in the set of matched elements.

        prepend: 'afterbegin',

        // Insert content, specified by the parameter, before each 
        // element in the set of matched elements.

        before: 'beforebegin',

        // Insert content, specified by the parameter, after each element 
        // in the set of matched elements.  

        after: 'afterend'

    }, function(iah, prop) {

        this[prop] = function(content) {

            return this.each(function(elem, index) {

                // Check if we can use insertAdjacentHTML,        
                if (typeof content === 'string' &&
                    // .. and make sure this is a HTML document
                    core.isHTML &&
                    // ... and the parentElement has nodeType 1
                    elem.parentElement && elem.parentElement.nodeType === 1) {

                    // Clean the HTML content and insert the content

                    elem.insertAdjacentHTML(iah, content.replace(xhtmlRegxp, '<$1></$2>'));

                } else { // non-iAH method

                    if (validTypes[elem.nodeType]) {

                        var node = normalize(content, index),
                            i = 0,
                            l = node.length;

                        // 'Normal' iteration faster then internal 'each'
                        for (; i < l; i++) {
                            elem[prop](node[i]); // DOM Level 4
                        }
                    }
                }
            }, null, reversable[prop] || false);
        };

    }.bind(this));

    //### jQuery / Zepto specific methods
    util.each({
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after'
    }, function(method, prop) {

        this[prop] = function(content) {
            return this.domManip(content, method, reversable[method] || false);
        };
    }.bind(this));

    return {
        create: create,
        clone: cloneElem,
        buildFragment: buildFragment
    };
});