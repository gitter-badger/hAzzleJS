// css.js
hAzzle.define('css', function() {

    var // Dependencies

        storage = hAzzle.require('storage'),
        feature = hAzzle.require('has'),

        // Inline values for tagName

        inline = ('b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img map' +
            'object q script span sub button input label select textarea').split(' '),

        // Various Regexes

        widthheight = /^(width|height)$/,
        listitem = /^(li)$/i,
        tablerow = /^(tr)$/i,
        table = /^(table)$/i,
        margin = (/^margin/),
        hex = /^#/,
        btbleft = /^border(Top|Right|Bottom|Left)?$/,
        btbleftkf = /^(.+)\s(.+)\s(.+)$/,
        units = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i,

        computedValues = function(elem) {
            if (elem && elem.ownerDocument !== null) {
                var view = false;
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
            return computed(elem).computedStyle === null ?
                computed(elem).computedStyle = computedValues(elem) :
                computed(elem).computedStyle;
        },

        toPixel = function(value) {
            // style values can be floats, client code may want
            // to round for integer pixels.
            return parseFloat(value) || 0;
        },
        getDisplay = function(elem) {
            if (elem) {
                var tagName = elem.tagName.toLowerCase();

                if (tagName in inline) {
                    return 'inline';
                }

                if (listitem.test(tagName)) {
                    return 'list-item';
                }

                if (tablerow.test(tagName)) {
                    return 'table-row';
                }

                if (table.test(tagName)) {
                    return 'table';
                }
            }
            return 'block';

        },

        css = function(elem, prop, force) {

            elem = elem instanceof hAzzle ? elem.elements[0] : elem;

            var ret = 0;

            if (widthheight.test(prop) && css(elem, 'display') === 0) {
                elem.style.display = 'none';
                elem.style.display = getDisplay(elem);
            }

            if (feature.has('ie') && prop === 'auto') {
                if (prop === 'height') {
                    return elem.offsetHeight;
                }
                if (prop === 'width') {
                    return elem.offsetWidth;
                }
            }

            if (!force) {

                if (prop === 'height' &&
                    css(elem, 'boxSizing').toString().toLowerCase() !== 'border-box') {
                    return elem.offsetHeight -
                        (toPixel(css(elem, 'borderTopWidth'))) -
                        (toPixel(css(elem, 'borderBottomWidth'))) -
                        (toPixel(css(elem, 'paddingTop'))) -
                        (toPixel(css(elem, 'paddingBottom')));
                } else if (prop === 'width' &&
                    css(elem, 'boxSizing').toString().toLowerCase() !== 'border-box') {
                    return elem.offsetWidth -
                        (toPixel(css(elem, 'borderLeftWidth'))) -
                        (toPixel(css(elem, 'borderRightWidth'))) -
                        (toPixel(css(elem, 'paddingLeft'))) -
                        (toPixel(css(elem, 'paddingRight')));
                }

            }

            var computedStyle = getStyles(elem);

            if (computedStyle) {

                // IE and Firefox do not return a value for the generic borderColor -- they only return 
                // individual values for each border side's color.

                if ((feature.ie || feature.has('firefox')) && prop === 'borderColor') {
                    prop = 'borderTopColor';
                }

                // Support: IE9
                // getPropertyValue is only needed for .css('filter')

                if (feature.ie === 9) {

                    if (prop === 'filter') {
                        ret = computedStyle.getPropertyValue(prop);
                    } else {
                        ret = computedStyle[prop];
                    }

                    if (feature.has('BordersInWrongOrder') && btbleft.test(prop) && hex.test(ret)) {
                        ret.replace(btbleftkf, '$2 $3 $1');
                    }
                } else {
                    ret = computedStyle[prop];
                }

                // Fall back to the property's style value (if defined) when 'ret' returns nothing

                if (ret === '' && !hAzzle.require('Core').contains(elem.ownerDocument, elem)) {
                    ret = elem.style[prop];
                }

                // Support: Android 4.0-4.3

                if (feature.has('mobile') && feature.has('android')) {

                    if (units.test(ret) && margin.test(name)) {

                        var width, minWidth, maxWidth,
                            style = elem.style;
                        // Remember the original values
                        width = style.width;
                        minWidth = style.minWidth;
                        maxWidth = style.maxWidth;

                        // Put in the new values to get a computed value out
                        style.minWidth = style.maxWidth = style.width = ret;
                        ret = computed.width;

                        // Revert the changed values
                        style.width = width;
                        style.minWidth = minWidth;
                        style.maxWidth = maxWidth;
                    }
                }
            }
            return ret !== undefined ? ret + '' : ret;
        };

    return {
        computed: computed,
        display: getDisplay,
        styles: getStyles,
        css: css
    };
});