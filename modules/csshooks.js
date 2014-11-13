// csshooks.js
hAzzle.define('cssHooks', function() {

    var util = hAzzle.require('util'),
        features = hAzzle.require('has'),
        cssStyle = hAzzle.require('style'),
        getCSS = hAzzle.require('css'),

        // Check if borderRadius are supported
        // Opera Mini v. 5.0 - 8.0, and older Opera versions 
        // does not support borderRadius

        borderRadius = (function() {
            var div = document.createElement('div'),
                res = div.style.borderRadius != null;
            div = null;
            return res;
        }()),

        padMarg = {
            padding: 'paddingTop paddingRight paddingBottom paddingLeft',
            margin: 'marginTop marginRight marginBottom marginLeft',
            borderWidth: 'borderTopWidth borderRightWidth borderBottomWidth borderLeftWidth',
            borderColor: 'borderTopColor borderRightColor borderBottomColor borderLeftColor',
        };

    if (borderRadius) {
        padMarg.borderRadius = 'borderTopLeftRadius borderTopRightRadius borderBottomRightRadius borderBottomLeftRadius';
    }

    // Fixes Chrome bug / issue

    if (features.has('chrome')) {
        cssStyle.cssHooks.textDecoration = {
            get: function(elem, computed) {
                if (computed) {

                    //Chrome 31-36 return text-decoration-line and text-decoration-color
                    //which are not expected yet.
                    //see https://code.google.com/p/chromium/issues/detail?id=342126
                    var ret = getCSS.css(elem, 'text-decoration');
                    //We cannot assume the first word as 'text-decoration-style'
                    if (/\b(inherit|(?:und|ov)erline|blink|line\-through|none)\b/.test(ret)) {
                        return RegExp.$1;
                    }
                }
            }
        };
    }

    util.each(padMarg, function(vals, name) {
        vals = vals.split(' ');
        cssStyle.cssHooks.get[name] = function(elem) {
            return getCSS.css(elem, vals[0]) + ' ' +
                getCSS.css(elem, vals[1]) + ' ' +
                getCSS.css(elem, vals[2]) + ' ' +
                getCSS.css(elem, vals[3]);
        };
    });

    util.mixin(cssStyle.cssHooks.get, {
        'opacity': function(elem, computed) {
            if (computed) {
                // We should always get a number back from opacity
                var ret = getCSS.css(elem, 'opacity');
                return ret === '' ? '1' : ret;
            }
        },
        'zIndex': function(elem) {
            var val = getCSS.css(elem, 'zIndex');
            return val === 'auto' ? 0 : val;
        }
    });

    return {};
});