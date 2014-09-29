// url: ehttp://caniuse.com/getcomputedstyle
var cHeightWidth = /^(height|width)$/i,
    cWidthHeight = /^(width|height)$/,
    cToprbLeft = /^(top|right|bottom|left)$/i,
    cTopLeft = /top|left/i,
    _private = function(elem) {
        return hAzzle.private(elem, 'CSS');
    },
    computedValues = hAzzle.isWebkit ? function(elem) {
        var s;
        if (elem.nodeType === 1) {
            var dv = elem.ownerDocument.defaultView;
            s = dv.getComputedStyle(elem, null);
            if (!s && node.style) {
                elem.style.display = '';
                s = dv.getComputedStyle(elem, null);
            }
        }
        return s || {};
    } :

    function(elem) {
        var view = false;
        if (elem && elem !== window) {

            if (elem.ownerDocument !== undefined) {
                view = elem.ownerDocument.defaultView;
            }
            return view && hAzzle.cssHas.ComputedStyle ?
                (view.opener ? view.getComputedStyle(elem, null) :
                    window.getComputedStyle(elem, null)) : elem.style;
        }
        return null;
    },

    curHeight = function(elem, toggleDisplay) {
        var contentBoxHeight = elem.offsetHeight -
            (parseFloat(getCSS(elem, 'borderTopWidth')) || 0) -
            (parseFloat(getCSS(elem, 'borderBottomWidth')) || 0) -
            (parseFloat(getCSS(elem, 'paddingTop')) || 0) -
            (parseFloat(getCSS(elem, 'paddingBottom')) || 0);

        revertDisplay(elem, toggleDisplay);

        return contentBoxHeight;
    },
    curWidth = function(elem, toggleDisplay) {
        var contentBoxWidth = elem.offsetWidth -
            (parseFloat(getCSS(elem, 'borderLeftWidth')) || 0) -
            (parseFloat(getCSS(elem, 'borderRightWidth')) || 0) -
            (parseFloat(getCSS(elem, 'paddingLeft')) || 0) -
            (parseFloat(getCSS(elem, 'paddingRight')) || 0);

        revertDisplay(elem, toggleDisplay);

        return contentBoxWidth;
    },

    getStyles = function(elem, styles) {
        var computed;

        if (styles) {
            return styles;
        }
        // We save the computedStyle on the object to minimize DOM querying

        if (_private(elem) === undefined) {
            return computedValues(elem);

            // If the computedStyle object has yet to be cached, do so now.
        } else if (!_private(elem).computedStyle) {
            computed = _private(elem).computedStyle = computedValues(elem);

            // If computedStyle is cached, use it.

        } else {
            computed = _private(elem).computedStyle;
        }

        return computed;
    },

    revertDisplay = function(elem, toggleDisplay) {
        if (toggleDisplay) {
            setCSS(elem, 'display', 'none');
        }
    },

    curCSS = function(elem, prop, force, styles) {

        var computedValue = 0,
            toggleDisplay = false;

        if (cWidthHeight.test(prop) && getCSS(elem, 'display') === 0) {
            toggleDisplay = true;
            setCSS(elem, 'display', hAzzle.getDisplayType(elem));
        }

        if (!force) {

            if (prop === 'height' &&
                getCSS(elem, 'boxSizing').toString().toLowerCase() !== 'border-box') {
                return curHeight(elem, toggleDisplay);
            } else if (prop === 'width' &&
                curCSS(elem, 'boxSizing').toString().toLowerCase() !== 'border-box') {
                return curWidth(elem, toggleDisplay);
            }
        }

        var computedStyle = getStyles(elem, styles);

        // IE and Firefox do not return a value for the generic borderColor -- they only return individual values 
        // for each border side's color. As a polyfill for querying individual border side colors, just return the 
        // top border's color.

        if ((hAzzle.ie || hAzzle.isFirefox) && prop === 'borderColor') {
            prop = 'borderTopColor';
        }

        if (hAzzle.ie === 9 && prop === 'filter') {
            computedValue = computedStyle.getPropertyValue(prop);
        } else {
            computedValue = computedStyle[prop];
        }

        if (computedValue === '' || computedValue === null) {
            computedValue = elem.style[prop];
        }

        revertDisplay(elem, toggleDisplay);

        if (computedValue === 'auto' && cToprbLeft.test(prop)) {

            var position = curCSS(elem, 'position');

            if (position === 'fixed' || (position === 'absolute' && cTopLeft.test(prop))) {
                computedValue = hAzzle(elem).position()[prop] + 'px';
            }
        }
        return computedValue;
    };

// Expose

hAzzle.computedValues = computedValues;
hAzzle.getStyles = getStyles;
hAzzle.curCSS = curCSS;