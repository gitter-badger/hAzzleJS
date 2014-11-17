// style.js
// Dependencies: dimensions.js ( required for Safari & Webkit)
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('style', function() {

    var util = hAzzle.require('util'),
        types = hAzzle.require('types'),
        strings = hAzzle.require('strings'),
        css = hAzzle.require('css'),

        _unitlessProps = ('zoom box-flex columns counter-reset volume stress overflow flex-grow ' +
            'column-count flex-shrink flex-height order orphans widows rotate3d flipped ' +
            'transform ms-flex-order transform-origin perspective transform-style ' +
            'ms-flex-negative ms-flex-positive transform-origin perspective ' +
            'perspective-origin backface-visibility scale scale-x scale-y scale-z ' +
            'scale3d reflect-x-y reflect-z reflect-y reflect ' +
            'background-color border-bottom-color border-left-color border-right-color border-top-color ' +
            'color column-rule-color outline-color text-decoration-color text-emphasis-color ' +
            'alpha z-index font-weight opacity red green blue').split(' '),

        cssShow = {
            visibility: 'hidden',
            display: 'block'
        },

        sNumbs = /^([+-])=([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(.*)/i,

        // _vPrix regEx

        prReg = /^\w/,

        // Used by vendorPrefixes as callback to replace()

        _vPrix = function(match) {
            return match.toUpperCase();
        },

        prefixes = ['', 'Webkit', 'Moz', 'ms'],

        prefixElement = document.createElement('div'),

        prefixCache = {},

        cssProps = {
            'float': 'cssFloat'
        },

        unitless = {},

        cssHooks = {
            get: {},
            set: {}
        },

        vendorPrefixes = function(prop) {
            // Cache on first iteration to avoid multiple lookups
            if (prefixCache[prop]) {
                return [prefixCache[prop], true];
            } else {

                var i = 0,
                    prefixesLength = prefixes.length,
                    propertyPrefixed;
                // Iterate prefixes from most to least likely
                for (; i < prefixesLength; i++) {

                    if (i === 0) {
                        propertyPrefixed = prop;
                    } else {
                        propertyPrefixed = prefixes[i] + prop.replace(prReg, _vPrix);
                    }

                    if (typeof prefixElement.style[propertyPrefixed] === 'string') {
                        prefixCache[prop] = propertyPrefixed;
                        return [propertyPrefixed, true];
                    }
                }
                return [prop, false];
            }
        },

        // getCSS

        getCSS = function(elem, name) {

            if (elem instanceof hAzzle) {
                elem = elem.elements[0];
            }

            var val, hooks, computed, style = elem.style,
                origName = strings.camelize(name),
                p = vendorPrefixes(origName);

            name = cssProps[origName] || (p[1] ? cssProps[origName] = p[0] : name);

            // Try prefixed name followed by the unprefixed name
            hooks = cssHooks.get[name] || cssHooks.get[origName];

            // If a hook was provided get the computed value from there
            val = hooks ? hooks(elem, true) : val;

            if (!computed && val === undefined) {
                style = css.styles(elem);
                val = hooks ? hooks(elem, true) : style[name];
                computed = true;
            }

            return val;
        },

        // setCSS        

        setCSS = function(elem, name, value) {

            if (elem instanceof hAzzle) {
                elem = elem.elements[0];
            }
            if (elem && (elem.nodeType !== 3 || elem.nodeType !== 8)) { // Text or Comment

                var ret, style, hook, type, action, origName = strings.camelize(name);

                name = cssProps[origName] || (cssProps[origName] = vendorPrefixes(name)[0]);

                style = elem.style;

                if (!style) {
                    return;
                }
                if (value !== undefined) {

                    type = typeof value;

                    hook = cssHooks.set[name];

                    // Convert '+=' or '-=' to relative numbers, and
                    // and convert all unit types to PX (e.g. 10em will become 160px)

                    if (type === 'string' && (ret = sNumbs.exec(value))) {
                        value = units(parseFloat(css.css(elem, name)), ret[3], elem, name) + (ret[1] + 1) * ret[2];
                        type = 'number';
                    }
                   

                    // If a number was passed in, add 'px' (except for certain CSS properties)

                    if (type === 'number' && !unitless[name]) {
                        value += ret && ret[3] ? ret[3] : 'px';
                    }

                    // Support: IE9
                    if (value === null || value === '') {
                        action = 'remove';
                    } else {
                        action = 'set';
                    }

                    // Set values through cssHooks if defined

                    if (hook) {
                        hook(elem, name, value);
                    } else {
                        if (value) {
                          style[name] = value;
                        }
                    }

                } else {
                    hook = cssHooks.get[name];

                    if (cssHooks.get[name] && (ret = cssHooks.get[name](elem, false))) {
                        return ret;
                    }

                    return style[name];
                }
            }
        },
        // Converts one unit to another

        units = function(px, unit, elem, prop) {

            if (unit === '' ||
                unit === 'px') {
                return px; // Don't waste time if there is no conversion to do.
            }

            if (unit === '%') {

                if (prop === 'left' ||
                    prop === 'right' ||
                    prop === 'margin' ||
                    prop === 'padding') {

                    prop = 'width';

                } else if (prop === 'top' ||
                    prop === 'bottom') {
                    prop = 'height';
                }

                // Get the correct position

                var pos = css.css(elem, 'position');

                elem = (pos === 'relative' ||
                        pos === 'absolute' ||
                        pos === 'fixed') ?
                    elem.offsetParent : elem.parentNode;

                if (elem) {
                    if (( prop = parseFloat(css.css(elem, prop)) ) !== 0) {
                        return px / prop * 100;
                    }
                }
                return 0;
            }

            if (unit === 'em') {
                console.log(px / parseFloat(css.css(elem, 'fontSize')))
                return px / parseFloat(css.css(elem, 'fontSize'));
            }

            // The first time we calculate how many pixels there is in 1 meter
            // for calculate what is 1 inch/cm/mm/etc.
            if (units.unity === undefined) {

                var u = units.unity = {},
                    div = document.createElement("div");

                div.style.width = '100cm';
                document.body.appendChild(div); // If we don't link the <div> to something, the offsetWidth attribute will be not set correctly.
                u.mm = div.offsetWidth / 1000;
                document.body.removeChild(div);
                u.cm = u.mm * 10;
                u.in = u.cm * 2.54;
                u.pt = u.in * 1 / 72;
                u.pc = u.pt * 12;
            }

            // If the unity specified is not recognized we return the value.

            unit = units.unity[unit];

            return unit ? px / unit : px;
        };

    this.css = function(name, value) {

        var elem = this.elements;

        if (types.isArray(name)) {

            var map = {},
                i = name.length;

            while (i--) {
                map[name[i]] = getCSS(elem[0], name[i], false);
            }

            return map;
        }

        if (value === undefined) {

            if (typeof name === 'string') {
                return elem[0] && getCSS(elem[0], name);
            }

            return this.each(function(elem) {

                util.each(name, function(value, prop) {
                    setCSS(elem, prop, value);
                });
            });
        }

        // Set style
        return this.each(function(elem) {
            setCSS(elem, name, value);
        });
    };
   

    // Populate the unitless properties list

    util.each(_unitlessProps, function(prop) {
        unitless[strings.camelize(prop)] = true;
    });

    return {
        vendor: vendorPrefixes,
        cssHooks: cssHooks,
        cssProps: cssProps,
        swap: swap,
        unitless: unitless,
        getCSS: getCSS,
        setCSS: setCSS
    };
});