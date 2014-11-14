// manipulation.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('manipulation', function() {

    var _doc = window.document,

        // Dependencies

        util = hAzzle.require('util'),

        // RegExp

        checkradioRegExp = (/^(?:checkbox|radio)$/i),
        htmlRegexp = /<|&#?\w+;/,
        tagRegExp = /<([\w:]+)/,
        scriptRegExp = /<(?:script|style|link)/i,
        xhtmlRegxp = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,

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

        getElem = function(elem) {
            return elem instanceof hAzzle ? elem.elements : [elem];
        },

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

            elem = getElem(elem)[0];

            var source = elem.nodeType && elem.cloneNode(true),
                destElements,
                srcElements,
                i, l;
            if (source) {
                // Fix IE cloning issues
                if (!cloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) &&
                    !hAzzle.require('core').isXML(elem)) {

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
                        hAzzle.require('events').clone(destElements[i], srcElements[i], evtName);
                    }
                }
                return source;
            }
        },

        deepEach = function(array, fn, context) {
            if (array) {
                var index = array.length;
                while (index--) {
                    if (hAzzle.require('types').isNode(array[index])) {
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

                // Faster then internal each method

                i = 0;

                while ((elem = nodes[i++])) {
                    fragment.appendChild(elem);

                }
                return fragment;
            }
        },

        create = function(html, context) {

            // Mitigate XSS vulnerability

            var parsed, defaultContext = imcHTML ?
                _doc.implementation.createHTMLDocument() :
                _doc;

            if ((parsed = /^<(\w+)\s*\/?>(?:<\/\1>|)$/.exec(html))) {
                return [context.createElement(parsed[1])];
            }

            if ((parsed = buildFragment(html, defaultContext))) {
                 return hAzzle.require('collection').slice(parsed.childNodes);
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

        // Removes the data associated with an element

        clearData = function(elems) {

            // Check if the events.js module are installed, and clear events
            // if it is, to prevent memory leaks

            hAzzle.err(!hAzzle.installed.events, 17, 'events.js module are not installed');

            var elem = getElem(elems),
                el, i = 0;

            // If instanceof hAzzle...

            for (;
                (el = elem[i]) !== undefined; i++) {
                // Remove all eventListeners
                hAzzle(el).off();
            }
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
        },
        // Private method for inject HTML content for the global scope
        inject = function(elem, content, pos, method) {
            var node = normalize(content, pos ? pos : 0),
                i = 0,
                l = node.length;

            // 'Normal' iteration faster then internal 'each'
            for (; i < l; i++) {
                elem[method](node[i]); // DOM Level 4
            }
        },
        append = function(elem, content) {
            util.each(getElem(elem), function(elem, pos) {
                inject(elem, content, pos, 'append');
            });
        },
        prepend = function(elem, content) {
            util.each(getElem(elem), function(elem, pos) {
                inject(elem, content, pos, 'prepend');
            });
        },
        before = function(elem, content) {
            util.each(getElem(elem), function(elem, pos) {
                inject(elem, content, pos, 'before');
            });
        },
        after = function(elem, content) {
            util.each(getElem(elem), function(elem, pos) {
                inject(elem, content, pos, 'after');
            });
        },
        html = function(elem, value) {

            var append = function(el, i) {
                    util.each(normalize(value, getElem(elem), i), function(node) {
//                         el.append(node); // DOM Level 4
                    });
                },
                updateElement = function(el, i) {
                    try {

                        if (el.nodeType === 1 && typeof value === 'string' && !scriptRegExp.test(value) &&
                            !wrapMap[(tagRegExp.exec(value) || ['', ''])[1].toLowerCase()]) {
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

            return util.each([elem], updateElement);
        },

        text = function(elem, value) {

            elem = getElem(elem)[0];
          
          if(value === undefined) {
           return hAzzle.require('text').getText(elem);
          }
        
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
        };

    // insertAdjacentHTML method for append, prepend, before and after

    this.iAHMethod = function(method, html, fn) {
        return this.each(function(elem, index) {
            if (typeof html === 'string' &&
                hAzzle.require('core').isHTML &&
                elem.parentElement && elem.parentElement.nodeType === 1) {
                elem.insertAdjacentHTML(method, html.replace(xhtmlRegxp, '<$1></$2>'));
            } else {
                fn(elem, index);
            }
        });
    };

    this.domManip = function(content, fn, /*reverse */ rev) {
        var i = 0,
            r = [],
            self = this.elements,
            elems, nodes = hAzzle(content);
        // Start the iteration and loop through the content

        util.each(normalize(nodes), function(elem, index) {
            util.each(self, function(el) {
                elems = index > 0 ? el.cloneNode(true) : el;
                if (elem) {
                    fn(elem, elems);
                }
            }, null, rev);

        }, this, rev);
        self.length = i;
        util.each(r, function(e) {
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

    // Replace each element in the set of matched elements with the 
    // provided new content and return the set of elements that was removed

    this.replaceWith = function(node) {
        return this.each(function (el, index) {
          util.each(normalize(node, index), function (content) {
              el.replace(content); // DOM Level 4
          })
        })
    };

    // Text

    this.text = function(value) {
        return value === undefined ?
            hAzzle.require('text').getText(this.elements) :
            this.each(function(elem) {
                if (elem !== null) {
                    text(elem, value);
                }
            });
    };

    // HTML

    this.html = function(value) {
        return this.elements[0] && (value === undefined && this.elements[0].nodeType === 1 ?
            this.elements[0].innerHTML :
            this.each(function() {
                return html(this, value);
            }));
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
            return this.iAHMethod(iah, content, function(elem) {
                var nodeType = elem.nodeType;
                if (nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
                    return;
                }
                util.each(getElem(elem), function(elem, pos) {
                    inject(elem, content, pos, prop);
                });
            });
        };

    }.bind(this));

    return {
        prepend: prepend,
        append: append,
        before: before,
        after: after,
        empty: empty,
        html: html,
        text: text,
        create: create,
        clone: cloneElem,
        buildFragment: buildFragment
    };
});