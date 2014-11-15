/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.2a
 * Released under the MIT License.
 *
 * Date: 2014-11-15
 */
(function() {

    var

    // Container for all modules

        modules = {},

        // Container for installed modules

        installed = {},

        // Version

        version = '1.0.1b',

        // Codename

        codename = 'new-age',

        // Throws an error if `condition` is `true`.

        err = function(condition, code, message) {
            if (condition) {
                throw new Error('[hAzzle-' + code + '] ' + message);
            }
        },

        // Lower case 

        tlc = function(str) {
            return str.toLowerCase();
        },

        // Require a module

        require = function(name) {
            if (name && typeof name === 'string') {
                return modules[tlc(name)];
            }
        },

        // Defines a module

        define = function(name, fn) {
            if (typeof name === 'string' && typeof fn === 'function' && !modules[name]) {
                installed[tlc(name)] = true;
                modules[tlc(name)] = fn.call(hAzzle.prototype);
            }
        },

        validTypes = function(elem) {
            return elem && (elem.ELEMENT_NODE || elem.DOCUMENT_NODE);
        },

        // Define a local copy of hAzzle

        hAzzle = function(sel, ctx) {

            // hAzzle(), hAzzle(null), hAzzle(undefined), hAzzle(false)
            if (!sel) {
                return;
            }
            // Allow instantiation without the 'new' keyword
            if (!(this instanceof hAzzle)) {
                return new hAzzle(sel, ctx);
            }

            if (sel instanceof hAzzle) {
                return sel;
            }

            var els, util = require('Util');

            // DOM ready

            if (typeof sel === 'function') {
                if (installed.ready) {
                    require('ready').ready(sel);
                } else {
                    err(true, 6, 'ready.js module not installed');
                }
            }

            if (typeof sel === 'string') {
                if (installed.manipulation &&
                    sel[0] === '<' &&
                    sel[sel.length - 1] === '>' &&
                    sel.length >= 3) {
                    els = require('manipulation').create(
                        sel,
                        ctx && ctx.nodeType ? ctx.ownerDocument || ctx : document
                    );
                } else {
                    els = this.find(sel, ctx, true);
                }
                // hAzzle([dom]) 
            } else if (Array.isArray(sel)) {
                els = util.unique(util.filter(sel, validTypes));
                // hAzzle(dom)
            } else if (this.isNodeList(sel)) {
                els = util.filter(util.makeArray(sel), validTypes);
                // hAzzle(dom)
            } else if (sel.nodeType) {
                // If it's a html fragment, create nodes from it
                if (sel.nodeType === 11) {
                    // This children? Are they an array or not?
                    els = sel.children;
                } else {
                    els = [sel];
                }
                // window     
            } else if (sel === window) {
                els = [sel];
            } else {
                els = [];
            }

            // Create a new hAzzle collection from the nodes found

            if (els === undefined) {
                this.length = 0;
                this.elements = [];
            } else {
                this.elements = els;
                this.length = els.length;
            }
            return this;
        };

    // Expose

    hAzzle.err = err;
    hAzzle.installed = installed;
    hAzzle.require = require;
    hAzzle.define = define;
    hAzzle.codename = codename;
    hAzzle.version = version;

    // Hook hAzzle on the window object

    window.hAzzle = hAzzle;

}(window));

var hAzzle = window.hAzzle || (window.hAzzle = {});

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
        ie = (function() {

            if (doc.documentMode) {
                return doc.documentMode;
            } else {
                var i = 7,
                    div;
                for (; i > 4; i--) {

                    div = doc.createElement('div');

                    div.innerHTML = '<!--[if IE ' + i + ']><span></span><![endif]-->';

                    if (div.getElementsByTagName('span').length) {
                        div = null; // Release memory in IE
                        return i;
                    }
                }
            }

            return undefined;
        })(),
        // Return the current value of the named feature
        has = function(name) {
            return typeof cache[name] === 'function' ? (cache[name] = cache[name](win, doc, element)) : cache[name];
        },
        // Register a new feature test for some named feature
        add = function(name, test, now, force) {
            (typeof cache[name] === 'undefined' || force) && (cache[name] = test);
            return now && has(name);
        },
        // Conditional loading of AMD modules based on a has feature test value.
        load = function(id, parentRequire, loaded) {
            if (id) {
                parentRequire([id], loaded);
            } else {
                loaded();
            }
        },
        // Delete the content of the element passed to test functions.
        clear = function(elem) {
            elem.innerHTML = '';
            return elem;
        };

    // Detect if the classList API supports multiple arguments
    // IE11-- don't support it

    add('multiArgs', function() {
        var mu, div = document.createElement('div');
        div.classList.add('a', 'b');
        mu = /(^| )a( |$)/.test(div.className) && /(^| )b( |$)/.test(div.className);
        // release memory in IE
        div = null;
        return mu;
    });

    // mobile

    add('mobile', /^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua));

    // android

    add('android', /^Android/i.test(ua));

    // opera
    add('opera',
        // Opera 8.x+ can be detected with `window.opera`
        // This is a safer inference than plain boolean type conversion of `window.opera`
        // But note that the newer Opera versions (15.x+) are using the webkit engine
        oString.call(window.opera) === '[object Opera]'
    );

    // Firefox
    add('firefox', typeof InstallTrigger !== 'undefined');

    // Chrome
    add('chrome', win.chrome);

    // Webkit
    add('webkit', 'WebkitAppearance' in doc.documentElement.style);

    // Safari
    add('safari', oString.call(window.HTMLElement).indexOf('Constructor') > 0);

    // ie
    add('ie', function() {
        return false || !!doc.documentMode;
    });

    // Macintosh
    add('mac', navigator.appVersion.indexOf('Macintosh') >= 0);

    // ClassList
    add('classlist', !!document.documentElement.classList);

    // Quirks mode

    add('quirks', document.compatMode == 'BackCompat');

    // XPath

    add('xpath', !!doc.evaluate);

    // Air 

    add('air', !!win.runtime);

    // Detects native support for the Dart programming language

    add('dart', !!(win.startDart || doc.startDart));

    // Detects native support for promises

    add('promise', !!win.Promise);

    // Touch support

    add('touch', "ontouchstart" in document ||
        ("onpointerdown" in document && navigator.maxTouchPoints > 0) ||
        window.navigator.msMaxTouchPoints);

    // Touch events 

    add('touchEvents', 'ontouchstart' in document);

    // Pointer Events

    add('pointerEvents', 'onpointerdown' in document);

    add('MSPointer', 'msMaxTouchPoints' in navigator); //IE10+

    // querySelectorAll
    add('qsa', !!document.querySelectorAll);
    return {
        has: has,
        add: add,
        load: load,
        cache: cache,
        clear: clear,
        ie: ie
    };
});
// types.js
hAzzle.define('Types', function() {

    var oString = Object.prototype.toString,

        // Determines if a reference is an `Array`

        isArray = Array.isArray,

        // Determines if a reference is a `String`

        isString = function(value) {
            return typeof value === 'string';
        },
        // Returns true if `obj` is an array or array-like object (NodeList, Arguments, String ...)
        isArrayLike = function(obj) {
            if (obj == null || isWindow(obj)) {
                return false;
            }

            var length = obj.length;

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return isString(obj) || isArray(obj) || length === 0 ||
                typeof length === 'number' && length > 0 && (length - 1) in obj;
        },
        isNumber = function(value) {
            return typeof value === 'number';
        },
        isBoolean = function(value) {
            return typeof value === 'boolean';
        },

        isEmpty = function(value) {
            if (value == null) {
                return true;
            }
            if (isArray(value) ||
                isString(value) ||
                isType('Arguments')(value)) {
                return value.length === 0;
            }
            var key;
            for (key in value)
                if (value != null && Object.prototype.hasOwnProperty.call(value, key)) {
                    return false;
                }
            return true;
        },

        isElement = function(node) {
            return !!(node &&
                node.nodeName // we are a direct element
            );
        },
        isNaN = function(value) {
            // `NaN` as a primitive is the only value that is not equal to itself
            return isNumber(value) && value != +value;
        },
        // Determines if a reference is undefined
        isUndefined = function(value) {
            return typeof value === 'undefined';
        },
        // Determines if a reference is defined
        isDefined = function(value) {
            return typeof value !== 'undefined';
        },
        isEmptyObject = function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        // Checks if `obj` is a window object
        isWindow = function(obj) {
            return obj && obj.window === obj;
        },

        // Returns a function that returns `true` if `arg` is of the correct `type`, otherwise `false`.
        // e.g isType('Function')( fn )

        isType = function(type) {
            return type ? function(arg) {
                return oString.call(arg) === '[object ' + type + ']';
            } : function() {};
        },

        // Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
        // considered to be objects. Note that JavaScript arrays are objects.

        isObject = function(value) {
            // http://jsperf.com/isobject4
            return value !== null && typeof value === 'object';
        },

        isPlainObject = function(obj) {
            return isType('Object')(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
        },

        isNode = function(elem) {
            return !!elem && typeof elem === 'object' && 'nodeType' in elem;
        },
        isNodeList = function(nodes) {
            var result = Object.prototype.toString.call(nodes);
            // Modern browser such as IE9 / firefox / chrome etc.
            if (result === '[object HTMLCollection]' ||
                result === '[object NodeList]' ||
                // https://developer.mozilla.org/en/docs/Web/API/HTMLFormControlsCollection
                result === '[object HTMLFormControlsCollection]') {
                return true;
            }
            // Detect length and item 
            if (!('length' in nodes) || !('item' in nodes)) {
                return false;
            }
            try {
                if (nodes(0) === null || (nodes(0) && nodes(0).tagName)) return true;
            } catch (e) {
                return false;
            }
            return false;
        };

    this.isNodeList = isNodeList;

    return {

        isType: isType,
        isArray: isArray,
        isEmpty: isEmpty,
        isWindow: isWindow,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isNode: isNode,
        isElement: isElement,
        isString: isString,
        isArrayLike: isArrayLike,
        isNumber: isNumber,
        isBoolean: isBoolean,
        isNaN: isNaN,
        isDefined: isDefined,
        isUndefined: isUndefined,
        isNodeList: isNodeList
    };
});

// text.js
hAzzle.define('text', function() {

    var getText = function(elem) {

        var node,
            ret = '',
            i = 0,
            nodeType = elem.nodeType;

        if (!nodeType) {
            // If no nodeType, this is expected to be an array
            while ((node = elem[i++])) {
                // Do not traverse comment nodes
                ret += getText(node);
            }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            if (typeof elem.textContent === 'string') {
                return elem.textContent;
            } else {
                // Traverse its children
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText(elem);
                }
            }
        } else if (nodeType === 3 || nodeType === 4) { // Text or CDataSection
            return elem.nodeValue;
        }
        return ret;
    }

    return {
        getText: getText
    };
});

// util.js
hAzzle.define('util', function() {

    var // Modules
        aSlice = Array.prototype.slice,
        types = hAzzle.require('types'),
        oKeys = Object.keys,

        // Optimized each function
        // Replacement for forEach - ECMAScript 5 15.4.4.18 

        each = function(obj, fn, args, /*reverse*/ rev) {

            if (obj === undefined) {
                return obj;
            }

            hAzzle.err(typeof fn !== 'function', 5, "'fn' must be a function in util.each()");

            var i, length = obj.length,
                key;

            if (typeof fn === 'function' &&
                typeof args === 'undefined' &&
                typeof rev === 'undefined' &&
                types.isArray(obj)) {

                while (++i < length) {
                    i = rev ? obj.length - i - 1 : i;
                    if (fn.call(obj[i], obj[i], i, obj) === false) {
                        break;
                    }
                }
            }

            if (length === +length) {
                for (i = 0; i < length; i++) {
                    i = rev ? obj.length - i - 1 : i;
                    if (fn.call(obj[i], obj[i], i, obj) === false) {
                        break;
                    }
                }
            } else {
                if (obj) {
                    for (key in obj) {
                        if (fn.call(obj[key], obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        createCallback = function(fn, arg, count) {
            if (typeof fn === 'function') {
                if (arg === undefined) return fn;
                count = !count ? 3 : count;
                return count === 1 ? function(value) {
                        return fn.call(arg, value);
                    } : count === 2 ?
                    function(value, other) {
                        return fn.call(arg, value, other);
                    } : count === 3 ?
                    function(value, index, collection) {
                        return fn.call(arg, value, index, collection);
                    } : count === 4 ?
                    function(accumulator, value, index, collection) {
                        return fn.call(arg, accumulator, value, index, collection);
                    } : function() {
                        return fn.apply(arg, arguments);
                    };
            }

            if (!fn) return identity;
        },

        // Determine if at least one element in the object matches a truth test. 
        // ECMAScript 5 15.4.4.17

        some = function(obj, fn, ctx) {
            if (obj) {
                fn = iterate(fn, ctx);

                ctx = (keys || obj).length;

                var keys,
                    i = 0,
                    currentKey;

                if (obj.length !== +obj.length) {
                    keys = keys(obj);
                }

                for (; i < ctx; i++) {

                    if (keys) {
                        currentKey = keys[i];
                    } else {
                        currentKey = i;
                    }
                    if (fn(obj[currentKey], currentKey, obj)) {
                        return true;
                    }
                }
            }
            return false;
        },
        merge = function(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        // Extends the destination object `obj` by copying all of the 
        // properties from the `src` object(s)

        mixin = function(obj) {
            if (types.isObject(obj)) {
                var source, prop, i = 1,
                    length = arguments.length;

                for (; i < length; i++) {
                    source = arguments[i];
                    for (prop in source) {
                        if (Object.prototype.hasOwnProperty.call(source, prop)) {
                            obj[prop] = source[prop];
                        }
                    }
                }
            }
            return obj;
        },
        makeArray = function(nodeList) {

            if (types.isArray(nodeList)) {
                return nodeList;
            }

            var index = -1,
                length = nodeList.length,
                array = Array(length);

            while (++index < length) {
                array[index] = nodeList[index];
            }
            return array;
        },

        iterate = function(value, ctx, argCount) {
            return value ?
                typeof value === 'function' ?
                createCallback(value, ctx, argCount) :
                types.isObject(value) ?
                matches(value) :
                property(value) :
                identity;
        },
        // Keep the identity function around for default iteratees.
        identity = function(value) {
            return value;
        },

        // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
        matches = function(attrs) {

            var prs = pairs(attrs),
                length = prs.length;

            return function(obj) {

                if (!obj) {
                    return !length;
                }
                obj = new Object(obj);
                var i = 0,
                    pair, key;
                for (; i < length; i++) {
                    pair = prs[i];
                    key = pair[0];
                    if (pair[1] !== obj[key] || !(key in obj)) {
                        return false;
                    }
                }
                return true;
            };
        },

        // Convert an object into a list of `[key, value]` pairs.
        pairs = function(obj) {
            var keys = oKeys(obj),
                length = keys.length,
                pairs = Array(length),
                i = 0;
            for (; i < length; i++) {
                pairs[i] = [keys[i], obj[keys[i]]];
            }
            return pairs;
        },

        property = function(key) {
            return function(obj) {
                return obj[key];
            };
        },

        unique = function(arr, isSorted, fn, ctx) {
            if (!arr) {
                return [];
            }
            if (types.isBoolean(isSorted)) {
                ctx = fn;
                fn = isSorted;
                isSorted = false;
            }
            if (fn !== undefined) {
                fn = iterate(fn, ctx);
            }

            var result = [],
                seen = [],
                i = 0,
                value,
                length = arr.length;

            for (; i < length; i++) {
                value = arr[i];
                if (isSorted) {
                    if (!i || seen !== value) {
                        result.push(value);
                    }
                    seen = value;
                } else if (fn) {
                    var computed = fn(value, i, arr);
                    if (indexOf(seen, computed) < 0) {
                        seen.push(computed);
                        result.push(value);
                    }
                } else if (indexOf(result, value) < 0) {
                    result.push(value);
                }
            }
            return result;
        },

        // Replacement for indexOf
        // ECMAScript 5 15.4.4.14

        indexOf = function(arr, item, isSorted) {

            if (arr == null) {
                return -1;
            }

            var i = 0,
                length = arr.length;

            if (isSorted) {
                if (typeof isSorted === 'number') {

                    if (isSorted < 0) {
                        i = Math.max(0, length + isSorted);
                    } else {
                        i = isSorted;
                    }

                } else {
                    i = sortedIndex(arr, item);
                    return arr[i] === item ? i : -1;
                }
            }
            for (; i < length; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        sortedIndex = function(arr, obj, fn, ctx) {
            fn = iterate(fn, ctx, 1);
            var value = fn(obj),
                low = 0,
                high = arr.length;
            while (low < high) {
                var mid = low + high >>> 1;
                if (fn(arr[mid]) < value) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            return low;
        },

        // Return the results of applying the callback to each element.
        // ECMAScript 5 15.4.4.19

        map = function(obj, fn, ctx) {
            if (obj) {
                fn = iterate(fn, ctx);
                var keys = obj.length !== +obj.length && oKeys(obj),
                    length = (keys || obj).length,
                    results = Array(length),
                    currentKey, index = 0;
                for (; index < length; index++) {
                    currentKey = keys ? keys[index] : index;
                    results[index] = fn.call(obj[currentKey], obj[currentKey], currentKey, obj);
                }
                return results;
            }
            return [];
        },

        // Reduces a collection
        // ECMAScript 5 15.4.4.21     
        reduce = function(collection, fn, accumulator, args) {

            if (!collection) {
                collection = [];
            }

            fn = createCallback(fn, args, 4);

            var keys = collection.length !== +collection.length && oKeys(collection),
                length = (keys || collection).length,
                index = 0,
                currentKey;

            if (arguments.length < 3) {
                hAzzle.err(!length, 7, ' no collection length exist in collection.reduce()');
                accumulator = collection[keys ? keys[index++] : index++];
            }
            for (; index < length; index++) {
                currentKey = keys ? keys[index] : index;
                accumulator = fn(accumulator, collection[currentKey], currentKey, collection);
            }
            return accumulator;
        },

        // Return the elements nodeName

        nodeName = function(el, name) {
            return el && el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase();
        },

        // Native solution for filtering arrays. 
        // ECMAScript 5 15.4.4.20  

        filter = function(arr, fn, ctx) {
            var results = [];
            if (!arr) {
                return results;
            }
            fn = iterate(fn, ctx);
            each(arr, function(val, index, list) {
                if (fn(val, index, list)) {
                    results.push(val);
                }
            });
            return results;
        },
        // Bind a function to a ctx, optionally partially applying any
        // Replacement for bind() - ECMAScript 5 15.3.4.5

        bind = function(fn, ctx) {

            var curryArgs = arguments.length > 2 ?
                aSlice.call(arguments, 2) : [],
                tmp;

            if (typeof ctx === 'string') {

                tmp = fn[ctx];
                ctx = fn;
                fn = tmp;
            }

            if (typeof fn === 'function' && !(ctx instanceof RegExp)) {

                return curryArgs.length ? function() {
                    return arguments.length ?
                        fn.apply(ctx || this, curryArgs.concat(aSlice.call(arguments, 0))) :
                        fn.apply(ctx || this, curryArgs);
                } : function() {
                    return arguments.length ?
                        fn.apply(ctx || this, arguments) :
                        fn.call(ctx || this);
                };

            } else {
                return ctx;
            }
        };

    return {
        map: map,
        some: some,
        reduce: reduce,
        each: each,
        mixin: mixin,
        makeArray: makeArray,
        merge: merge,
        nodeName: nodeName,
        unique: unique,
        indexOf: indexOf,
        filter: filter,
        now: Date.now,
        bind: bind
    };
});

// core.js
hAzzle.define('Core', function() {
    var docset = 1,
        document = window.document,
        winDoc = window.document,
        expando = 'hAzzle_' + 1 * new Date(),
        cur,
        environment,
        indexOf = Array.prototype.indexOf,
        envsCache = {},
        sortInput,
        sortDetached = (function() {
            var ret, div = document.createElement('div');
            // Should return 1, but returns 4 (following)
            ret = div.compareDocumentPosition(document.createElement('div')) & 1;
            div = null;
            return ret;
        }()),
        hasDuplicate,
        detectDuplicates = function() {
            return !!hasDuplicate;
        },

        sortOrder = function(a, b) {
            if (a === b) {
                hasDuplicate = true;
            }
            return 0;
        },
        sortStable = expando.split('').sort(sortOrder).join('') === expando,

        siblingCheck = function(a, b) {
            var cur = b && a,
                diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                (~b.sourceIndex || 1 << 31) -
                (~a.sourceIndex || 1 << 31);

            // Use IE sourceIndex if available on both nodes
            if (diff) {
                return diff;
            }

            // Check if b follows a
            if (cur) {
                while ((cur = cur.nextSibling)) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }
            return a ? 1 : -1;
        },
        isNative = function(method) {
            return /^[^{]+\{\s*\[native \w/.test('' + method);
        },

        // Feature/bug detection & init compiler enviroment

        setDocument = function(doc) {

            var root, matches, div, node, QSABugs, matchesBugs;

            cur = doc = doc.ownerDocument || doc;
            root = doc.documentElement;

            // If no document and documentElement is available, return
            if (cur.nodeType !== 9 || !cur.documentElement) {
                return document;
            }

            // Set our document
            document = doc;

            if ((div = root.getAttribute('__hAzzle'))) {
                return (environment = envsCache[div]);
            }

            root.setAttribute('__hAzzle', docset);

            environment = {
                id: ++docset
            };

            environment.qsa = isNative(doc.querySelectorAll);
            environment.compare = isNative(root.compareDocumentPosition);
            environment.contains = isNative(root.contains);

            environment.QSABugs = QSABugs = [];
            environment.matchesBugs = matchesBugs = [];

            // QSA buggy detection
            if (environment.qsa) {

                div = doc.createElement('div');
                div.appendChild(doc.createElement('select'));
                (node = doc.createElement('option')).setAttribute('selected', '');
                div.firstChild.appendChild(node);

                // :checked should return selected option elements

                if (!div.querySelectorAll(':checked').length) {
                    QSABugs.push(':checked');
                }

                environment.QSABugs = QSABugs.length && new RegExp(QSABugs.join('|'));
            }

            if (isNative((matches = root.webkitMatchesSelector ||
                    root.mozMatchesSelector ||
                    root.oMatchesSelector ||
                    root.msMatchesSelector))) {

                environment.matchesSelector = matches;
                environment.disconMatch = matches.call(div, 'div');
                environment.matchesBugs = matchesBugs.length && new RegExp(matchesBugs.join('|'));
            }

            // Prevent memory leaks

            div = node = null;

            // Cache the result

            envsCache[docset] = environment
            return envsCache[docset];
        };

    setDocument(document);

    var isXML = function(elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== 'HTML' : false;
        },

        contains = (environment.compare && environment.contains) ? function(a, b) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentElement;

            return a === bup || !!(bup && bup.nodeType === 1 && (
                adown.contains ?
                adown.contains(bup) :
                a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
            ));
        } : function(a, b) {
            if (b) {
                while ((b = b.parentElement)) {

                    if (b === a) {
                        return true;
                    }
                }
            }

            return false;
        };

    sortOrder = (environment.compare) ? function(a, b) {
        // Flag for duplicate removal
        if (a === b) {
            hasDuplicate = true;
            return 0;
        }

        // Sort on method existence if only one input has compareDocumentPosition
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if (compare) {
            return compare;
        }

        // Calculate position if both inputs belong to the same document
        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
            a.compareDocumentPosition(b) :

            // Otherwise we know they are disconnected
            1;

        // Disconnected nodes
        if (compare & 1 ||
            (!sortDetached && b.compareDocumentPosition(a) === compare)) {

            // Choose the first element that is related to our preferred document
            if (a === cur || a.ownerDocument === winDoc && contains(winDoc, a)) {
                return -1;
            }
            if (b === cur || b.ownerDocument === winDoc && contains(winDoc, b)) {
                return 1;
            }

            // Maintain original order
            return sortInput ?
                (indexOf(sortInput, a) - indexOf(sortInput, b)) :
                0;
        }

        return compare & 4 ? -1 : 1;
    } : function(a, b) {
        // Exit early if the nodes are identical
        if (a === b) {
            hasDuplicate = true;
            return 0;
        }
        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [a],
            bp = [b];

        // Parentless nodes are either documents or disconnected
        if (!aup || !bup) {
            return a === cur ? -1 :
                b === cur ? 1 :
                aup ? -1 :
                bup ? 1 :
                sortInput ?
                (indexOf(sortInput, a) - indexOf(sortInput, b)) :
                0;

            // If the nodes are siblings, we can do a quick check
        } else if (aup === bup) {
            return siblingCheck(a, b);
        }

        // Otherwise we need full lists of their ancestors for comparison
        cur = a;
        while ((cur = cur.parentNode)) {
            ap.unshift(cur);
        }
        cur = b;
        while ((cur = cur.parentNode)) {
            bp.unshift(cur);
        }

        // Walk down the tree looking for a discrepancy
        while (ap[i] === bp[i]) {
            i++;
        }

        return i ?
            // Do a sibling check if the nodes have a common ancestor
            siblingCheck(ap[i], bp[i]) :

            // Otherwise nodes in our document sort first
            ap[i] === winDoc ? -1 :
            bp[i] === winDoc ? 1 :
            0;
    };

    var unique = function(results) {
            var elem,
                duplicates = [],
                j = 0,
                i = 0;

            hasDuplicate = !detectDuplicates;
            sortInput = !sortStable && results.slice(0);
            results.sort(sortOrder);

            if (hasDuplicate) {
                while ((elem = results[i++])) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }

            sortInput = null;

            return results;
        },

        // Add feature / bug test for current document
        addFeature = function(prop, value) {
            if (typeof prop === 'string' && value) {
                envsCache[docset][prop] = value;
            }
        };

    return {
        environment: environment,
        expando: expando,
        addFeature: addFeature,
        setDocument: setDocument,
        isXML: isXML,
        isHTML: !isXML(document),
        contains: contains,
        unique: unique,
        matches: environment.matchesSelector,
        qsa: environment.qsa,
        QSABugs: environment.QSABugs,
        matchesBugs: environment.matchesBugs
    };
});
// collection.js
hAzzle.define('Collection', function() {

    var win = this,
        // Dependencies
        util = hAzzle.require('util'),
        types = hAzzle.require('types'),
        arrayProto = Array.prototype,
        aConcat = arrayProto.concat,
        aPush = arrayProto.push,

        // For DOM elements, better to use ECMA 7 - contains (e.g.  elem.contains(array, obj);

        includes = function(array, obj) {
            return arrayProto.indexOf.call(array, obj) != -1;
        },
        inArray = function(elem, array, i) {
            return array === undefined ? -1 : arrayProto.indexOf.call(array, elem, i);
        },

        arrayRemove = function(array, value) {
            var index = array.indexOf(value);
            if (index >= 0)
                array.splice(index, 1);
            return value;
        },
        makeArray = function(arr, results) {
            var ret = results || [];
            if (arr !== undefined) {
                if (types.isArrayLike(Object(arr))) {
                    util.merge(ret, types.isString(arr) ? [arr] : arr);
                } else {
                    aPush.call(ret, arr);
                }
            }

            return ret;
        },
        slice = function(array, start, end) {
            if (typeof start === 'undefined') {
                start = 0;
            }
            if (typeof end === 'undefined') {
                end = array ? array.length : 0;
            }
            var index = -1,
                length = end - start || 0,
                result = Array(length < 0 ? 0 : length);

            while (++index < length) {
                result[index] = array[start + index];
            }
            return result;
        };

    // Convert hAzzle '.elements Array' to a jQuery / Zepto array
    // where 'this' contains the elements. The '.elements Array 
    // will be kept, but it will be possible to run jQuery / Zepto functions

    this.toJqueryZepto = function() {
        var i = this.length,
            els = this.elements;
        while (i--) {
            this[i] = els[i];
        }
        return this;
    };

    // Return an array or a specific DOM element matched by the hAzzle object

    this.get = function(index) {
        var result, els = this.elements;
        if (index === undefined) {
            result = slice(els, 0);
        } else if (index < 0) {
            result = els[this.length + index];
        } else {
            result = els[index];
        }
        return result;
    };

    // Get the element at position specified by index from the current collection.
    this.eq = function(index) {
        return hAzzle(index === -1 ? slice(this.elements, this.length - 1) : slice(this.elements, index, index + 1));
    };

    this.reduce = function(fn, accumulator, args) {
        return util.reduce(this.elements, fn, accumulator, args);
    };

    this.indexOf = function(elem, arr, i) {
        return arr == null ? -1 : arrayProto.indexOf.call(arr, elem, i);
    };

    this.map = function(fn, args) {
        return hAzzle(util.map(this.elements, fn, args));
    };

    this.each = function(fn, args, /*reverse*/ rev) {
        util.each(this.elements, fn, args, rev);
        return this;
    };

    this.slice = function(start, end) {
        return hAzzle(slice(this.elements, start, end));
    };

    // Concatenate two elements lists

    this.concat = function() {
        var args = util.map(slice(arguments), function(arr) {
            return arr instanceof hAzzle ? arr.elements : arr;
        });
        return hAzzle(aConcat.apply(this.elements, args));
    };

    // Get the children of each element in the set of matched elements, 
    // including text and comment nodes.

    this.contents = function() {
        return this.map(function() {
            return this.contentDocument || slice(this.childNodes) || [];
        });
    };

    // Check the current matched set of elements against a selector, element, or 
    // hAzzle object and return true if at least one of these elements matches the given arguments.

    this.is = function(sel) {
        return this.length > 0 && this.filter(sel).length > 0;
    };

    // Remove elements from the set of matched elements

    this.not = function(sel) {
        return this.filter(sel, true);
    };

    // Determine the position of an element within the set

    this.index = function(node) {
        var els = this.elements;
        if (!node) {
            return (els[0] && els[0].parentElement) ? this.first().prevAll().length : -1;
        }

        // Index in selector
        if (typeof node === 'string') {
            return util.indexOf(hAzzle(node).elements, els[0]);
        }

        // Locate the position of the desired element
        return util.indexOf(els, node instanceof hAzzle ? node.elements[0] : node);
    };
    // Concatenate new elements to the '.elements array
    // Similar to jQuery / Zepto's .add() method

    this.add = function(sel, ctx) {
        return this.concat(typeof sel === 'string' ? hAzzle(sel, ctx).elements : sel);
    };

    // Reduce the set of matched elements to the first in the set, or 
    // to the 'num' first element in the set

    this.first = function(num) {
        return num ? this.slice(0, num) : this.eq(0);
    };

    // Reduce the set of matched elements to the final one in the set, or 
    // to the 'num' last element in the set
    this.last = function(num) {
        return num ? this.slice(this.length - num) : this.eq(-1);
    };

    // Return 'even' elements from the '.elements array'
    this.even = function() {
        return this.filter(function(i) {
            return i % 2 !== 0;
        });
    };
    // Return 'odd' elements from the '.elements array'
    this.odd = function() {
        return this.filter(function(i) {
            return i % 2 === 0;
        });
    };

    // First() and prev()
    util.each({
        next: 'nextElementSibling',
        prev: 'previousElementSibling'
    }, function(value, prop) {
        this[prop] = function(sel) {
            return this.map(function() {
                return this[value];
            }).filter(sel);
        };
    }.bind(this));

    // prevAll() and nextAll()
    util.each({
        prevAll: 'previousElementSibling',
        nextAll: 'nextElementSibling'
    }, function(value, prop) {
        this[prop] = function() {
            var matched = [];
            this.each(function(elem) {
                while ((elem = elem[value]) && elem.nodeType !== 9) {
                    matched.push(elem);
                }
            });
            return hAzzle(matched);
        };
    }.bind(this));

    // Native prototype methods that return a usable value
    util.each(['shift',
            'splice',
            'unshift',
            'join',
            'lastIndexOf',
            'forEach',
            'reduceRight'
        ],
        function(method) {
            this[method] = function() {
                return this.elements[method].apply(this.elements, arguments)
            }
        }.bind(this))

    return {
        makeArray: makeArray,
        inArray: inArray,
        includes: includes,
        arrayRemove: arrayRemove,
        slice: slice
    };
});

// jiesa.js
hAzzle.define('Jiesa', function() {

    var // Dependencies    

        util = hAzzle.require('util'),
        core = hAzzle.require('core'),
        collection = hAzzle.require('collection'),
        types = hAzzle.require('types'),
        features = hAzzle.require('has'),

        // RegEx
        idClassTagNameExp = /^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,
        tagNameAndOrIdAndOrClassExp = /^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,
        unionSplit = /([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,
        rattributeQuotes = /=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,
        quickMatch = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        relativeSel = /^\s*[+~]/,
        reSpace = /[\n\t\r]/g,

        pseudos = {

            ':enabled': function(elem) {
                return elem.disabled === false;
            },

            ':disabled': function(elem) {
                return elem.disabled === true;
            },

            ':checked': function(elem) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === 'input' && !!elem.checked) || (nodeName === 'option' && !!elem.selected);
            },
            ':hidden': function(elem) {
                var style = elem.style;
                if (style) {

                    if (style.display === 'none' ||
                        style.visibility === 'hidden') {
                        return true;
                    }
                }
                return elem.type === 'hidden';

            },
            ':visible': function(elem) {

                return !pseudos[':hidden'](elem);
            }
        },

        fixedRoot = function(context, query, method) {
            var oldContext = context,
                old = context.getAttribute('id'),
                nid = old || '__hAzzle__',
                hasParent = context.parentNode,
                relativeHierarchySelector = relativeSel.test(query);

            if (relativeHierarchySelector && !hasParent) {
                return [];
            }
            if (!old) {
                context.setAttribute('id', nid);
            } else {
                nid = nid.replace(/'/g, '\\$&');
            }
            if (relativeHierarchySelector && hasParent) {
                context = context.parentNode;
            }
            var selectors = query.match(unionSplit);
            for (var i = 0; i < selectors.length; i++) {
                selectors[i] = "[id='" + nid + "'] " + selectors[i];
            }
            query = selectors.join(',');

            try {
                return method.call(context, query);
            } finally {
                if (!old) {
                    oldContext.removeAttribute('id');
                }
            }
        },

        // Dependencies: DOM Level 4 matches()

        matchesSelector = function(elem, sel, ctx) {

            if (ctx && ctx.nodeType !== 9) {
                // doesn't support three args, use rooted id trick
                return fixedRoot(ctx, sel, function(query) {
                    return elem.matches(query);
                });
            }
            // We have a native matchesSelector, use that
            return elem.matches(sel);
        },

        // Determine if the element contains the klass.
        // Uses the `classList` api if it's supported.

        containsClass = function(el, cls) {
            if (features.has('classList')) {
                return el.classList.contains(cls);
            } else {
                return (' ' + el.className + ' ').replace(reSpace, ' ').indexOf(cls) >= 0;
            }
        },

        normalizeCtx = function(root) {
            if (!root) {
                return document;
            }
            if (typeof root === 'string') {
                return jiesa(root);
            }
            if (!root.nodeType && types.isArrayLike(root)) {
                return root[0];
            }
            return root;
        },

        // Find elements by selectors.

        jiesa = function(sel, ctx) {
            var m, nodeType, elem, ret, results = [];

            ctx = normalizeCtx(ctx);

            if (!sel || typeof sel !== 'string') {
                return results;
            }

            if ((nodeType = ctx.nodeType) !== 1 && nodeType !== 9 && nodeType !== 11) {
                return [];
            }

            if (core.isHTML) {

                if ((m = idClassTagNameExp.exec(sel))) {
                    if ((sel = m[1])) {
                        if (nodeType === 9) {
                            elem = ctx.getElementById(sel);
                            if (elem && elem.id === sel) {
                                return [elem];
                            } else {
                                return [];
                            }
                        } else {
                            // Context is not a document
                            if (ctx.ownerDocument && (elem = ctx.ownerDocument.getElementById(sel)) &&
                                core.contains(ctx, elem) && elem.id === m) {
                                return [elem];
                            }
                        }
                    } else if ((sel = m[2])) {
                        ret = ctx.getElementsByClassName(sel);
                    } else if ((sel = m[3])) {
                        ret = ctx.getElementsByTagName(sel);
                    }
                    return collection.slice(ret);
                    // E.g. hAzzle( 'span.selected' )  
                } else if ((m = tagNameAndOrIdAndOrClassExp.exec(sel))) {
                    var result = ctx.getElementsByTagName(m[1]),
                        id = m[2],
                        className = m[3];
                    util.each(result, function(el) {
                        if (el.id === id || containsClass(el, className)) {
                            results.push(el);
                        }
                    });
                    return results;
                }
            }

            // Fallback to QSA if the native selector engine are not installed
            // Fixme! Check for installed selector engine will be set to false soon

            if (core.qsa && (!core.QSABugs || !core.QSABugs.test(sel))) {
                try {
                    if (ctx.nodeType === 1) {
                        ret = fixedRoot(ctx, sel, ctx.querySelectorAll);
                    } else {
                        // we can use the native qSA
                        ret = ctx.querySelectorAll(sel);
                    }
                    return collection.slice(ret);
                } catch (e) {}
            }
        },

        // Speeding up matches
        // Many people uses "is(':hidden') / "is(':visible'), so to make them happy we introduced basic 
        // CSS2 / CSS3 pseudo support

        matches = function(elem, sel, ctx) {

            if (sel.nodeType) {
                return elem === sel;
            }
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                core.setDocument(elem);
            }

            // Make sure that attribute selectors are quoted
            sel = typeof sel === 'string' ? sel.replace(rattributeQuotes, "='$1']") : sel;

            // If instance of hAzzle

            if (sel instanceof hAzzle) {
                return util.some(sel.elements, function(sel) {
                    return matches(elem, sel);
                });
            }

            if (elem === document) {
                return false;
            }

            var quick = quickMatch.exec(sel);

            if (quick) {
                //   0  1    2   3          4
                // [ _, tag, id, attribute, class ]
                if (quick[1]) {
                    quick[1] = quick[1].toLowerCase();
                }
                if (quick[3]) {
                    quick[3] = quick[3].split('=');
                }
                if (quick[4]) {
                    quick[4] = ' ' + quick[4] + ' ';
                }

                return (
                    (!quick[1] || elem.nodeName.toLowerCase() === quick[1]) &&
                    (!quick[2] || elem.id === quick[2]) &&
                    (!quick[3] || (quick[3][1] ? elem.getAttribute(quick[3][0]) === quick[3][1] : elem.hasAttribute(quick[3][0]))) &&
                    (!quick[4] || (' ' + elem.className + ' ').indexOf(quick[4]) >= 0)
                );
            } else {

                var m = pseudos[sel];

                if (m) {
                    return !!m(elem);
                } else {

                    if (core.matches && core.isHTML &&
                        (!core.rbuggyMatches || !core.rbuggyMatches.test(sel)) &&
                        (!core.QSABugs || !core.QSABugs.test(sel))) {

                        try {
                            var ret = matchesSelector(elem, sel, ctx);

                            // IE 9's matchesSelector returns false on disconnected nodes
                            if (ret || core.disconMatch ||

                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9
                                elem.document && elem.document.nodeType !== 11) {
                                return ret;
                            }
                        } catch (e) {}
                    } else {
                        hAzzle.err(true, 23, ' jiesa.js module need to be installed');
                    }
                }
            }

        };

    this.find = function(selector, context, /*internal*/ internal) {

        if (!internal) {

            if (typeof selector !== 'string') {

                var i = 0,
                    len = this.length,
                    self = this.elements;

                return hAzzle(util.filter(hAzzle(selector).elements, function(node) {
                    for (; i < len; i++) {
                        if (core.contains(self[i], node)) {
                            return true;
                        }
                    }
                }));
            }
            return util.reduce(this.elements, function(els, element) {
                return hAzzle(els.concat(collection.slice(jiesa(selector, element))));
            }, []);

        }
        return jiesa(selector, context);
    };

    // Filter element collection

    this.filter = function(sel, not) {

        if (sel === undefined) {
            return this;
        }
        if (typeof sel === 'function') {
            var els = [];
            this.each(function(el, index) {
                if (sel.call(el, index)) {
                    els.push(el);
                }
            });

            return hAzzle(els);

        } else {
            return this.filter(function() {
                return matches(this, sel) !== (not || false);
            });
        }
    };

    return {
        matchesSelector: matchesSelector,
        matches: matches,
        pseudos: pseudos,
        find: jiesa
    };
});

// strings.js
hAzzle.define('Strings', function() {
    var

    // Hyphenate RegExp

        sHyphenate = /[A-Z]/g,

        // camlize RegExp

        specialChars = /([\:\-\_]+(.))/g,

        // Firefox RegExp

        mozPrefix = /^moz([A-Z])/,

        // Cache array for hAzzle.camelize()

        camelCache = [],

        // Used by camelize as callback to replace()

        fcamelize = function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        },
        // Used by hyphenate as callback to replace()

        fhyphenate = function(letter) {
            return ('-' + letter.charAt(0).toLowerCase());
        },

        capitalize = function(str) {
            return str && typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : '';
        },
        unCapitalize = function(str) {
            return str && typeof str === 'string' ? str.charAt(0).toLowerCase() + str.slice(1) : '';
        },

        // Convert a string from camel case to 'CSS case', where word boundaries are
        // described by hyphens ('-') and all characters are lower-case.
        // e.g. boxSizing -> box-sizing

        hyphenate = function(str) {
            if (typeof str === 'string') {
                return str ? str.replace(sHyphenate, fhyphenate) : str;
            } else {
                str = typeof str === 'number' ? '' + str : '';
            }
            return str ? ('data-' + str.toLowerCase()) : str;
        },

        // Convert a string to camel case notation.
        camelize = function(str) {
            return camelCache[str] ? camelCache[str] :
                camelCache[str] = str.
            replace(specialChars, fcamelize).
            replace(mozPrefix, 'Moz$1');
        },

        // Remove leading and trailing whitespaces of the specified string.

        trim = function(str) {
            return typeof str === 'string' ? str.trim() : str;
        },

        // Converts the specified string to lowercase.

        lowercase = function(str) {
            return typeof str === 'string' ? str.toLowerCase() : str;
        },

        // Converts the specified string to uppercase
        uppercase = function(str) {
            return typeof str === 'string' ? str.toUpperCase() : str;
        };

    return {

        capitalize: capitalize,
        unCapitalize: unCapitalize,
        hyphenate: hyphenate,
        camelize: camelize,
        trim: trim,
        lowercase: lowercase,
        uppercase: uppercase
    };
});

// storage.js
hAzzle.define('storage', function() {

    var // Dependencies

        util = hAzzle.require('util'),
        strings = hAzzle.require('strings'),
        types = hAzzle.require('types'),
        core = hAzzle.require('core'),

        // camelize 

        camelize = strings.camelize,

        // RegExes

        htmlRegEx = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        charRegEx = /([A-Z])/g,
        WhiteRegex = (/\S+/g),

        dataAttr = function(elem, key, data) {

            var name;

            if (data === undefined && elem.nodeType === 1) {

                name = 'data-' + key.replace(charRegEx, '-$1').toLowerCase();

                data = elem.getAttribute(name);

                if (typeof data === 'string') {
                    try {
                        data = data === 'true' ? true :
                            data === 'false' ? false :
                            data === 'null' ? null :
                            // Only convert to a number if it doesn't change the string
                            +data + '' === data ? +data :
                            htmlRegEx.test(data) ? JSON.parse(data + '') : data;
                    } catch (e) {}

                    // Make sure we set the data so it isn't changed later
                    userData.set(elem, key, data);

                } else {

                    data = undefined;
                }
            }

            return data;
        },

        Storage = function() {
            this.expando = core.expando + Math.random();
        };

    Storage.prototype = {
        
        constructor: Storage,

        register: function(elem, initial) {

            hAzzle.err(!types.isObject(elem), 22, 'no valid DOM element in storage.js');

            if (elem.nodeType) {

                elem[this.expando] = {
                    value: initial || {}
                };

                // Only use ES5 defineProperty for non-nodes
            } else {
                Object.defineProperty(elem, this.expando, {
                    value: initial || {},
                    writable: true,
                    configurable: true
                });
            }

            return elem[this.expando];
        },
        cache: function(elem, initial) {

            // Always return an empty object.
            if (!elem || !(elem.nodeType === 1 ||
                    elem.nodeType === 9 ||
                    !(+elem.nodeType))) {
                return {};
            }

            // Check if the elem object already has a cache
            var cache = elem[this.expando];

            // If so, return it
            if (cache) {
                return cache;
            }

            // If not, register one
            return this.register(elem, initial);
        },
        set: function(elem, data, value) {
            if (elem) {

                var prop, cache = this.cache(elem);

                if (cache) {
                    // Handle: [ elem, key, value ] args
                    if (typeof data === 'string') {
                        cache[data] = value;

                        // Handle: [ elem, { properties } ] args
                    } else {
                        // Fresh assignments by object are shallow copied
                        if (types.isEmptyObject(cache)) {

                            util.mixin(cache, data);
                            // Otherwise, copy the properties one-by-one to the cache object
                        } else {
                            for (prop in data) {
                                cache[prop] = data[prop];
                            }
                        }
                    }
                    return cache;
                }
            }
        },
        access: function(elem, key, value) {
            var stored;

            if (key === undefined ||
                ((key && typeof key === 'string') && value === undefined)) {

                stored = this.get(elem, key);

                return stored !== undefined ?
                    stored : this.get(elem, camelize(key));
            }

            this.set(elem, key, value);

            // Since the 'set' path can have two possible entry points
            // return the expected data based on which path was taken[*]
            return value !== undefined ? value : key;
        },
        get: function(elem, key) {
            var cache = this.cache(elem);
            if (cache) {
                return cache !== undefined && key === undefined ? cache : cache[key];
            }
        },
        release: function(elem, key) {
            var i, name, camel,
                cache = this.cache(elem);

            if (key === undefined) {
                this.register(elem);

            } else {
                // Support array or space separated string of keys
                if (types.isArray(key)) {
                    name = key.concat(key.map(camelize));
                } else {
                    camel = camelize(key);
                    // Try the string as a key before any manipulation
                    if (key in cache) {
                        name = [key, camel];
                    } else {
                        name = camel;
                        name = cache[name] ? [name] : (name.match(WhiteRegex) || []);
                    }
                }

                i = name.length;

                while (i--) {
                    delete cache[name[i]];
                }
            }
        },
        hasData: function(elem) {
            return !types.isEmptyObject(
                elem[this.expando] || {}
            );
        },
        flush: function(elem) {
            if (elem[this.expando]) {
                delete elem[this.expando];
            }
        }
    };

    var privateData = new Storage(),
        userData = new Storage();

    this.data = function(key, value) {

        var i, name, data,
            elem = this.elements[0],
            attrs = elem && elem.attributes;

        // Gets all values

        if (key === undefined) {

            if (this.length) {

                data = userData.get(elem);

                if (elem.nodeType === 1 && !privateData.get(elem, 'hasDataAttrs')) {

                    i = attrs.length;

                    while (i--) {

                        if (attrs[i]) {

                            name = attrs[i].name;

                            if (name.indexOf('data-') === 0) {

                                name = camelize(name.slice(5));
                                dataAttr(elem, name, data[name]);
                            }
                        }
                    }

                    privateData.set(elem, 'hasDataAttrs', true);
                }
            }

            return data;
        }

        // Sets multiple values

        if (typeof key === 'object') {

            return this.each(function(elem) {
                userData.set(elem, key);
            });
        }
        var camelKey = camelize(key);

        if (elem && value === undefined) {

            data = userData.get(elem, key);

            if (data !== undefined) {

                return data;
            }

            data = userData.get(elem, camelKey);

            var hasDataAttrs = privateData.get(this, 'hasDataAttrs'),
                isHyphenated = key.indexOf('-') !== -1;

            if (data !== undefined) {

                return data;
            }

            data = dataAttr(elem, camelKey, undefined);

            if (data !== undefined) {

                return data;
            }

            // We tried really hard, but the data doesn't exist.

            return;
        }

        // Set the data...

        this.each(function(elem) {

            var data = userData.get(elem, camelKey);
            userData.set(elem, camelKey, value);

            if (isHyphenated && data !== undefined) {
                userData.set(elem, key, value);
            }

            if (isHyphenated && hasDataAttrs === undefined) {
                userData.set(elem, key, value);
            }
        });
    };

    // Remove attributes from element collection

    this.removeData = function(key) {
        return this.each(function(elem) {
            userData.release(elem, key);
        });
    };

    return {
        private: privateData,
        data: userData
    };
});
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

                if (feature.ie === 9 && prop === 'filter') {
                    ret = computedStyle.getPropertyValue(prop);
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
        boolHooks = {
            get: {},
            set: {}
        },
        getElem = function(elem) {
            return elem instanceof hAzzle ? elem.elements : elem;
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

            if (nodeType && (nodeType !== 3 || nodeType !== 8 || nodeType !== 2)) {

                // Fallback to prop when attributes are not supported
                if (typeof elem.getAttribute === 'undefined') {
                    return prop(elem, name, value);
                }

                if (nodeType !== 1 || !core.isXML(elem)) {

                    name = name.toLowerCase();
                    hooks = (attrHooks[value === 'undefined' ? 'get' : 'set'][name] || null) ||
                        getBooleanAttrName(elem, name) ?
                        boolHooks[value === 'undefined' ?
                            'get' : 'set'][name] : nodeHooks[value === 'undefined' ? 'get' : 'set'][name];
                }

                // Get attribute

                if (value === undefined) {

                    if (hooks && (ret = hooks.get(elem, name))) {
                        if (ret !== null) {
                            return ret;
                        }
                    }

                    ret = elem.getAttribute(name, 2);
                    // Non-existent attributes return null, we normalize to undefined
                    return ret == null ? undefined : ret;
                }

                // Set attribute

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

            if (nodeType && (nodeType !== 3 || nodeType !== 8 || nodeType !== 2)) {

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
        boolHooks: boolHooks,
        nodeHooks: nodeHooks,
        propMap: propMap,
        boolAttr: boolAttr,
        boolElem: boolElem,
        removeAttr: removeAttr,
        attr: attr,
        prop: prop
    };
});
// boolhooks.js
hAzzle.define('boolhooks', function() {

    var setters = hAzzle.require('setters');

    setters.boolHooks.set = function(elem, value, name) {
        // If value is false, remove the attribute
        if (value === false) {
            setters.removeAttr(elem, name);
        } else {
            elem.setAttribute(name, name);
        }
        return name;
    };

    return {};
});
// attrhooks.js
hAzzle.define('attrHooks', function() {

    var util = hAzzle.require('util'),
        setters = hAzzle.require('setters'),

        radioValue = (function() {

            var input = document.createElement('input');

            input.type = 'checkbox';

            // Support: IE<=11+
            // An input loses its value after becoming a radio
            input = document.createElement('input');
            input.value = 't';
            input.type = 'radio';
            return input.value === 't';

        }());

    // Setter
    util.mixin(setters.attrHooks.set, {

        'type': function(elem, value) {
            if (!radioValue && value === 'radio' &&
                util.nodeName(elem, 'input')) {
                var val = elem.value;
                elem.setAttribute('type', value);
                if (val) {
                    elem.value = val;
                }
                return value;
            }
        }
    });
    return {};
});

// prophooks.js
hAzzle.define('prophooks', function() {

    var util = hAzzle.require('util'),
        setters = hAzzle.require('setters');

    util.mixin(setters.propHooks.get, {
        'tabIndex': function(elem) {
            return elem.hasAttribute('tabindex') ||
                /^(?:input|select|textarea|button)$/i.test(elem.nodeName) || elem.href ?
                elem.tabIndex :
                -1;
        }
    });

    // Support: IE<=11+
    // Must access selectedIndex to make default options select

    var select = document.createElement('select'),
        opt = select.appendChild(document.createElement('option'));

    if (!opt.selected) {
        setters.propHooks.get.selected = function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
            }
            return null;
        };
    }
    return {};
});
// valhooks.js
hAzzle.define('valHooks', function() {

    var util = hAzzle.require('util'),
        strings = hAzzle.require('strings'),
        text = hAzzle.require('text'),
        types = hAzzle.require('types'),
        collection = hAzzle.require('collection'),
        setters = hAzzle.require('setters'),

        // Support: Android<4.4
        supportCheckboxes = (function() {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            var node = checkbox.getAttributeNode('checked');
            return !node || !node.specified;
        })(),

        // iOF() gives approx 40 - 60% better performance then native indexOf
        // for valHooks

        iOf = function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        };

    // Setter
    util.mixin(setters.valHooks.set, {

        'select': function(elem, value) {
            var optionSet, option,
                options = elem.options,
                values = collection.makeArray(value),
                i = options.length;

            while (i--) {
                option = options[i];

                if ((option.selected = iOf(values, option.value) >= 0)) {
                    optionSet = true;
                }
            }

            // Force browsers to behave consistently when non-matching value is set
            if (!optionSet) {
                elem.selectedIndex = -1;
            }
            return values;
        }
    });

    // Getter    
    util.mixin(setters.valHooks.get, {

        'option': function(elem) {

            var val = elem.getAttribute(name, 2);

            return val !== null ?
                val :
                strings.trim(text.getText(elem));
        },

        'select': function(elem) {

            var index = elem.selectedIndex,
                // Single box type attribute for select-one
                // Checkbox type attribute for select-multiple
                one = elem.type === 'select-one',
                options = elem.options,
                vals = [],
                val, max, option, i;

            if (index < 0) {
                return '';
            }

            i = one ? index : 0;
            max = one ? index + 1 : options.length;
            for (; i < max; i++) {
                option = options[i];
                // Traverse the option element when the elements needed to filter out disabled
                if (option.selected && option.getAttribute('disabled') === null &&
                    (!option.parentElement.disabled || option.parentElement.tagName !== 'OPTGROUP')) {

                    val = hAzzle(option).val();

                    if (one) {
                        return val;
                    }

                    vals.push(val);
                }
            }

            if (one && !vals.length && options.length) {
                return options[index].value;
            }

            return vals;
        }
    });

    // Radios and checkboxes setter

    util.each(['radio', 'checkbox'], function(val) {
        setters.valHooks.set[val] = function(elem, value) {
            if (types.isArray(value)) {
                return (elem.checked = iOf(value, hAzzle(elem).val()) >= 0);
            }
        };
    });

    if (!supportCheckboxes) {
        setters.valHooks.get[val] = function(elem) {
            return elem.getAttribute('value') === null ? 'on' : elem.value;
        };
    }

    return {};
});

/**
 * DOM 4 shim / pollify for hAzzle
 *
 * This pollify covers:
 *
 * - append
 * - prepend
 * - before
 * - after
 * - replace
 * - remove
 * - matches
 * - customEvent
 */

/**
 * DOM 4 shim / pollify for hAzzle
 *
 * This pollify covers:
 *
 * - append
 * - prepend
 * - before
 * - after
 * - replace
 * - remove
 * - matches
 * - customEvent
 */
(function(window) {

    'use strict';

    var _Aproto = Array.prototype,
        _slice = _Aproto.slice,
        _indexOf = _Aproto.indexOf,

        ElementPrototype = (window.Element ||
            window.Node ||
            window.HTMLElement).prototype,

        properties = [
            'append',
            function append() {
                try {
                    this.appendChild(
                        applyToFragment(arguments)
                    );
                } catch (e) {}
            },
            'prepend',
            function prepend() {
                try {
                    if (this.firstChild) {
                        this.insertBefore(
                            applyToFragment(arguments), this.firstChild
                        );
                    } else {
                        this.appendChild(
                            applyToFragment(arguments)
                        );
                    }
                } catch (e) {}
            },
            'before',
            function before() {
                var parentElement = this.parentElement;
                if (parentElement) {
                    parentElement.insertBefore(
                        applyToFragment(arguments), this
                    );
                }
            },
            'after',
            function after() {
                if (this.parentElement) {
                    if (this.nextSibling) {
                        this.parentElement.insertBefore(
                            applyToFragment(arguments), this.nextSibling
                        );
                    } else {
                        this.parentElement.appendChild(
                            applyToFragment(arguments)
                        );
                    }
                }
            },
            'replace',
            function replace() {
                if (this.parentElement) {
                    this.parentElement.replaceChild(
                        applyToFragment(arguments), this
                    );
                }
            },
            'remove',
            function remove() {
                if (this.parentElement) {
                    this.parentElement.removeChild(this);
                }
            },
            'matches', (
                ElementPrototype.matchesSelector ||
                ElementPrototype.webkitMatchesSelector ||
                ElementPrototype.mozMatchesSelector ||
                ElementPrototype.msMatchesSelector ||
                function matches(selector) {
                    var parentElement = this.parentElement;
                    return !!parentElement && -1 < _indexOf.call(
                        parentElement.querySelectorAll(selector),
                        this
                    );
                }
            )
        ],
        // slice = properties.slice,
        i = properties.length;

    // Loop through
    for (; i; i -= 2) {
        if (!ElementPrototype[properties[i - 2]]) {
            ElementPrototype[properties[i - 2]] = properties[i - 1];
        }
    }

    // Create TextNode if string, else
    // return the node untouched

    function stringNode(node) {
        return typeof node === 'string' ?
            window.document.createTextNode(node) : node;
    }

    // Apply the node to the fragment

    function applyToFragment(nodes) {

        var fragment = window.document.createDocumentFragment(),
            container = _slice.call(nodes, 0),
            i = 0,
            l = nodes.length;

        if (nodes.length === 1) {
            return stringNode(nodes[0]);
        }

        for (; i < l; i++) {

            try {
                fragment.appendChild(stringNode(container[i]));
            } catch (e) {}
        }

        return fragment;
    }

    // CUSTOM EVENT
    // -------------

    try { // Native, working customEvent()
        new window.CustomEvent('?');
    } catch (e) {
        window.CustomEvent = function(
            eventName,
            defaultInitDict
        ) {
            function CustomEvent(type, eventInitDict) {

                var event = document.createEvent(eventName);

                if (typeof type !== 'string') {
                    throw new Error('An event name must be provided');
                }

                if (eventName === 'Event') {
                    event.initCustomEvent = initCustomEvent;
                }
                if (eventInitDict == null) {
                    eventInitDict = defaultInitDict;
                }
                event.initCustomEvent(
                    type,
                    eventInitDict.bubbles,
                    eventInitDict.cancelable,
                    eventInitDict.detail
                );
                return event;
            }

            // Attached at runtime
            function initCustomEvent(
                type, bubbles, cancelable, detail
            ) {
                this.initEvent(type, bubbles, cancelable);
                this.detail = detail;
            }

            return CustomEvent;
        }(

            // In IE9 and IE10 CustomEvent() are not usable as a constructor, so let us fix that
            // https://developer.mozilla.org/en/docs/Web/API/CustomEvent

            window.CustomEvent ?
            // Use the CustomEvent interface in such case
            'CustomEvent' : 'Event',
            // Otherwise the common compatible one
            {
                bubbles: false,
                cancelable: false,
                detail: null
            }
        );
    }

    // ECMA 7 - contains

    if (![].contains) {
        Object.defineProperty(Array.prototype, 'contains', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function(target /*, fromIndex*/ ) {
                if (this === undefined || this === null) {
                    throw new TypeError('Cannot convert this value to object');
                }

                var O = Object(this),
                    len = parseInt(O.length) || 0;

                if (len < 1) {
                    return false;
                }
                var from = Math.floor(arguments[1] || 0);
                // In ECMA 6 max length is 2^53-1, currently limited to 2^32-1
                if (from >= len || from > 0xFFFFFFFF) {
                    return false;
                }

                if (from < 0) {
                    from = len + from;
                }
                if (from === -Infinity || from < 0) {
                    from = 0;
                }

                var check;

                if (from >= 0) {
                    check = from;
                } else {
                    check = len + Math.abs(from);
                    if (check < 0) {
                        check = 0;
                    }
                }
                while (check < len) {
                    var currentElement = O[check];
                    if (target === currentElement ||
                        target !== target && currentElement !== currentElement
                    ) {
                        return true;
                    }
                    check += 1;
                }
                return false;
            }
        });
    }

}(window));