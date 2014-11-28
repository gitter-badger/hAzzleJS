// svg.js
hAzzle.define('svg', function() {

    // SVG ( Scalable Vector Graphics ) support

    var // Dependencies
        storage = hAzzle.require('storage'),
        strings = hAzzle.require('strings'),
        types = hAzzle.require('types'),

        // Whitespace regEx

        whiteSpace = /\s+/,

        // Class regEx

        rclass = /[\t\r\n]/g,

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
            classNames = value.split(whiteSpace);
            for (i = 0, l = this.length; i < l; i++) {
                fn(this.elements[i], value, classNames);
            }
        }
        return this;
    };

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
                    var c = 0, cl = classNames.length, className = !types.isSVGElem(elem) ? elem.className :
                        elem.className ? elem.className.baseVal :
                        elem.getAttribute('class'),
                        className = (' ' + value + ' ').replace(rclass, ' ');

                    for (; c < cl; c++) {
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


    return {};
});