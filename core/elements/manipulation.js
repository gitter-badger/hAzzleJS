// manipulation.js
hAzzle.define('Manipulation', function() {

    var _util = hAzzle.require('Util'),
        _support = hAzzle.require('Support'),
        _core = hAzzle.require('Core'),
        _types = hAzzle.require('Types'),
        _text = hAzzle.require('Text'),
        _has = hAzzle.require('has'),
        scriptStyle = /<(?:script|style|link)/i,
        tagName = /<([\w:]+)/,
        htmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        whitespace = /^\s*<([^\s>]+)/,
        scriptTag = /\s*<script +src=['"]([^'"]+)['"]>/,
        table = ['<table>', '</table>', 1],
        td = ['<table><tbody><tr>', '</tr></tbody></table>', 3],
        option = ['<select>', '</select>', 1],
        noscope = ['_', '', 0, 1],

        tagMap = {
            style: table,
            table: table,
            thead: table,
            tbody: table,
            tfoot: table,
            colgroup: table,
            caption: table,
            tr: ['<table><tbody>', '</tbody></table>', 2],
            th: td,
            td: td,
            col: ['<table><colgroup>', '</colgroup></table>', 2],
            fieldset: ['<form>', '</form>', 1],
            legend: ['<form><fieldset>', '</fieldset></form>', 2],
            option: option,
            optgroup: option,
            script: noscope,
            link: noscope,
            param: noscope,
            base: noscope
        },

        iAText = {
            prepend: 'beforeBegin',
            append: 'afterBegin',
            after: 'beforeEnd',
            before: 'afterEnd'

        },
        createHTML = function(html, context) {
            return hAzzle(create(html, context));
        },

        createScriptFromHtml = function(html, context) {
            var scriptEl = context.createElement('script'),
                matches = html.match(scriptTag);
            scriptEl.src = matches[1];
            return scriptEl;
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

        create = function(node, context) {
            if (node) {
                // Mitigate XSS vulnerability

                var defaultContext = _support.imcHTML ?
                    document.implementation.createHTMLDocument() :
                    document,
                    ctx = context || defaultContext,
                    fragment = ctx.createDocumentFragment();

                if (typeof node === 'string' && node !== '') {

                    /* Check for 'script tags' (e.g <script type="text/javascript" src="doml4.js"></script>, and
                       create it if match 
                     */
                    if (scriptTag.test(node)) {
                        return [createScriptFromHtml(node, context)];
                    }

                    // Deserialize a standard representation

                    var i, tag = node.match(whitespace),
                        sandbox = fragment.appendChild(ctx.createElement('div')),
                        els = [],
                        map = tag ? tagMap[tag[1].toLowerCase()] : null,
                        dep = map ? map[2] + 1 : 1,
                        noScoop = map && map[3];

                    if (map) {
                        sandbox.innerHTML = (map[0] + node + map[1]);
                    } else {
                        sandbox.innerHTML = node;
                    }

                    while (dep--) {
                        sandbox = sandbox.firstChild;
                    }

                    // for IE NoScope, we may insert cruft at the begining just to get it to work

                    if (noScoop && sandbox && sandbox.nodeType !== 1) {
                        sandbox = sandbox.nextSibling;
                    }

                    do {
                        if (!tag || sandbox.nodeType === 1) {
                            els.push(sandbox);
                        }
                    } while (sandbox = sandbox.nextSibling);

                    for (i in els) {
                        if (els[i].parentNode) {
                            els[i].parentNode.removeChild(els[i]);
                        }
                    }

                    return els;

                } else if (_util.isNode(node)) {
                    return [node.cloneNode(true)];
                }
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
        
            if (!hAzzle.installed.Events) {
                hAzzle.err(true, 17, "events.js module are not installed");
            }
            
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
                ret = []; // don't change original array
                for (i = 0, l = node.length; i < l; i++) {
                    ret[i] = node[i].cloneNode(true);
                }
                return ret;
            }
            return node;
        },
        createGlobal = function(elem, content, method) {
            if (typeof content === 'string' &&
                _core.isHTML &&
                elem.parentNode && elem.parentNode.nodeType === 1) {
                elem.insertAdjacentHTML(method, content.replace(htmlTag, '<$1></$2>'));
            } else {
                _util.each(normalize(content, 0), function(relatedNode) {
                    elem[method](relatedNode); // DOM Level 4
                });
            }
        },
        prepend = function(elem, content) {
            createGlobal(elem, content, 'prepend');
        },

        append = function(elem, content) {
            createGlobal(elem, content, 'append');
        };

    // insertAdjacentHTML method for append, prepend, before and after

    this.iAHMethod = function(method, html, fn) {
        return this.each(function(elem, index) {
            if (typeof html === 'string' &&
                _core.isHTML &&
                elem.parentNode && elem.parentNode.nodeType === 1) {
                elem.insertAdjacentHTML(method, html.replace(htmlTag, '<$1></$2>'));
            } else {
                fn(elem, index);
            }
        });
    };

    this.append = function(content) {
        return this.iAHMethod('beforeend', content, function(node, state) {
            if (node.nodeType === 1 || node.nodeType === 11 || node.nodeType === 9) {
                _util.each(normalize(content, state), function(relatedNode) {
                    node.appendChild(relatedNode); // DOM Level 4
                });
            }
        });
    };

    this.prepend = function(content) {
        return this.iAHMethod('afterbegin', content, function(node, state) {
            if (node.nodeType === 1 || node.nodeType === 11 || node.nodeType === 9) {
                _util.each(normalize(content, state), function(relatedNode) {
                    node.prepend(relatedNode); // DOM Level 4
                });
            }
        });
    };

    this.before = function(content) {
        return this.iAHMethod('beforebegin', content, function(node, state) {
            _util.each(normalize(content, state), function(relatedNode) {
                node.before(relatedNode); // DOM Level 4

            });
        });
    };

    this.after = function(content) {
        return this.iAHMethod('afterend', content, function(node, state) {
            _util.each(normalize(content, state), function(relatedNode) {
                node.after(relatedNode); // DOM Level 4
            });
        });
    };

    this.appendTo = function(content) {
        return this.domManip(content, function(node, el) {
            node.appendChild(el);
        });
    };

    this.prependTo = function(content) {
        return this.domManip(content, function(node, el) {
            node.insertBefore(el, node.firstChild);
        });
    };

    this.insertBefore = function(content) {
        return this.domManip(content, function(node, el) {
            node.parentNode.insertBefore(el, node);
        });
    };

    this.insertAfter = function(content) {
        return this.domManip(content, function(node, el) {
            var sibling = node.nextSibling;
            sibling ?
                node.parentNode.insertBefore(el, sibling) :
                node.parentNode.appendChild(el);
        }, 1);
    };

    // Same as 'ReplaceWith' in jQuery

    this.replace = function(html) {
        return this.each(function(el, i) {
            _util.each(normalize(html, i), function(i) {
                el.replace(i); // DOM Level 4
            });
        });
    };

    // Thanks to jQuery for the function name!!

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

    // Text

    this.text = function(value, method) {
        return value === undefined ?
            _text.getText(this.elements) :
            this.empty().each(function(elem) {
                if (method && typeof method === 'string' && typeof value === 'string' &&
                    // Firefox doesen't support insertAdjacentText
                    !_has.has('firefox')) {
                    elem.insertAdjacentText(iAText[method] || 'beforeBegin', value);
                } else {
                    if (elem.nodeType === 1 ||
                        elem.nodeType === 11 ||
                        elem.nodeType === 9) {
                        elem.textContent = value;
                    }
                }
            });
    };

    // HTML

    this.html = function(value) {

        var els = this.elements,
            elem = els[0],
            i = 0,
            l = this.length;

        if (value === undefined && els[0].nodeType === 1) {
            return els[0].innerHTML;
        }
        // See if we can take a shortcut and just use innerHTML

        if (typeof value === 'string' && !scriptStyle.test(value) &&
            !tagMap[(tagName.exec(value) || ['', ''])[1].toLowerCase()]) {

            value = value.replace(htmlTag, '<$1></$2>'); // DOM Level 4

            try {

                for (; i < l; i++) {

                    elem = els[i] || {};

                    // Remove element nodes and prevent memory leaks
                    if (elem.nodeType === 1) {
                        clearData(grab(elem, false));
                        elem.innerHTML = value;
                    }
                }

                elem = 0;

                // If using innerHTML throws an exception, use the fallback method
            } catch (e) {}
        }

        if (elem) {
            return this.empty().append(value);
        }
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
        // Do a 'deep each' and clear all listeners if any 
            deepEach(elem.children, clearData);
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        });
    };

    this.remove = function() {
        this.deepEach(clearData);
        return this.detach();
    };

    // Simple clone function
    // NOTE! This function is not so fancy as jQuery.clone(), but 
    // the Core need to be small as possible. And events can be
    // cloned with events -> this.cloneEvents().
    // So maybe a module for this in near future?? Anyone??

    this.clone = function(deep) {
        return this.map(function(elem) {
            return elem.cloneNode(deep);
        });
    };

    return {
        clearData: clearData,
        create: create,
        createHTML: createHTML,
        append: append,
        prepend: prepend
    };
});