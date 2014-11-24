// css.js
hAzzle.define('css', function() {

    var // Dependencies

        storage = hAzzle.require('storage'),
        feature = hAzzle.require('has'),

        // Inline values for tagName

        inline = ('b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img map' +
            'object q script span sub button input label select textarea').split(' '),

        runit = /^(-?[\d+\.\-]+)([a-z]+|%)$/i,
        docElement = document.documentElement,
        computedValueBug,

        convert = {},

        computedValues = function(elem) {
            // Avoid getting style values on the window object
            if (elem && elem.nodeType && elem.ownerDocument !== null) {
                var view = false;

                // Avoid hAzzle from throwing errors if the element doesn't exist

                if (!elem && /* internal */ !elem.elements) {
                    return;
                }

                if (elem) {
                    if (elem.ownerDocument !== undefined) {
                        view = elem.ownerDocument.defaultView;
                    }
                    return view && view.opener ? view.getComputedStyle(elem, null) : window.getComputedStyle(elem, null);
                }
                return elem.style;
            }
            return '';
        },

        computed = function(elem) {

            if (elem) {

                if (storage.private.get(elem, 'css') === undefined) {

                    storage.private.access(elem, 'css', {
                        computedStyle: null
                    });
                }

                return storage.private.get(elem, 'css');
            }
        },

        getStyles = function(elem) {
            return elem && (computed(elem).computedStyle === undefined || computed(elem).computedStyle == null) ?
                computed(elem).computedStyle = computedValues(elem) :
                computed(elem).computedStyle;
        },

        toPixel = function(value) {
            // style values can be floats, client code may want
            // to round for integer pixels.
            return parseFloat(value) || 0;
        },

        // Return the computed value of a CSS property
        getDisplay = function(elem) {
            if (elem) {
                var tagName = elem.tagName.toLowerCase();

                if (tagName in inline) {
                    return 'inline';
                }

                if (tagName === 'li') {
                    return 'list-item';
                }

                if (tagName === 'tr') {
                    return 'table-row';
                }

                if (tagName === 'table') {
                    return 'table';
                }
            }
            return 'block';
        },

        css = function(elem, prop, force) {

            if (elem === null || elem === undefined) {
                return;
            } else {
                elem = elem != null && elem instanceof hAzzle ? elem.elements : elem.length ? elem[0] : elem;
            }

            // Avoid hAzzle from throwing errors if the element doesn't exist

            if (elem && /* internal */ elem.elements) {
                return;
            }

            var value = 0,
                unit,
                outerProp = ['paddingTop', 'paddingBottom', 'borderTop', 'borderBottom'],
                innerHeight,
                parent,
                i = 4; // outerProp.length

            if ((prop === 'width' || prop === 'height') && css(elem, 'display') === 0) {
                elem.style.display = 'none';
                elem.style.display = getDisplay(elem);
            }

            if (!force || force === undefined) {
                // NOTE! hAzzle will throw 'too much recusion' if this get screwed up
                if (prop === 'height' &&
                    css(elem, 'boxSizing') !== 'border-box') {
                    return elem.offsetHeight -
                        (toPixel(css(elem, 'borderTopWidth'))) -
                        (toPixel(css(elem, 'borderBottomWidth'))) -
                        (toPixel(css(elem, 'paddingTop'))) -
                        (toPixel(css(elem, 'paddingBottom'))) + 'px';
                } else if (prop === 'width' &&
                    css(elem, 'boxSizing') !== 'border-box') {
                    return elem.offsetWidth -
                        (toPixel(css(elem, 'borderLeftWidth'))) -
                        (toPixel(css(elem, 'borderRightWidth'))) -
                        (toPixel(css(elem, 'paddingLeft'))) -
                        (toPixel(css(elem, 'paddingRight'))) + 'px';
                }
            }

            var computedStyle = getStyles(elem);

            if (prop === 'fontSize') {
                value = toPx(elem, '1em', 'left', 1) + 'px';
            } else if (computedStyle) {

                // IE and Firefox do not return a value for the generic borderColor -- they only return 
                // individual values for each border side's color.

                if ((feature.ie || feature.has('firefox')) && prop === 'borderColor') {
                    prop = 'borderTopColor';
                }

                // Support: IE9

                if (feature.ie === 9 && prop === 'filter') {
                    value = computedStyle.getPropertyValue(prop);
                } else {
                    value = computedStyle[prop];
                }

                // Fall back to the property's style value (if defined) when 'ret' returns nothing

                if (value === '' && !hAzzle.require('Core').contains(elem.ownerDocument, elem)) {
                    value = elem.style[prop];
                }
            }

            // check the unit
            if (value) {
                unit = (value.match(runit) || [])[2];

                if (unit === '%' && computedValueBug) {
                    // WebKit won't convert percentages for top, bottom, left, right, margin and text-indent
                    if (prop === 'top' || prop === 'bottom') {
                        // Top and bottom require measuring the innerHeight of the parent.
                        innerHeight = (parent = elem.parentNode || elem).offsetHeight;
                        while (i--) {
                            innerHeight -= parseFloat(css(parent, outerProp[i]));
                        }
                        value = parseFloat(value) / 100 * innerHeight + 'px';
                    } else {
                        value = toPx(elem, value);
                    }
                }

                if ((value === 'auto' || (unit && unit !== 'px'))) {
                    // WebKit and Opera will return auto in some cases
                    // Firefox will pass back an unaltered value when it can't be set, like top on a static element
                    value = 0;
                }
            }
            return value !== undefined ? value + '' : value;
        },

        // Convert a value to pixels

        toPx = function(elem, value, prop, force) {

            prop = prop || 'width';

            var style,
                inlineValue,
                ret,
                unit = (value.match(runit) || [])[2],
                conversion = unit === 'px' ? 1 : convert[unit + 'toPx'],
                rem = /r?em/i;
            if (conversion || rem.test(unit) && !force) {
                // calculate known conversions immediately
                // find the correct element for absolute units or rem or fontSize + em or em

                elem = conversion ? elem : unit === 'rem' ?
                    docElement : prop === 'fontSize' ?
                    elem.parentNode || elem : elem;

                // Use the pre-calculated conversion or fontSize of the element for rem and em
                conversion = conversion || parseFloat(css(elem, 'fontSize'), true);

                // multiply the value by the conversion
                ret = parseFloat(value) * conversion;

                // Support: Android 4.0-4.3 
            } else {

                style = elem.style;

                inlineValue = style[prop];

                // set the style on the target element

                style[prop] = value;

                // read the computed value
                // if style is nothing we probably set an unsupported unit
                ret = !style[prop] ? 0 : parseFloat(css(elem, prop, true));

                // reset the style back to what it was or blank it out
                style[prop] = inlineValue !== undefined ? inlineValue : null;
            }

            // return a number
            return ret;
        };

    (function() {

        var conversions = [1 / 25.4, 1 / 2.54, 1 / 72, 1 / 6],
            units = ['mm', 'cm', 'pt', 'pc', 'in', 'mozmm'],
            i = units.length, // units.length
            div = document.createElement('div');

        docElement.appendChild(div);
        div.style.marginTop = '1%';
        computedValueBug = computedValues(div).marginTop === '1%';

        // Pre-calculate absolute unit conversions

        while (i--) {
            convert[units[i] + 'toPx'] = conversions[i] ? conversions[i] * convert.inToPx : toPx(div, '1' + units[i]);
        }

        docElement.removeChild(div);
        // Avoid memory leaks in IE
        div = null;
    }());

    return {
        computed: computed,
        display: getDisplay,
        styles: getStyles,
        toPx: toPx,
        css: css
    };
});