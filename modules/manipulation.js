// manipulation.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('Manipulation', function() {

    var _doc = window.document,
        _util = hAzzle.require('Util'),
        _core = hAzzle.require('Core'),
        _events = hAzzle.require('Events'),
        _types = hAzzle.require('Types'),
        _text = hAzzle.require('Text'),
        _rcheckableType = (/^(?:checkbox|radio)$/i),
        htmlRegexp = !/<|&#?\w+;/,
        tagRegExp = /<([\w:]+)/,
        xhtmlRegxp = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        wrapMap = {
            'option': [1, '<select multiple="multiple">', '</select>'],
            'thead': [1, '<table>', '</table>'],
            'col': [2, '<table><colgroup>', '</colgroup></table>'],
            'tr': [2, '<table><tbody>', '</tbody></table>'],
            'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            '_default': [0, "", ""]
        };

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // Support: IE<=11+
    // Make sure textarea (and checkbox) defaultValue is properly cloned
    var cloneChecked = (function() {

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
            if (nodeName === 'input' && _rcheckableType.test(src.type)) {
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

            elem = getElem(elem);

            var source = elem.nodeType && elem.cloneNode(true),
                destElements,
                srcElements,
                i, l;
            if (source) {
                // Fix IE cloning issues
                if (!cloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) &&
                    !_core.isXML(elem)) {

                    destElements = grab(source);
                    srcElements = grab(elem);

                    for (i = 0, l = srcElements.length; i < l; i++) {
                        fixInput(srcElements[i], destElements[i]);
                    }
                }

                // Clone events if the Events.js module are installed

                if (hAzzle.installed.Events && deep && (source.nodeType === 1 || source.nodeType === 9)) {
                    // Copy the events from the original to the clone
                    destElements = grab(source);
                    srcElements = grab(elem);
                    for (i = 0; i < srcElements.length; i++) {
                        _events.clone(destElements[i], srcElements[i], evtName);
                    }
                }
                return source;
            }
        },

        deepEach = function(array, fn, context) {
            if (array) {
                var index = array.length;
                while (index--) {
                    if (_types.isNode(array[index])) {
                        deepEach(array[index].children, fn, context);

                        fn.call(context || array[index], array[index], index, array);
                    }
                }
            }
            return array;
        },

        create = function(html, context) {

            context = context || document;

            var tmp, tag, wrap,
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
                    wrap = wrapMap[tag] || wrapMap._default;
                    tmp.innerHTML = wrap[1] + html.replace(xhtmlRegxp, '<$1></$2>') + wrap[2];

                    // Descend through wrappers to the right content
                    i = wrap[0];
                    while (i--) {
                        tmp = tmp.lastChild;
                    }

                    nodes = _util.merge(nodes, tmp.childNodes);

                    tmp = fragment.firstChild;
                    tmp.textContent = '';
                }

                // Remove wrapper from fragment
                fragment.textContent = '';
                fragment.innerHTML = ''; // Clear inner HTML

                return nodes;
            }
        },

        // Grab childnodes

        grab = function(context, tag) {
            var ret = context.getElementsByTagName(tag || '*');
            return tag === undefined || tag && _util.nodeName(context, tag) ?
                _util.merge([context], ret) :
                ret;
        },

        // Removes the data associated with an element

        clearData = function(elems) {

            // No point to continue clearing events if the events.js module
            // are not installed

            hAzzle.err(!hAzzle.installed.events, 17, 'events.js module are not installed');

            var elem, i = 0;

            // If instanceof hAzzle...

            if (elems instanceof hAzzle) {
                elems = [elems.elements[0]];
            } else {
                elems = elems.length ? elems : [elems];
            }

            for (;
                (elem = elems[i]) !== undefined; i++) {
                // Remove all eventListeners
                hAzzle(elem).off();
            }
        },

        normalize = function(node, clone) {

            var i, l, ret;

            if (typeof node === 'string') {
                return create(node);
            }

            if (node instanceof hAzzle) {
                node = node.elements;
            }

            if (_types.isNode(node)) {
                node = [node];
            }

            if (clone) {
                ret = []; // Don't change original array

                for (i = 0, l = node.length; i < l; i++) {
                    ret[i] = cloneElem(node[i], true);
                }
                return ret;
            }
            return node;
        },
        insertMethod = function(elem, content, method, state) {
            elem = getElem(elem);
            _util.each(normalize(content, state ? state : 0), function(relatedNode) {
                elem[method](relatedNode); // DOM Level 4
            });
        },
        // Internal method !!
        getElem = function(elem) {
            return elem instanceof hAzzle ? elem.elements : elem;
        },
        html = function(elem, value) {

            elem = elem instanceof hAzzle ? elem.elements : elem.length ? elem : [elem];

            var append = function(el, i) {
                    _util.each(normalize(value, elem, i), function(node) {
                        el.append(node); // DOM Level 4
                    });
                },
                updateElement = function(el, i) {
                    try {

                        if (el.nodeType === 1 && typeof value === 'string' && !/<(?:script|style|link)/i.test(value) &&
                            !wrapMap[(/<([\w:]+)/.exec(value) || ['', ''])[1].toLowerCase()]) {
                            // Remove element nodes and prevent memory leaks
                            clearData(grab(el, false));
                            elem.innerHTML = value;
                        }
                    } catch (e) {}
                    append(el, i);
                };

            if (value === undefined && elem[0].nodeType === 1) {
                return elem[0] ? elem[0].innerHTML : '';
            }

            // Remove child nodes to avoid memory leaks

            empty(elem);

            // Update each element with new content

            return _util.each(elem, updateElement);
        },

        text = function(elem, value) {

            elem = (elem instanceof hAzzle ? elem.elements : elem.length ? elem : [elem])[0];

            var nodeType = elem ? elem.nodeType : undefined;

            if (nodeType === 1 || nodeType === 11 || nodeType === 9) {
                elem.textContent = value;
            }
        },

        //  Remove all child nodes of the set of matched elements from the DOM
        empty = function(elem) {
            elem = getElem(elem)[0];
            if (elem) {
                // Do a 'deep each' and clear all listeners if any 
                deepEach(elem.children, clearData);
                // Remove children
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
        },
        remove = function(elem) {
            elem = getElem(elem)[0];
            deepEach(clearData);
            if (elem.parentElement) {
                elem.parentElement.removeChild(elem);
            }
        },
        replace = function(elem, html) {
            elem = getElem(elem);
            _util.each(elem, function(el, i) {
                _util.each(normalize(html, i), function(i) {
                    el.replace(i); // DOM Level 4
                });
            });
        };

    // insertAdjacentHTML method for append, prepend, before and after

    this.iAHMethod = function(method, html, fn) {
        return this.each(function(elem, index) {
            if (typeof html === 'string' &&
                _core.isHTML &&
                elem.parentElement && elem.parentElement.nodeType === 1) {
                elem.insertAdjacentHTML(method, html.replace(xhtmlRegxp, '<$1></$2>'));
            } else {
                fn(elem, index);
            }
        });
    };

    this.domManip = function(content, fn, /*reverse */ rev) {

        var i = 0,
            r = [];

        // Nasty looking code, but this has to be fast

        var self = this.elements,
            elems, nodes;

        if (typeof content === 'string' &&
            content[0] === '<' &&
            content[content.length - 1] === '>' &&
            content.length >= 3) {
            nodes = content;
        } else {
            nodes = hAzzle(content);
        }

        // Start the iteration and loop through the content

        _util.each(normalize(nodes), function(elem, index) {
            _util.each(self, function(el) {
                elems = index > 0 ? el.cloneNode(true) : el;
                if (elem) {
                    fn(elem, elems);
                }
            }, null, rev);

        }, this, rev);
        self.length = i;
        _util.each(r, function(e) {
            self[--i] = e;
        }, null, !rev);
        return self;
    };

    this.appendTo = function(content) {
        return this.domManip(content, function(element, node) {
            element.appendChild(node);
        });
    };

    this.prependTo = function(content) {
        return this.domManip(content, function(element, node) {
            element.insertBefore(node, element.firstChild);
        });
    };

    this.insertBefore = function(content) {
        return this.domManip(content, function(element, node) {
            element.parentNode.insertBefore(node, element);
        });
    };

    this.insertAfter = function(content) {
        return this.domManip(content, function(element, node) {
            var sibling = element.nextSibling;
            sibling ?
                element.parentNode.insertBefore(node, sibling) :
                element.parentNode.appendChild(node);
        }, 1);
    };

    // Same as 'ReplaceWith' in jQuery

    this.replaceWith = function(html) {
        return replace(this.elements, html);
    };

    // Text

    this.text = function(value) {
        return value === undefined ?
            _text.getText(this.elements) :
            this.each(function(elem) {
                if (elem !== null) {
                    text(elem, value);
                }
            });
    };

    // HTML

    this.html = function(value) {
        return value === undefined && this.elements[0].nodeType === 1 ?
            this.elements[0].innerHTML :
            this.each(function() {
                return html(this, value);
            });
    };

    this.deepEach = function(fn, scope) {
        return deepEach(this.elements, fn, scope);
    };

    this.detach = function() {
        return this.each(function(elem) {
            if (elem.parentElement) {
                elem.parentElement.removeChild(elem);
            }
        });
    };

    this.empty = function() {
        return this.each(function(elem) {
            empty(elem);
        });
    };

    this.remove = function() {
        this.deepEach(clearData);
        return this.detach();
    };

    // Creates a copy of a DOM element, and returns the clone.

    this.clone = function( /*bool:true - event cloning*/ deep, evtName) {

        // Better performance with a 'normal' for-loop then
        // map() or each()       
        var elems = this.elements,
            ret = [],
            i = 0,
            l = this.length;

        for (; i < l; i++) {
            ret[i] = cloneElem(elems[i], deep, evtName);
        }
        return hAzzle(ret);
    };

    _util.each({

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
            return this.iAHMethod(iah, content, function(elem, state) {
                var nodeType = elem ? elem.nodeType : undefined;
                if (nodeType && (nodeType === 1 || nodeType === 11 || nodeType === 9)) {
                    insertMethod(elem, content, prop, state);
                }

            });
        };

    }.bind(this));

    return {
        clearData: clearData,
        create: create,
        clone: cloneElem,
        insert: insertMethod,
        replace: replace,
        empty: empty,
        remove: remove,
        html: html,
        text: text
    };
});