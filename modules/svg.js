// svg.js
hAzzle.define('svg', function() {

    // Main hAzzle module methods for SVG ( Scalable Vector Graphics. )

    var // Dependencies
        features = hAzzle.require('has'),
        storage = hAzzle.require('storage'),
        util = hAzzle.require('util'),
        style = hAzzle.require('style'),
        types = hAzzle.require('types'),

        // Whitespace regEx

        whiteSpace = /\s+/,

        // SVG prefix regEx

        svgPrefix = /^svg.*/,

        // SVG namespace

        svgNS = 'http://www.w3.org/2000/svg',

        // Xml namespace

        xmlNS = 'http://www.w3.org/2000/xmlns/',

        // XLink namespace

        xlinkNS = 'http://www.w3.org/1999/xlink';

    //# FEATURE DETECTION

    // SVG support test

    features.add('SVG', !!document.createElementNS &&
        !!document.createElementNS(svgNS, 'svg').createSVGRect
    );

    // Create SVG element
    var create = function(name) {
            return document.createElementNS(svgNS, name);
        },

        // Determine if any nodes are SVG nodes
        anySVG = function(checkSet) {
            var i = 0,
                len = checkSet.length;
            for (; i < len; i++) {
                if (checkSet[i].nodeType == 1 && checkSet[i].namespaceURI === svgNS) {
                    return true;
                }
            }
            return false;
        },
        grep = function(elems, callback, arg) {
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !arg;

            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }

            return matches;
        },

        getClasses = function(elem) {
            return (!types.isSVGElem(elem) ? elem.className :
                (elem.className ? elem.className.baseVal : elem.getAttribute('class'))) || '';
        },

        setClassNames = function(elem, classes) {
            (elem.className ? elem.className.baseVal = classes : elem.setAttribute('class', classes));
        };

    //# REMOVE / SET ATTRIBUTES        

    if (hAzzle.installed.setters) {

        this.attr = function(origAttr) {
            return function(name, value, type) {
                if (typeof name === 'string' && value === undefined) { // Return attribute value
                    var val = origAttr.apply(this, arguments),
                        i = 0;
                    if (val && val.baseVal && val.baseVal.numberOfItems != null) { // Multiple values
                        value = '';
                        val = val.baseVal;
                        if (name === 'transform') {
                            for (; i < val.numberOfItems; i++) {
                                var itm = val.getItem(i);

                                if (itm.type === 1) {
                                    value += ' matrix(' + itm.matrix.a + ',' + itm.matrix.b + ',' +
                                        itm.matrix.c + ',' + itm.matrix.d + ',' +
                                        itm.matrix.e + ',' + itm.matrix.f + ')';
                                } else if (itm.type === 2) {
                                    value += ' translate(' + itm.matrix.e + ',' + itm.matrix.f + ')';
                                } else if (itm.type === 3) {
                                    value += ' scale(' + itm.matrix.a + ',' + itm.matrix.d + ')';
                                } else if (itm.type === 4) {
                                    value += ' rotate(' + itm.angle + ')';
                                } else if (itm.type === 5) {
                                    value += ' skewX(' + itm.angle + ')';
                                } else if (itm.type === 6) {
                                    value += ' skewY(' + itm.angle + ')';
                                }
                            }
                            val = value.substr(1);
                        } else {
                            val = val.getItem(0).valueAsString;
                        }
                    }
                    return (val && val.baseVal ? val.baseVal.valueAsString : val);
                }

                var options = name;
                if (typeof name === 'string') {
                    options = {};
                    options[name] = value;
                }
                if (types.isType('Function')(value)) {
                    return hAzzle(this).each(function(elem, index) {
                        hAzzle(elem).attr(name, value.call(elem, index, hAzzle(elem).attr(name)));
                    });
                }
                var origArgs = arguments;

                return hAzzle(this).each(function() {
                    if (types.isSVGElem(this)) {
                        var n;
                        for (n in options) {
                            (type ? this.style[n] = options[n] : this.setAttribute(n, options[n]));
                        }
                    } else {
                        origAttr.apply(hAzzle(this), origArgs);
                    }
                });
            };
        }(this.attr);

        // Remove SVG attribute 
        this.removeAttr = function(origRemoveAttr) {
            return function(names) {
                var origArgs = arguments;
                return this.each(function(elem) {
                    if (types.isSVGElem(elem)) {
                        util.each(names.split(whiteSpace), function(name) {
                            (elem[name] && elem[name].baseVal ? elem[name].baseVal.value = null : elem.removeAttribute(name));
                        });
                    } else {
                        origRemoveAttr.apply(hAzzle(elem), origArgs);
                    }
                });
            };
        }(this.removeAttr);
    }

    //# CLASS MANIPULATION

    if (hAzzle.installed.classes) {
        //  Add class(es) to element
        this.addClass = function(origAddClass) {
            return function(clazz) {
                if (types.isType('Function')(classNames)) {
                    return this.each(function(elem, index) {
                        hAzzle(elem).addClass(classNames.call(elem, index, getClasses(elem)));
                    });
                }
                var origArgs = arguments,
                    els = this.elements,
                    classNames = clazz || '',
                    i = 0,
                    len = els.length;
                // Faster then each() 
                for (; i < len; i++) {
                    if (types.isSVGElem(els[i])) {
                        util.each(classNames.split(whiteSpace), function(className) {
                            var classes = getClasses(els[i]);
                            if (!classes.split(whiteSpace).contains(className)) {
                                setClassNames(els[i], classes += (classes ? ' ' : '') + className);
                            }
                        });
                    } else { // Use original Core methods
                        origAddClass.apply(hAzzle(els[i]), origArgs);
                    }
                }
            };
        }(this.addClass);
        // Remove class(es) from element
        this.removeClass = function(origRemoveClass) {
            return function(clazz) {
                if (types.isType('Function')(classNames)) {
                    return this.each(function(elem, index) {
                        hAzzle(elem).removeClass(classNames.call(elem, index, getClasses(elem)));
                    });
                }

                var origArgs = arguments,
                    els = this.elements,
                    classNames = clazz || '',
                    i = 0,
                    len = els.length;
                // Faster then each()
                for (; i < len; i++) {
                    if (types.isSVGElem(els[i])) {
                        util.each(classNames.split(whiteSpace), function(className) {
                            var cls = getClasses(els[i]);
                            cls = grep(cls.split(whiteSpace), function(n) {
                                return n !== className;
                            }).join(' ');
                            setClassNames(els[i], cls);
                        });
                    } else { // Use original Core methods
                        origRemoveClass.apply(hAzzle(els[i]), origArgs);
                    }
                }
            };
        }(this.removeClass);

        // Toggle class(es) on element
        this.toggleClass = function(origToggleClass) {
            return function(clazz, state) {
                if (types.isType('Function')(clazz)) {
                    return this.each(function(elem, index) {
                        hAzzle(elem).toggleClass(clazz.call(elem, index, getClasses(elem), state), state);
                    });
                }
                var origArgs = arguments,
                    hasState = (typeof state === 'boolean');

                return this.each(function() {
                    if (types.isSVGElem(this)) {
                        if (typeof clazz === 'string') {
                            var elem = hAzzle(this);
                            util.each(clazz.split(whiteSpace), function(className) {
                                if (!hasState) {
                                    state = !elem.hasClass(className);
                                }
                                elem[(state ? 'add' : 'remove') + 'Class'](className);
                            });
                        } else {
                            var cls = getClasses(this);
                            if (cls) {
                                storage.private.get(this, '__className__', cls);
                            }
                            // Toggle whole className
                            setClassNames(this, cls || clazz === false ? '' :
                                storage.private.set(this, '__className__') || '');
                        }
                    } else { // Use original Core methods                        
                        origToggleClass.apply(hAzzle(this), origArgs);
                    }
                });
            };
        }(this.toggleClass);

        // Check if element contains class name(s)

        this.hasClass = function(origHasClass) {
            return function(clazz) {
                var found = false,
                    className = clazz || '';
                this.each(function() {
                    if (types.isSVGElem(this)) {
                        found = getClasses(this).split(whiteSpace).cointains(getClasses(this));
                    } else {
                        found = (origHasClass.apply(hAzzle(this), [className]));
                    }
                    return !found;
                });
                return found;
            };
        }(this.hasClass);
    }

    //#CSS

    this.css = function(origCSS) {
        return function(elem, name) {
            var value = name ? (name.match(svgPrefix) ? hAzzle(elem).attr(style.cssProps[name] || name) : '') : false;
            return value || origCSS(elem, name);
        };
    }(this.css);

    return {
        svgNS: svgNS,
        xmlNS: xmlNS,
        xlinkNS: xlinkNS,
        anySVG: anySVG,
        support: features.has('SVG'),
        create: create,
    };
});