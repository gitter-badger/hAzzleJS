// classes.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('classes', function() {

    var // Dependencies 

        util = hAzzle.require('util'),
        storage = hAzzle.require('storage'),
        strings = hAzzle.require('strings'),
        types = hAzzle.require('types'),
        reSpace = /[\n\t\r]/g,
        witespace = /\s+/,
        a1 = [''],
        clist,
        supportsMultipleArgs;

    (function() {

        //IE9 doesn't support classList

        clist = !!document.documentElement.classList;

        // #IE 10 - 11 - Detect if the classList API supports multiple arguments
        var div = document.createElement('div');
        div.classList.add('a', 'b');
        supportsMultipleArgs = /(^| )a( |$)/.test(div.className) && /(^| )b( |$)/.test(div.className);
        // release memory in IE
        div = null;
    }());

    // Convert a string - set of class names - to an array

    var str2array = function(classes) {
            if (typeof classes === 'string') {
                if (classes && !witespace.test(classes)) {
                    a1[0] = classes;
                    return a1;
                }

                var arr = classes.split(witespace);

                if (arr.length && !arr[0]) {
                    arr.shift();
                }
                if (arr.length && !arr[arr.length - 1]) {
                    arr.pop();
                }
                return arr;
            }
            // Assumed to be an array
            if (!classes) {
                return [];
            }
            return classes;
        },
        getElem = function(elem) {
            return elem instanceof hAzzle ? elem.elements : elem.length ? elem : [elem];
        },
        addRemove = function(elem, classes, nativeMethodName, fn, done) {

            if (nativeMethodName === 'remove' && (classes === undefined || classes == null)) {
                return elem.className = '';
            }

            // Array support (e.g. ['hello', 'world']  

            classes = str2array(classes);

            // Use native classList property if possible

            if (clist) {

                if (supportsMultipleArgs) {

                    // Check if the 'elem' are a valid DOM elem and not a window object, by checking
                    // if the classList exist on the 'elem'. 

                    return elem.classList && elem.classList[nativeMethodName].apply(elem.classList, classes);

                } else {

                    fn = function(elem, clazz) {
                        return elem.classList[nativeMethodName](clazz);
                    };
                }
            }
            var length = classes.length,
                i;

            for (i = 0; i < length; i++) {

                // Don't define a global className on the window or document object

                if (elem.nodeType && elem.nodeType !== 9) {
                    fn(elem, classes[i]);
                }
            }
            // Callback function (if provided) that will be fired after the
            // className value has been added / removed to / from the element 

            if (types.isType('Function')(done)) {
                done.call(elem, elem);
            }
        },

        // Check if element contains class name(s)

        hasClass = function(elem, classes) {
            var className = ' ' + classes + ' ',
                els = elem instanceof hAzzle ? elem.elements[0] : elem.length ? elem : [elem],
                i = 0,
                l = els.length;

            for (; i < l; i++) {
                if (els[i].nodeType === 1) {
                    if (clist && els[i].classList.contains(classes)) {
                        return true;
                    } else { // #IE9 
                        if ((' ' + els[i].className + ' ').replace(reSpace, ' ').contains(className)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        //  Add class(es) to element

        addClass = function(elem, classes, /*optional*/ fn) {
            util.each(getElem(elem), function(elem) {
                if (elem.nodeType === 1) {
                    return addRemove(elem, classes, 'add', function(elem, clazz) {

                        var cur = (' ' + elem.className + ' ').replace(reSpace, ' '),
                            finalValue;
                        // ECMA 7 - contains
                        if (!cur.contains(' ' + clazz + ' ')) {
                            cur += clazz + ' ';
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = strings.trim(cur);
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }, fn);
                }
            });
            return elem;
        },

        // Remove class(es) from element

        removeClass = function(elem, classes, /*optional*/ fn) {
            util.each(getElem(elem), function(elem) {
                if (elem.nodeType === 1) {
                    return addRemove(elem, classes, 'remove', function(elem, clazz) {

                        var cur = (' ' + elem.className + ' ').replace(reSpace, ' '),
                            finalValue;

                        // ECMA 7 - contains
                        if (cur.contains(' ' + clazz + ' ')) {
                            cur = cur.replace(' ' + clazz + ' ', ' ');
                        }
                        // Only assign if different to avoid unneeded rendering.
                        finalValue = clazz ? strings.trim(cur) : '';
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }

                    }, fn);
                }
            });
        },

        // Toggle class(es) on element

        toggleClass = function(elem, value, condition) {

            var els = getElem(elem),
                i = 0,
                len = els.length,
                type = typeof value;

            if (typeof condition === 'boolean' && type === 'string') {
                return condition ? addClass(els, value) : removeClass(els, value);
            }

            for (; i < len; i++) {

                elem = els[i];

                if (type === 'string') {
                    // Toggle individual class names
                    var className,
                        self = hAzzle(elem),
                        classNames = str2array(value);
                    i = 0;

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
                    if (elem.className) {
                        // store className if set
                        storage.private.set(elem, '__className__', elem.className);
                    }
                    elem.className = elem.className || value === false ?
                        '' : storage.private.get(this, '__className__') || '';
                }
            }
        };

    this.hasClass = function(classes) {
        return hasClass(this.elements, classes);
    };

    // Add the given CSS class to element

    this.addClass = function(classes, fn) {
        return typeof classes === 'function' ?
            this.each(function(elem, index) {
                hAzzle(elem).addClass(classes.call(elem, index, elem.className));
            }) : addClass(this.elements, classes, fn);
    };

    // Removes CSS class `className` from `element`.

    this.removeClass = function(classes, fn) {
        return typeof classes === 'function' ?
            this.each(function(elem, index) {
                hAzzle(elem).removeClass(classes.call(elem, index, elem.className));
            }) : removeClass(this.elements, classes, fn);
    };

    this.toggleClass = function(value, condition) {
        toggleClass(this.elements, value, condition);
        return this;
    };

    return {
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        toggleClass: toggleClass
    };
});