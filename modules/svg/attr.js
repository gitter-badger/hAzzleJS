// svg.js
hAzzle.define('svg', function() {

    // SVG ( Scalable Vector Graphics ) support

    var // Dependencies
        util = hAzzle.require('util'),
        types = hAzzle.require('types'),


        // Whitespace regEx

        whiteSpace = /\s+/;

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
                            (type ? this.style[n] = options[n] :
                                this.setAttribute(n, options[n]));
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
    return {};
});