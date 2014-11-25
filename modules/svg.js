// svg.js
hAzzle.define('svg', function() {

    var // Dependencies
        features = hAzzle.require('has'),
        storage = hAzzle.require('storage'),
        util = hAzzle.require('util'),
        types = hAzzle.require('types'),

        // Whitespace regEx

        whiteSpace = /\s+/,

        // Class regEx

        rclass = /[\n\t\r]/g,

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

    // Method for element creation
    var create = function(name) {
            // create element
            return document.createElementNS(ns, name);
        },

        // Get id from reference string
        idFromReference = function(url) {
            var m = url.toString().match(/#([a-z0-9\-_]+)/i);

            if (m) {
                return m[1];
            }
        },

        getID = function(id) {
            var node = document.getElementById(idFromReference(id) || id);
            if (node) {
                return node.instance;
            }
        },

        grep = function(elems, callback, invert) {
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;

            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }

            return matches;
        },
        inArray = function(elem, arr, i) {
            return arr == null ? -1 : indexOf.call(arr, elem, i);
        },

        getClassNames = function(elem) {
            return (!types.isSVGElem(elem) ? elem.className :
                (elem.className ? elem.className.baseVal : elem.getAttribute('class'))) || '';
        },

        setClassNames = function(elem, classes) {
            (elem.className ? elem.className.baseVal = classes : elem.setAttribute('class', classes));
        };


    //# REMOVE / SET ATTRIBUTES        

    this.attr = function(origAttr) {
        return function(name, value, type) {
            if (typeof name === 'string' && value === undefined) { // Return attribute value
                var val = origAttr.apply(this, arguments);
                if (val && val.baseVal && val.baseVal.numberOfItems != null) { // Multiple values
                    value = '';
                    val = val.baseVal;
                    if (name === 'transform') {
                        for (var i = 0; i < val.numberOfItems; i++) {
                            var item = val.getItem(i);
                            switch (item.type) {
                                case 1:
                                    value += ' matrix(' + item.matrix.a + ',' + item.matrix.b + ',' +
                                        item.matrix.c + ',' + item.matrix.d + ',' +
                                        item.matrix.e + ',' + item.matrix.f + ')';
                                    break;
                                case 2:
                                    value += ' translate(' + item.matrix.e + ',' + item.matrix.f + ')';
                                    break;
                                case 3:
                                    value += ' scale(' + item.matrix.a + ',' + item.matrix.d + ')';
                                    break;
                                case 4:
                                    value += ' rotate(' + item.angle + ')';
                                    break; // Doesn't handle new origin
                                case 5:
                                    value += ' skewX(' + item.angle + ')';
                                    break;
                                case 6:
                                    value += ' skewY(' + item.angle + ')';
                                    break;
                            }
                        }
                        val = value.substring(1);
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
                return hAzzle(this).each(function(i) {
                    hAzzle(this).attr(name, value.call(this, i, hAzzle(this).attr(name)));
                });
            }
            var origArgs = arguments;
            return hAzzle(this).each(function() {
                if (types.isSVGElem(this)) {
                    for (var n in options) {
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
            return this.each(function() {
                if (types.isSVGElem(this)) {
                    var node = this;
                    util.each(names.split(whiteSpace), function(i, name) {
                        (node[name] && node[name].baseVal ? node[name].baseVal.value = null : node.removeAttribute(name));
                    });
                } else {
                    origRemoveAttr.apply(hAzzle(this), origArgs);
                }
            });
        };
    }(this.removeAttr);

    //# CLASS MANIPULATION

    this.addClass = function(origAddClass) {
        return function(classNames) {
            if (types.isType('Function')(classNames)) {
                return this.each(function(i) {
                    hAzzle(this).addClass(classNames.call(this, i, getClassNames(this)));
                });
            }
            var origArgs = arguments;
            classNames = classNames || '';
            return this.each(function() {
                if (types.isSVGElem(this)) {
                    var node = this;
                    util.each(classNames.split(whiteSpace), function(i, className) {
                        var classes = getClassNames(node);
                        if (inArray(className, classes.split(whiteSpace)) === -1) {
                            setClassNames(node, classes += (classes ? ' ' : '') + className);
                        }
                    });
                } else {
                    origAddClass.apply($(this), origArgs);
                }
            });
        };
    }(this.addClass);

    this.removeClass = function(origRemoveClass) {
        return function(classNames) {
            if (types.isType('Function')(classNames)) {
                return this.each(function(i) {
                    hAzzle(this).removeClass(classNames.call(this, i, getClassNames(this)));
                });
            }
            var origArgs = arguments;
            classNames = classNames || '';
            return this.each(function() {
                if (types.isSVGElem(this)) {
                    var node = this;
                    util.each(classNames.split(whiteSpace), function(i, className) {
                        var classes = getClassNames(node);
                        classes = grep(classes.split(whiteSpace), function(n, i) {
                            return n !== className;
                        }).join(' ');
                        setClassNames(node, classes);
                    });
                } else {
                    origRemoveClass.apply(hAzzle(this), origArgs);
                }
            });
        };
    }(this.removeClass);

    /** Support toggling class names on SVG nodes.
    	@param classNames {string} The classes to toggle. */
    this.toggleClass = function(origToggleClass) {
        return function(classNames, state) {
            if (types.isType('Function')(classNames)) {
                return this.each(function(i) {
                    hAzzle(this).toggleClass(classNames.call(this, i, getClassNames(this), state), state);
                });
            }
            var origArgs = arguments,
                hasState = (typeof state === 'boolean');

            return this.each(function() {
                if (types.isSVGElem(this)) {
                    if (typeof classNames === 'string') {
                        var node = $(this);
                        util.each(classNames.split(whiteSpace), function(i, className) {
                            if (!hasState) {
                                state = !node.hasClass(className);
                            }
                            node[(state ? 'add' : 'remove') + 'Class'](className);
                        });
                    } else {
                        var classes = getClassNames(this);
                        if (classes) {
                            storage.private.get(this, '__className__', classes); // store className if set
                        }
                        // toggle whole className
                        setClassNames(this, classes || classNames === false ? '' : storage.private.set(this, '__className__') || '');
                    }
                } else {
                    origToggleClass.apply(hAzzle(this), origArgs);
                }
            });
        };
    }(this.toggleClass);

    this.hasClass = function(origHasClass) {
        return function(className) {
            className = className || '';
            var found = false;
            this.each(function() {
                if (types.isSVGElem(this)) {
                    found = getClassNames(this).split(whiteSpace).cointains(getClassNames(this))
                } else {
                    found = (' ' + this.className + ' ').replace(rclass, ' ').contains(className)
                }
                return !found;
            });
            return found;
        };
    }(this.hasClass);

    return {
        svgNS: svgNS,
        xmlNS: xmlNS,
        xlinkNS: xlinkNS,
        support: features.has('SVG'),
        create: create,
        get: getID
    };
});