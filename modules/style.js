// style.js
// Dependencies: dimensions.js ( required for Safari & Webkit)
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('style', function() {

    var
    // Dependencies

        util = hAzzle.require('util'),
        types = hAzzle.require('types'),
        strings = hAzzle.require('strings'),
        features = hAzzle.require('has'),
        css = hAzzle.require('css'),

        _unitlessProps = ('zoom box-flex columns counter-reset volume stress overflow flex-grow ' +
            'column-count flex-shrink flex-height order orphans widows rotate3d flipped ' +
            'transform ms-flex-order transform-origin perspective transform-style ' +
            'ms-flex-negative ms-flex-positive transform-origin perspective ' +
            'perspective-origin backface-visibility scale scale-x scale-y scale-z ' +
            'scale3d reflect-x-y reflect-z reflect-y reflect ' +
            'background-color border-bottom-color border-left-color border-right-color border-top-color ' +
            'color column-rule-color outline-color text-decoration-color text-emphasis-color ' +
            'alpha z-index font-weight opacity red green blue').split(' ');

    //# Feature detection

    // IE9

    features.add('removeStyles', function() {
        var div = document.createElement('div');
        div.style.color = 'red';
        div.style.color = null;
        return div.style.color == 'red';
    });

    // IE9 returns borders in shorthand styles in the wrong 
    // order (color-width-style instead of width-style-color)

    features.add('WrongOrder', function() {
        var div = document.createElement('div'),
            border = '1px solid #123abc';
        div.style.border = border;
        return el.style.border != border;
    });


    var sNumbs = /^([+-])=([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(.*)/i,

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

        validTypes = {
            '1': 1,
            '2': 1,
            '4': 1,
            '5': 1,
            '6': 1,
            '7': 1,
            '9': 1,
            '10': 1,
            '11': 1,
            '12': 1
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

        // Support: IE9
        removeStyle = function(style, property) {
            if (property == 'backgroundPosition') {
                style.removeAttribute(property + 'X');
                property += 'Y';
            }
            style.removeAttribute(property);
        },

        getElem = function(elem) {

            if (elem === null || elem === undefined) {
                return false;
            } else {
                return elem != null && elem instanceof hAzzle ? elem.elements : elem.length ? elem[0] : elem;
            }

            // Avoid hAzzle from throwing errors if the element doesn't exist

            if (elem && /* internal */ elem.elements) {
                return false;
            }
        },

        getStyle = function(elem, name) {
            if ((elem = getElem(elem))) {
                name = strings.camelize((cssProps[name] ? cssProps[name] : cssProps[name] = vendorPrefixes(name)[0]) || name);
                var hook = cssHooks.get[name];
                return hook ? hook(elem, name) : css.css(elem, name);
            }
        },

        setStyle = function(elem, name, value) {

            if ((elem = getElem(elem))) {

                if (validTypes[elem.nodeType]) {

                    var ret, style, hook, type;

                    name = strings.camelize((cssProps[name] ? cssProps[name] : cssProps[name] = vendorPrefixes(name)[0]) || name);

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

                        if ((value === '' || value === null) && features.has('removeStyles')) {
                            removeStyle(style, name);
                        }

                        if (hook) {
                            hook(elem, name, value);
                        } else {
                            style[name] = value;
                        }
                    } else {
                        hook = cssHooks.get[name];

                        if (cssHooks.get[name] && (ret = cssHooks.get[name](elem, false))) {
                            return ret;
                        }

                        return style[name];
                    }
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
                    if ((prop = parseFloat(css.css(elem, prop))) !== 0) {
                        return px / prop * 100;
                    }
                }
                return 0;
            }

            if (unit === 'em') {
                console.log(px / parseFloat(css.css(elem, 'fontSize')));
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

        var len = arguments.length,
            i, length = this.length,
            node, nameType = typeof name,
            hook;

        for (i = 0; i < length; i++) {

            node = this.elements[i];

            if (len === 1 && (nameType === 'string' || types.isArray(name))) {

                value = util.reduce(nameType === 'string' ? [name] : name, function(memo, name) {

                    hook = cssHooks.get[name];
                    value = hook ? hook(node, name) :
                        css.css(node, strings.camelize(strings.camelize((cssProps[name] ?
                            cssProps[name] : cssProps[name] = vendorPrefixes(name)[0]) || name)));

                    memo[name] = value;

                    return memo;
                }, {});

                return nameType === 'string' ? value[name] : value;
            }

            function appendCssText(key, value) {

                if (typeof value === 'function') {
                    value = value.call(this, this.css(key));
                }

                setStyle(node, key, value);
            }

            if (len === 1 && name && nameType === 'object') {
                util.each(name, function(key, prop) {
                    setStyle(node, prop, key);
                });
            } else if (len === 2 && nameType === 'string') {
                appendCssText(name, value);
            } else {
                hAzzle.err(true, 12, 'too few arguments in the css() method in style.js');
            }
        }
        return this;
    };

    // Populate the unitless properties list

    util.each(_unitlessProps, function(prop) {
        unitless[strings.camelize(prop)] = true;
    });

    return {
        vendor: vendorPrefixes,
        unitless: unitless,
        cssProps: cssProps,
        cssHooks: cssHooks,
        setCSS: setStyle,
        getCSS: getStyle
    };
});