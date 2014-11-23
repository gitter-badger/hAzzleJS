// jiesa.js
hAzzle.define('Jiesa', function() {

    var // Dependencies    

        util = hAzzle.require('util'),
        core = hAzzle.require('core'),
        collection = hAzzle.require('collection'),
        types = hAzzle.require('types'),
        features = hAzzle.require('has'),

    // RegEx
        idClassTagNameExp = /^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,
        tagNameAndOrIdAndOrClassExp = /^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,
        unionSplit = /([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,
        rattributeQuotes = /=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,
        quickMatch = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        relativeSel = /^\s*[+~]/,
        reSpace = /[\n\t\r]/g,

        pseudos = {

            ':enabled': function(elem) {
                return elem.disabled === false;
            },

            ':disabled': function(elem) {
                return elem.disabled === true;
            },

            ':checked': function(elem) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === 'input' && !!elem.checked) || (nodeName === 'option' && !!elem.selected);
            },
            ':hidden': function(elem) {
                var style = elem.style;
                if (style) {

                    if (style.display === 'none' ||
                        style.visibility === 'hidden') {
                        return true;
                    }
                }
                return elem.type === 'hidden';

            },
            ':visible': function(elem) {

                return !pseudos[':hidden'](elem);
            }
        },

        fixedRoot = function(context, query, method) {
            var oldContext = context,
                old = context.getAttribute('id'),
                nid = old || '__hAzzle__',
                hasParent = context.parentNode,
                relativeHierarchySelector = relativeSel.test(query);

            if (relativeHierarchySelector && !hasParent) {
                return [];
            }
            if (!old) {
                context.setAttribute('id', nid);
            } else {
                nid = nid.replace(/'/g, '\\$&');
            }
            if (relativeHierarchySelector && hasParent) {
                context = context.parentNode;
            }
            var selectors = query.match(unionSplit);
            for (var i = 0; i < selectors.length; i++) {
                selectors[i] = "[id='" + nid + "'] " + selectors[i];
            }
            query = selectors.join(',');

            try {
                return method.call(context, query);
            } finally {
                if (!old) {
                    oldContext.removeAttribute('id');
                }
            }
        },

        // Dependencies: DOM Level 4 matches()

        matchesSelector = function(elem, sel, ctx) {

            if (ctx && ctx.nodeType !== 9) {
                // doesn't support three args, use rooted id trick
                return fixedRoot(ctx, sel, function(query) {
                    return elem.matches(query);
                });
            }
            // We have a native matchesSelector, use that
            return elem.matches(sel);
        },

        // Determine if the element contains the klass.
        // Uses the `classList` api if it's supported.

        containsClass = function(el, cls) {
            if (features.has('classList')) {
                return el.classList.contains(cls);
            } else {
                return (' ' + el.className + ' ').replace(reSpace, ' ').indexOf(cls) >= 0;
            }
        },

        normalizeCtx = function(root) {
            if (!root) {
                return document;
            }
            if (typeof root === 'string') {
                return jiesa(root);
            }
            if (!root.nodeType && types.isArrayLike(root)) {
                return root[0];
            }
            return root;
        },

        // Find elements by selectors.

        jiesa = function(sel, ctx) {
            var m, nodeType, elem, ret, results = [];

            ctx = normalizeCtx(ctx);

            if (!sel || typeof sel !== 'string') {
                return results;
            }

            if ((nodeType = ctx.nodeType) !== 1 && nodeType !== 9 && nodeType !== 11) {
                return [];
            }

            if (core.isHTML) {

                if ((m = idClassTagNameExp.exec(sel))) {
                    if ((sel = m[1])) {
                        if (nodeType === 9) {
                            elem = ctx.getElementById(sel);
                            if (elem && elem.id === sel) {
                                return [elem];
                            } else {
                                return [];
                            }
                        } else {
                            // Context is not a document
                            if (ctx.ownerDocument && (elem = ctx.ownerDocument.getElementById(sel)) &&
                                core.contains(ctx, elem) && elem.id === m) {
                                return [elem];
                            }
                        }
                    } else if ((sel = m[2])) {
                        ret = ctx.getElementsByClassName(sel);
                    } else if ((sel = m[3])) {
                        ret = ctx.getElementsByTagName(sel);
                    }
                    return collection.slice(ret);
                    // E.g. hAzzle( 'span.selected' )  
                } else if ((m = tagNameAndOrIdAndOrClassExp.exec(sel))) {
                    var result = ctx.getElementsByTagName(m[1]),
                        id = m[2],
                        className = m[3];
                    util.each(result, function(el) {
                        if (el.id === id || containsClass(el, className)) {
                            results.push(el);
                        }
                    });
                    return results;
                }
            }

            // Fallback to QSA if the native selector engine are not installed
            // Fixme! Check for installed selector engine will be set to false soon

            if (core.qsa && (!core.QSABugs || !core.QSABugs.test(sel))) {
                try {
                    if (ctx.nodeType === 1) {
                        ret = fixedRoot(ctx, sel, ctx.querySelectorAll);
                    } else {
                        // we can use the native qSA
                        ret = ctx.querySelectorAll(sel);
                    }
                    return collection.slice(ret);
                } catch (e) {}
            }
        },

        // Speeding up matches
        // Many people uses "is(':hidden') / "is(':visible'), so to make them happy we introduced basic 
        // CSS2 / CSS3 pseudo support

           matches = function(elem, sel, ctx) {

            if (sel && sel.nodeType) {
                return elem === sel;
            }

            // Make sure that attribute selectors are quoted
            sel = typeof sel === 'string' ? sel.replace(rattributeQuotes, "='$1']") : sel;

            // If instance of hAzzle

            if (sel instanceof hAzzle) {
                return util.some(sel.elements, function(sel) {
                    return matches(elem, sel);
                });
            }

            var quick = quickMatch.exec(sel);

            if (quick) { 
                //   0  1    2   3          4
                // [ _, tag, id, attribute, class ]
                if (quick[1]) {
                    quick[1] = quick[1].toLowerCase();
                }
                if (quick[3]) {
                    quick[3] = quick[3].split('=');
                }
                if (quick[4]) {
                    quick[4] = ' ' + quick[4] + ' ';
                }

                return (
                    (!quick[1] || elem.nodeName.toLowerCase() === quick[1]) &&
                    (!quick[2] || elem.id === quick[2]) &&
                    (!quick[3] || (quick[3][1] ? elem.getAttribute(quick[3][0]) === quick[3][1] : elem.hasAttribute(quick[3][0]))) &&
                    (!quick[4] || (' ' + elem.className + ' ').indexOf(quick[4]) >= 0)
                );
            } else {

                if ((m = pseudos[sel])) {
                    return !!m(elem);
                } else {

                    if (core.matches && core.isHTML &&
                        (!core.rbuggyMatches || !core.rbuggyMatches.test(sel)) &&
                        (!core.QSABugs || !core.QSABugs.test(sel))) {

                        try {
                            var ret = matchesSelector(elem, sel, ctx);

                            // IE 9's matchesSelector returns false on disconnected nodes
                            if (ret || core.disconMatch ||

                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9
                                elem.document && elem.document.nodeType !== 11) {
                                return ret;
                            }
                        } catch (e) {}
                    } else {
                        hAzzle.err(true, 23, ' jiesa.js module need to be installed');
                    }
                }
            }

        };

    this.find = function(selector, context, /*internal*/ internal) {

        if (!internal) {

            if (typeof selector !== 'string') {

                var i = 0,
                    len = this.length,
                    self = this.elements;

                return hAzzle(util.filter(hAzzle(selector).elements, function(node) {
                    for (; i < len; i++) {  
                        if (core.contains(self[i], node)) {
                            return true;
                        }
                    }
                }));
            }
            return util.reduce(this.elements, function(els, element) { 
                return hAzzle(els.concat(collection.slice(jiesa(selector, element))));
            }, []);

        }

        return jiesa(selector, context);
    };

    // Filter element collection

    this.filter = function(sel, not) {

        if (sel === undefined) {
            return this;
        }
        if (typeof sel === 'function') {
            var els = [];
            this.each(function(el, index) {
                if (sel.call(el, index)) {
                    els.push(el);
                }
            });

            return hAzzle(els);

        } else {
            return this.filter(function() {
                return matches(this, sel) !== (not || false);
            });
        }
    };
   
    return {
        matchesSelector: matchesSelector,
        matches: matches,
        pseudos: pseudos,
        find: jiesa
    };
});