// has.js
hAzzle.define('has', function() {

    var
        ua = navigator.userAgent,
        win = window,
        doc = win.document,
        element = doc.createElement('div'),
        oString = Object.prototype.toString,
        cache = {},

        // IE feature detection
        // Difference between this 'detection method' and has('ie') is that the last
        // method only return a boolean, and this method return version numbers

        ie = (function() {
            if (doc.documentMode) {
                return doc.documentMode;
            }
            return false;
        })(),

        // Return the current value of the named feature
        has = function(name) {
            if (!cache[name]) {
                return;
            }
            return typeof cache[name] === 'function' ?
                (cache[name] = cache[name](win, doc, element)) :
                cache[name];
        },
        // Register a new feature test for some named feature
        add = function(name, test, now, force) {

            if (typeof name == 'object') {
                var key;
                for (key in name) {
                    add(key, name[key]);
                }
            } else {
                (typeof cache[name] === 'undefined' || force) && (cache[name] = test);
                return now && has(name);
            }
        },
        // Delete the content of the element passed to test functions.
        clear = function(elem) {
            elem.innerHTML = '';
            return elem;
        };

    add({

        //# BROWSER DETECTION

        // Mobiles / tablets

        'mobile': /^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),

        // Android

        'android': /^Android/i.test(ua),

        // iPad (most popular??)

        'ipad': /^iPad/i.test(ua),

        // BlackBerry

        'blackberry': /^BlackBerry/i.test(ua),

        // Opera

        'opera': oString.call(window.opera) === '[object Opera]',

        // Firefox
        'firefox': typeof InstallTrigger !== 'undefined',

        // Chrome
        'chrome': !!win.chrome,

        // Webkit
        'webkit': 'WebkitAppearance' in doc.documentElement.style,

        // Safari
        'safari': oString.call(window.HTMLElement).indexOf('Constructor') > 0,

        // Internet Explorer
        'ie': function() {
            return false || !!doc.documentMode;
        },

        // Macintosh
        'mac': navigator.appVersion.indexOf('Macintosh') >= 0,

        //# FEATURE DETECTION

        // ClassList
        'classlist': !!document.documentElement.classList,

        // Quirks mode

        'quirks': document.compatMode === 'BackCompat',

        // XPath

        'xpath': !!doc.evaluate,

        // Air 

        'air': !!win.runtime,

        // Detects native support for the Dart programming language

        'dart': !!(win.startDart || doc.startDart),

        // Detects native support for promises

        'promise': !!win.Promise,

        // Audio detection

        'audio': !!('webkitAudioContext' in window || 'AudioContext' in window),

        // QuerySelectorAll

        'qsa': !!document.querySelectorAll
    });

    return {
        has: has,
        add: add,
        cache: cache,
        clear: clear,
        ie: ie
    };
});