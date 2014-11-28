// svg.js
hAzzle.define('svg', function() {

    // SVG ( Scalable Vector Graphics ) support

    var // Dependencies
        features = hAzzle.require('has'),
        storage = hAzzle.require('storage'),
        strings = hAzzle.require('strings'),
        util = hAzzle.require('util'),
        core = hAzzle.require('core'),
        style = hAzzle.require('style'),
        types = hAzzle.require('types'),

        // Whitespace regEx

        whiteSpace = /\s+/,

        rclass = /[\t\r\n]/g,

        rspace = /\s+/,

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

    // Method for creating a SVG element

    var create = function(name) {
            return document.createElementNS(svgNS, name);
        },

        setClassNames = function(elem, classes) {
            (elem.className ? elem.className.baseVal = classes : elem.setAttribute('class', classes));
        };

    //# CLASS MANIPULATION

    // Common function for add / remove classes

    this.addRemove = function(value, method, fn) {
        method = method + 'Class';

        var classNames, i, l;

        if (types.isFunction(value)) {
            return this.each(function(j) {
                hAzzle(this)[method](value.call(this, j, this.className));
            });
        }

        if (value && typeof value === 'string') {
            classNames = value.split(rspace);
            for (i = 0, l = this.length; i < l; i++) {
                fn(this.elements[i], value, classNames);
            }
        }
        return this;
    }

    // addClass

    this.addClass = function(value) {
        return this.addRemove(value, 'add', function(elem, value, classNames) {
            if (elem.nodeType === 1) {
                if (!(elem.className && elem.getAttribute('class')) && classNames.length === 1) {
                    if (types.isSVGElem(elem)) {
                        (elem.className ? elem.className.baseVal = value : elem.setAttribute('class', value));
                    } else {
                        elem.className = value;
                    }
                } else {
                    var c = 0,
                        cl = classNames.length,
                        setClass = !types.isSVGElem(elem) ? elem.className :
                        elem.className ? elem.className.baseVal :
                        elem.getAttribute('class');

                    setClass = (' ' + setClass + ' ');

                    for (; c < cl; c++) {
                        // ECMA-7 contains() 
                        if (!setClass.contains(classNames[c])) {
                            setClass += classNames[c] + ' ';
                        }
                    }

                    setClass = strings.trim(setClass);
                    if (types.isSVGElem(elem)) {

                        (elem.className ? elem.className.baseVal = setClass : elem.setAttribute('class', setClass));
                    } else {
                        elem.className = setClass;
                    }
                }
            }
        });
    };

    // Remove a single class, multiple classes, or all classes from each element in the set of matched elements.

    this.removeClass = function(value) {

        return this.addRemove(value, 'remove', function(elem, value, classNames) {
            if (elem.nodeType === 1 && (elem.className || elem.getAttribute('class'))) {
                if (value) {
                    className = !types.isSVGElem(elem) ? elem.className :
                        elem.className ? elem.className.baseVal :
                        elem.getAttribute('class');

                    className = (' ' + className + ' ').replace(rclass, ' ');

                    for (c = 0, cl = classNames.length; c < cl; c++) {
                        // ECMA-7 contains()
                        while (className.contains(classNames[c])) {
                            className = className.replace(' ' + classNames[c] + ' ', ' ');
                        }
                    }

                    className = strings.trim(className);
                } else {
                    className = '';
                }

                if (types.isSVGElem(elem)) {
                    (elem.className ? elem.className.baseVal = className : elem.setAttribute('class', className));
                } else {
                    elem.className = className;
                }
            }
        });

        var classNames, i, l, elem, className, c, cl;

        if (types.isFunction(value)) {
            return this.each(function(j) {
                hAzzle(this).removeClass(value.call(this, j, this.className));
            });
        }

        if ((value && typeof value === 'string') || value === undefined) {
            classNames = (value || '').split(rspace);

            for (i = 0, l = this.length; i < l; i++) {
                elem = this.elements[i];
            }
        }

        return this;
    };

    // Check if element contains class name(s)

    this.hasClass = function(clazz) {

        var className = ' ' + clazz + ' ',
            i = 0,
            l = this.length,
            elem, classes;

        for (; i < l; i++) {
            elem = this.elements[i];
            if (elem.nodeType === 1) {
                classes = !types.isSVGElem(elem) ? elem.className :
                    elem.className ? elem.className.baseVal :
                    elem.getAttribute('class');
                if ((' ' + classes + ' ').replace(rclass, ' ').contains(className)) {
                    return true;
                }
            }
        }

        return false;
    };

    // Toggle class(es) on element

    this.toggleClass = function(value, stateVal) {
        var type = typeof value;

        if (typeof stateVal === 'boolean' && type === 'string') {
            return stateVal ? this.addClass(value) : this.removeClass(value);
        }

        if (types.isFunction(value)) {
            return this.each(function(i) {
                hAzzle(this).toggleClass(
                    value.call(this, i, this.className, stateVal), stateVal
                );
            });
        }

        return this.each(function() {

            if (type === 'string') {
                // Toggle individual class names
                var className,
                    i = 0,
                    self = hAzzle(this),
                    classNames = value.match((/\S+/g)) || [];

                while ((className = classNames[i++])) {
                    // Check each className given, space separated list
                    if (self.hasClass(className)) {
                        self.removeClass(className);
                    } else {
                        self.addClass(className);
                    }
                }

                // Toggle whole class name
            } else if (value === undefined || type === 'boolean') {

                if (types.isSVGElem(this)) {
                    var classes = this.className ? this.className.baseVal :
                        this.getAttribute('class');

                    if (classes) {
                        storage.private.get(this, '__SVGclazz__', classes); // store className if set
                    }
                    // toggle whole className
                    setClassNames(this, classes || classNames === false ? '' : storage.private.get(this, '__SVGclazz__') || '');
                }



                if (this.className) {
                    // store className if set
                    storage.private.set(this, '__SVGclazz__', this.className);
                }

                this.className = this.className || value === false ?
                    '' :
                    storage.private.get(this, '__SVGclazz__') || '';
            }
        });
    };

    // Extend isXML function check in the Core.js module

    core.isXML = function(origIsXml) {
        return function(elem) {
            return types.isSVGElem(elem) || origIsXml(elem);
        }
    }(core.isXML)

    //#CSS

    this.css = function(origCSS) {
        return function(elem, name, value) {
            var value = name ? (name.match(svgPrefix) ? hAzzle(elem).attr(style.cssProps[name] || name) : '') : false;
            return value || origCSS(elem, name, value);
        };
    }(this.css);

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
                if (types.isFunction(value)) {
                    return hAzzle(this).each(function(elem, i) {
                        hAzzle(elem).attr(name, value.call(elem, i, hAzzle(elem).attr(name)));
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
    return {
        svgNS: svgNS,
        xmlNS: xmlNS,
        xlinkNS: xlinkNS,
        support: features.has('SVG'),
        create: create,
    };
});