// csshooks.js
hAzzle.define('cssHooks', function() {

    var util = hAzzle.require('util'),
        features = hAzzle.require('has'),
        style = hAzzle.require('style'),
        css = hAzzle.require('css'),

        cssHooks = style.cssHooks,

        // Check if borderRadius are supported
        // Opera Mini v. 5.0 - 8.0, and older Opera versions 
        // does not support borderRadius

        borderRadius = (function() {
            var div = document.createElement('div'),
                res = div.style.borderRadius != null;
            div = null;
            return res;
        }()),

        // Parse the background position

        parseBgPos = function(bgPos) {
            var parts = bgPos.split(/\s/),
                values = {
                    'X': parts[0],
                    'Y': parts[1]
                };
            return values;
        },

        // Padding and margin

        padMarg = {
            padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
            margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
            borderWidth: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
            borderColor: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
        },
        xy = ['X', 'Y'];

    // Apply borderRadius if the browser supports it

    if (borderRadius) {
        padMarg.borderRadius = ['borderTopLeftRadius',
            'borderTopRightRadius',
            'borderBottomRightRadius',
            'borderBottomLeftRadius'
        ];
    }

    util.each(padMarg, function(vals, name) {
        cssHooks.get[name] = function(elem) {
            return util.map(vals, function(corner) {
                return css.css(elem, corner);
            }).join(' ');
        };
    });

    // Background position

    cssHooks.get.backgroundPosition = function(elem) {
        return util.map(xy, function(prop) {
            return css.css(elem, 'backgroundPosition' + prop);
        }).join(' ');
    };
    cssHooks.set.backgroundPosition = function(elem, value) {
        util.each(xy, function(prop) {
            var values = parseBgPos(value);
            elem.style['backgroundPosition' + prop] = values[prop];
        });
    };

    util.each(xy, function(prop) {
        cssHooks.get['backgroundPosition' + prop] = function(elem) {
            var values = parseBgPos(css.css(elem, 'backgroundPosition'));
            return values[prop];
        };
        cssHooks.set['backgroundPosition' + prop] = function(elem, value) {
            var values = parseBgPos(css.css(elem, 'backgroundPosition')),
                isX = prop === 'X';
            elem.style.backgroundPosition = (isX ? value : values.X) + ' ' +
                (isX ? values.Y : value);
        };
    });

    // Fixes Chrome bug / issue

    if (features.has('chrome')) {
        cssHooks.get.textDecoration = function(elem, computed) {
            if (computed) {
                //Chrome 31-36 return text-decoration-line and text-decoration-color
                //which are not expected yet.
                //see https://code.google.com/p/chromium/issues/detail?id=342126
                var ret = css.css(elem, 'text-decoration');
                //We can't assume the first word are 'text-decoration-style'
                if (/\b(inherit|(?:und|ov)erline|blink|line\-through|none)\b/.test(ret)) {
                    return RegExp.$1;
                }
            }
        };
    }

    util.mixin(cssHooks.get, {
        'opacity': function(elem, computed) {
            if (computed) {
                // We should always get a number back from opacity
                var ret = css.css(elem, 'opacity');
                return ret === '' ? '1' : ret;
            }
        },
        'zIndex': function(elem) {
            var val = css.css(elem, 'zIndex');
            return val === 'auto' ? 0 : val;
        }
    });

    return {};
});