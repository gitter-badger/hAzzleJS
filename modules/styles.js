// styles.js
var sHeightWidth = /^(height|width)$/i,
    sDigit = /^[\d-]/,

    cssNormalTransform = {
        letterSpacing: '0',
        fontWeight: '400'
    },
    getRoot = function(property) {
        var hookData = cssCore.FX.activated[property];

        if (hookData) {
            return hookData[0];
        } else {
            // If there was no hook match, return the property name untouched
            return property;
        }
    },

    cleanRootPropertyValue = function(rootProperty, rootPropertyValue) {

        if (cssCore.RegEx.sUnwrap.test(rootPropertyValue)) {
            rootPropertyValue = rootPropertyValue.match(cssCore.FX.RegEx.sUnwrap)[1];
        }

        if (hAzzle.isZeroValue(rootPropertyValue)) {
            rootPropertyValue = templates[rootProperty][1];
        }

        return rootPropertyValue;
    },

    extractValue = function(name, value) {
        var hookData = cssCore.FX.activated[name];
        if (hookData) {
            var hookRoot = hookData[0],
                hookPosition = hookData[1];
            value = cleanRootPropertyValue(hookRoot, value);
            return value.toString().match(cssCore.RegEx.sValueSplit)[hookPosition];
        } else {
            return value;
        }
    },

    // Inject value

    injectValue = function(name, value, root) {
        var hookData = cssCore.FX.activated[name];
        if (hookData) {
            var hookRoot = hookData[0],
                hookPosition = hookData[1],
                rootParts,
                rootUpdated;
            root = cleanRootPropertyValue(hookRoot, root);
            rootParts = root.match(cssCore.RegEx.sValueSplit);
            rootParts[hookPosition] = value;
            rootUpdated = rootParts.join(' ');

            return rootUpdated;
        } else {
            return root;
        }
    },

    // The two following functions are kept due to jQuery API compability

    getCSS = function(elem, prop, extra, styles) {

        var val, num;

        prop = cssCore.cssCamelized[prop];

        if (cssHook[prop]) {
            val = cssHook[prop].get(elem, prop);
        }

        // Otherwise, if a way to get the computed value exists, use that

        if (val === undefined) {
            val = curCSS(elem, prop, null, styles);
        }

        // Convert 'normal' to computed value
        if (val === 'normal' && prop in cssNormalTransform) {
            val = cssNormalTransform[prop];
        }

        if (extra === '' || extra) {
            num = parseFloat(val);
            return extra === true || hAzzle.isNumeric(num) ? num || 0 : val;
        }

        return val;
    },

    setCSS = function(elem, prop, value, extra) {

        var type, ret, oldValue,
            nType = elem.nodeType,
            style = elem.style;

        // Don't set styles on text and comment nodes
        if (nType === 3 ||
            nType === 8 || !elem) {
            return;
        }

        // Check if we're setting a value

        if (value !== undefined) {

            // Check for 'cssHook'

            if (cssHook[prop]) {
                value = cssHook[prop].set(elem, value, extra);
                prop = cssHook[prop].name;

            } else {
                prop = cssCore.cssCamelized[prop];
            }

            // Assign the appropriate vendor prefix before perform an official style update.

            prop = hAzzle.prefixCheck(prop)[0];

            type = typeof value;

            // Convert relative number strings

            if (type === 'string' && (ret = cssCore.RegEx.sNumbs.exec(value))) {
                value = hAzzle.css(elem, prop, '');
                value = hAzzle.units(value, ret[3], elem, name) + (ret[1] + 1) * ret[2];
                type = 'number';
            }

            // Make sure that null and NaN values aren't set.

            if (value === null || value !== value) {

                return;
            }

            // If a number was passed in, add 'px' to the number (except for certain CSS properties)

            if (type === 'number' && !hAzzle.unitless[prop]) {

                value += ret && ret[3] ? ret[3] : 'px';
            }

            if (cssCore.has['bug-clearCloneStyle'] &&
                value === '' && prop.indexOf('background') === 0) {
                style[cssCore.cssCamelized[prop]] = 'inherit';
            }

            oldValue = elem.style[name];
            style[name] = value;

            // Revert to the old value if the browser didn't accept the new rule to
            // not break the cascade.

            if (value && !elem.style[name]) {
                style[name] = oldValue;
            }

            style[prop] = value;

        } else {

            // If a hook was provided get the non-computed value from there

            if (cssHook[prop]) {
                return cssHook[prop].get(elem, prop);
            }

            // Otherwise just get the value from the style object
            return style[prop];
        }
    },

    // Style getter / setter for animation engine

    getFXCss = function(elem, prop, root, force) {
        var propertyValue;

        // Check for FX hook

        if (cssCore.FX.activated[prop]) {

            var hook = prop,
                hookRoot = getRoot(hook);

            if (root === undefined) {
                root = getFXCss(elem, hAzzle.prefixCheck(hookRoot)[0]);
            }

            if (cssCore.FX.cssHooks[hookRoot]) {
                root = cssCore.FX.cssHooks[hookRoot].get(elem, root);
            }

            propertyValue = extractValue(hook, root);

        } else if (cssCore.FX.cssHooks[prop]) {
            var normalizedPropertyName = cssCore.FX.cssHooks[prop].name,
                normalizedPropertyValue;

            if (normalizedPropertyName !== 'transform') {
                normalizedPropertyValue = curCSS(elem, hAzzle.prefixCheck(normalizedPropertyName)[0], force);

                if (hAzzle.isZeroValue(normalizedPropertyValue) && templates[prop]) {
                    normalizedPropertyValue = templates[prop][1];
                }
            }

            propertyValue = cssCore.FX.cssHooks[prop].get(elem, normalizedPropertyValue);
        }
        if (!sDigit.test(propertyValue)) {
            if (hAzzle.private(elem, 'CSS') && hAzzle.private(elem, 'CSS').isSVG && cssCore.Names.SVGAttribute(prop)) {

                if (sHeightWidth.test(prop)) {
                    propertyValue = elem.getBBox()[prop];
                } else {
                    propertyValue = elem.getAttribute(prop);
                }
            } else {
                propertyValue = curCSS(elem, hAzzle.prefixCheck(prop)[0]);
            }
        }

        if (hAzzle.isZeroValue(propertyValue)) {
            propertyValue = 0;
        }
        return propertyValue;
    },

    setFXCss = function(elem, prop, value, root, scrollData) {
        var propertyName = prop;

        if (prop === 'scroll') {
            if (scrollData.container) {
                scrollData.container['scroll' + scrollData.direction] = value;
            } else {
                if (scrollData.direction === 'Left') {
                    window.scrollTo(value, scrollData.alternateValue);
                } else {
                    window.scrollTo(scrollData.alternateValue, value);
                }
            }
        } else {

            if (cssCore.FX.cssHooks[prop] && cssCore.FX.cssHooks[prop].name === 'transform') {
                cssCore.FX.cssHooks[prop].set(elem, value);
                propertyName = 'transform';
                value = hAzzle.private(elem, 'CSS').transformCache[prop];
            } else {
                if (cssCore.FX.activated[prop]) {
                    var hookName = prop,
                        hookRoot = getRoot(prop);

                    root = root || getFXCss(elem, hookRoot);

                    value = injectValue(hookName, value, root);
                    prop = hookRoot;
                }

                if (cssCore.FX.cssHooks[prop]) {
                    value = cssCore.FX.cssHooks[prop].set(elem, value);
                    prop = cssCore.FX.cssHooks[prop].name;
                }

                propertyName = hAzzle.prefixCheck(prop)[0];

                if (hAzzle.private(elem, 'CSS') && hAzzle.private(elem, 'CSS').isSVG && cssCore.Names.SVGAttribute(prop)) {
                    hAzzle.setAttribute(elem, prop, value);
                } else {
                    elem.style[propertyName] = value;
                }
            }
        }
        return [propertyName, value];
    };

hAzzle.extend({

    css: function(name, value) {

        return hAzzle.setter(this, function(elem, name, value) {
            var map = {},
                i = 0;

            if (hAzzle.isArray(name)) {

                i = name.length;

                while (i--) {

                    map[name[i]] = getCSS(elem, name[i], false);
                }

                return map;
            }

            return value !== undefined ?
                setCSS(elem, name, value) :
                getCSS(elem, name);
        }, name, value, arguments.length > 1);
    },

    zIndex: function(zIndex) {
        if (zIndex !== undefined) {
            return this.css('zIndex', zIndex);
        }

        if (this.length) {
            var elem = hAzzle(this[0]),
                position, value;
            while (elem.length && elem[0] !== document) {
                position = elem.css('position');
                if (position === 'absolute' || position === 'relative' || position === 'fixed') {
                    value = parseInt(elem.css('zIndex'), 10);
                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        }

        return 0;
    }
});

// Expose

hAzzle.css = getCSS;
hAzzle.style = setCSS;