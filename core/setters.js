// setters.js
hAzzle.define('setters', function() {

    var util = hAzzle.require('util'),
        core = hAzzle.require('core'),
        types = hAzzle.require('types'),
        whiteSpace = /\S+/g,
        wreturn = /\r/g,

        boolElemArray = ('input select option textarea button form details').split(' '),
        boolAttrArray = ('multiple selected checked disabled readonly required ' +
            'async autofocus compact nowrap declare noshade hreflang onload src' +
            'noresize defaultChecked autoplay controls defer autocomplete ' +
            'hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open').split(' '),
        boolAttr = {}, // Boolean attributes
        boolElem = {}, // Boolean elements

        propMap = {
            // properties renamed to avoid clashes with reserved words  
            'class': 'className',
            'for': 'htmlFor'
        },
        
        propHooks = {
            get: {},
            set: {}
        },
        attrHooks = {
            get: {},
            set: {}
        },
        valHooks = {
            get: {},
            set: {}
        },
        nodeHooks = {
            get: {},
            set: {}
        },
        getElem = function(elem) {
            return elem instanceof hAzzle ? elem.elements : elem;
        },
        validTypes = {
            '1': 1,
            '4': 1,
            '5': 1,
            '6': 1,
            '7': 1,
            '9': 1,
            '10': 1,
            '11': 1,
            '12': 1
        },

        // Get names on the boolean attributes

        getBooleanAttrName = function(elem, name) {
            // check dom last since we will most likely fail on name
            var booleanAttr = boolAttr[name.toLowerCase()];
            // booleanAttr is here twice to minimize DOM access
            return booleanAttr && boolElem[elem.nodeName] && booleanAttr;
        },

        // Removes an attribute from an HTML element.

        removeAttr = function(elem, value) {
            elem = getElem(elem);
            var name, propName,
                i = 0,
                attrNames = value && value.match(whiteSpace);

            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = propMap[name] || name;

                    if (getBooleanAttrName(elem, name)) {
                        elem[propName] = false;
                    } else {
                        elem.removeAttribute(name);
                    }

                    elem.removeAttribute(name);
                }
            }
        },

        // get/set attribute

        attr = function(elem, name, value) {

            elem = getElem(elem);

            var nodeType = elem ? elem.nodeType : undefined,
                hooks, ret;

            if (elem && validTypes[elem.nodeType]) {

                // Fallback to prop when attributes are not supported
                if (typeof elem.getAttribute === 'undefined') {
                    return prop(elem, name, value);
                }

                if (nodeType !== 1 || !core.isXML(elem)) {

                    name = name.toLowerCase();
                    hooks = (attrHooks[value === 'undefined' ? 'get' : 'set'][name] || null) ||
                        getBooleanAttrName(elem, name) ?
                        nodeHooks[value === 'undefined' ? 'get' : 'set'][name] : false;
                }

                // Get attribute

                if (value === undefined) {

                    if (hooks && (ret = hooks.get(elem, name))) {
                        if (ret !== null) {
                            return ret;
                        }
                    }

                    // To avoid bugs in IE regarding href, we are adding the extra argument '2'

                    ret = elem.getAttribute(name, 2);
                    // normalize non-existing attributes to undefined (as jQuery)
                    return ret == null ? undefined : ret;
                }

                // Set / remove a attribute

                if (!value) {
                    removeAttr(elem, name);
                } else if (hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + '');
                }
            }
            return '';
        },

        prop = function(elem, name, value) {

            elem = getElem(elem);

            var nodeType = elem ? elem.nodeType : undefined,
                hook, ret;

            if (elem && validTypes[elem.nodeType]) {

                if (nodeType !== 1 || core.isHTML) {

                    // Fix name and attach hooks
                    name = propMap[name] || name;
                    hook = value === 'undefined' ? propHooks.get[name] : propHooks.set[name];
                }

                if (typeof value !== 'undefined') {

                    return hook && (ret = hook.set(elem, value, name)) !== undefined ?
                        ret : (elem[name] = value);

                } else {

                    return hook && (ret = hook(elem, name)) !== null ?
                        ret :
                        elem[name];
                }
            }
            return '';
        };

    this.val = function(value) {

        var hooks, ret, isFunction,
            elem = this.elements[0];

        if (!arguments.length) {
            if (elem) {
                hooks = valHooks.get[elem.type] ||
                    valHooks.get[elem.nodeName.toLowerCase()];

                if (hooks) {
                    return hooks(elem, 'value');
                }

                ret = elem.value;

                return typeof ret === 'string' ?
                    // Handle most common string cases
                    ret.replace(wreturn, '') :
                    // Handle cases where value is null/undef or number
                    ret == null ? '' : ret;
            }

            return;
        }

        isFunction = types.isType('Function')(value);

        return this.each(function(elem, index) {
            var val;

            if (elem.nodeType !== 1) {
                return;
            }

            if (isFunction) {
                val = value.call(elem, index, hAzzle(elem).val());
            } else {
                val = value;
            }

            // Treat null/undefined as ''; convert numbers to string
            if (val == null) {
                val = '';
            } else if (typeof val === 'number') {
                val += '';
            } else if (types.isArray(val)) {
                val = util.map(val, function(value) {
                    return value == null ? '' : value + '';
                });
            }

            hooks = valHooks.set[elem.type] || valHooks.set[elem.nodeName.toLowerCase()];

            // If set returns undefined, fall back to normal setting
            if (!hooks || hooks(elem, val, 'value') === undefined) {
                elem.value = val;
            }
        });
    };

    this.prop = function(name, value) {
        var elem = this.elements;
        if (typeof name === 'object') {
            return this.each(function(elem) {
                util.each(name, function(value, key) {
                    prop(elem, key, value);
                });
            });
        }

        if (typeof value === 'undefined') {
            return prop(elem[0], name);
        }

        this.each(elem, function(elem) {
            prop(elem, name, value);

        });
    };

    // Toggle properties on DOM elements

    this.toggleProp = function(prop) {
        return this.each(function(elem) {
            return elem.prop(prop, !elem.prop(prop));
        });
    };

    this.removeProp = function(name) {
        return this.each(function() {
            delete this[propMap[name] || name];
        });
    };

    this.removeAttr = function(value) {
        return this.each(function(elem) {
            removeAttr(elem, value);
        });
    };

    this.attr = function(name, value) {

        var elem = this.elements;

        if (typeof name === 'object') {
            return this.each(function(elem) {
                util.each(name, function(value, key) {
                    attr(elem, key, value);
                });
            });
        }
        return typeof value === 'undefined' ?
            attr(elem[0], name) :
            this.each(function(elem) {
                attr(elem, name, value);
            });
    };

    util.each(boolAttrArray, function(prop) {
        boolAttr[boolAttrArray[prop]] = boolAttrArray[prop];
    });

    util.each(boolElemArray, function(prop) {
        boolElem[prop.toUpperCase()] = true;
    });

    // Populate propMap - all properties are written as camelCase
    util.each(['cellPadding', 'cellSpacing', 'maxLength', 'rowSpan',
        'colSpan', 'useMap', 'frameBorder', 'contentEditable', 'textContent', 'valueType',
        'tabIndex', 'readOnly', 'type', 'accessKey', 'tabIndex', 'dropZone', 'spellCheck',
        'hrefLang', 'isMap', 'srcDoc', 'mediaGroup', 'autoComplete', 'noValidate',
        'radioGroup'
    ], function(prop) {

        propMap[prop.toLowerCase()] = prop;
    });

    return {
        attrHooks: attrHooks,
        propHooks: propHooks,
        valHooks: valHooks,
        nodeHooks: nodeHooks,
        propMap: propMap,
        boolAttr: boolAttr,
        boolElem: boolElem,
        removeAttr: removeAttr,
        attr: attr,
        prop: prop
    };
});