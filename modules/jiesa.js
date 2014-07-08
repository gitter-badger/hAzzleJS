/**
 * Jiesa selector engine
 *
 * Contains:
 *
 * - Jiesa selector engine
 *
 * - Various bug checks
 */
var win = this,
    Jiesa = hAzzle.Jiesa,
    doc = win.document,

    useNative = false,

    expando = "hAzzle" + -(new Date()),

    push = Array.prototype.push,

    rsibling = /[+~]/,

    rescape = /'|\\/g,

    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    rtrim = new RegExp("^" + Jiesa.whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Jiesa.whitespace + "+$", "g");

// Set up Jiesa

hAzzle.extend({

    version: '0.0.1',

    has: {}

}, Jiesa);

// Feature / Bug detection
// NOTE!! Need to add better check for this. See Sizzle

(function () {

    if (!(Jiesa.has['api-QSA'] = doc.querySelectorAll !== undefined)) {
        return;
    }
    var e = doc.createElement('div');

    e.innerHTML = "<p class='QsA'>Jiesa</p>";

    Jiesa.has['bug-QSA'] = (e.querySelectorAll(".QsA").length === 0);

    e = null;
})();

/**
 * Check if getElementsByTagName returns only elements
 */

Jiesa.has["bug-GEBTN"] = assert(function (div) {
    div.appendChild(doc.createComment(''));
    return div.getElementsByTagName('*').length > 0;
});

/**
 * Check for getElementById bug
 * Support: IE<10
 */
Jiesa.has["bug-GEBI"] = assert(function (div) {
    hAzzle.docElem.appendChild(div).id = expando;
    return doc.getElementsByName > 0 || doc.getElementsByName(expando).length;
});

/**
 * Support testing using an element
 * @param {Function} fn
 */

function assert(fn) {
    var div = doc.createElement("div");

    try {
        return !!fn(div);
    } catch (e) {
        return false;
    } finally {
        // Remove from its parent by default
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
        // release memory in IE
        div = null;
    }
}


// Extend Jiesa

hAzzle.extend({

	/**
	 * Jiesa selector engine
	 *
	 * @param {String} selector
	 * @param {String/Object/Array}	context
	 * @param {Array} results	 
	 * @param {Boolean} single
	 *
	 * 'single' are used if we want to use
	 * querySelector and not qierySelectorAll
	 */

    find: function (selector, context, results, /* INTERNAL */ single) {

        var match, elem, m, nodeType;

        // Set correct document

        if ((context ? context.ownerDocument || context : doc) !== document) {
            // Overwrite if needed
            doc = hAzzle.setDocument(context);
        }

        context = context || doc;
        results = results || [];

        if (!selector || typeof selector !== "string") {

            return results;
        }

        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
            return [];
        }

        if (!hAzzle.documentIsHTML) {

            // Shortcuts
            if ((match = rquickExpr.exec(selector))) {
                if ((m = match[1])) {
                    if (nodeType === 9) {
                        elem = context.getElementById(m);
                        if (elem && elem.parentNode) {
                            if (elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        } else {
                            return results;
                        }
                    } else {

                        if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                            hAzzle.contains(context, elem) && elem.id === m) {
                            results.push(elem);
                            return results;
                        }
                    }

                } else if (match[2]) {
                    push.apply(results, context.getElementsByTagName(selector));
                    return results;
                } else if ((m = match[3]) && context.getElementsByClassName) {
                    push.apply(results, context.getElementsByClassName(m));
                    return results;
                }
            }
        }

        // If querySelectorAll are activated, and not buggy,
        //	existing, and not XML doc,
        // we can use QSA. If not, we fallback
        // to our internal selector engine

        if (Jiesa.useNative && Jiesa.has['api-QSA'] &&
            !Jiesa.has['bug-QSA']) {

            var old = true,
                nid = expando;

            if (context !== doc) {

                if ((old = context.getAttribute('id'))) {

                    nid = old.replace(rescape, '\\$&');

                } else {

                    context.setAttribute('id', nid);
                }

                nid = "[id='" + nid + "'] ";

                context = rsibling.test(selector) ? context.parentNode : context;
                selector = nid + selector.split(',').join(',' + nid);
            }

            try {

                push.apply(results, context[single ? 'querySelector' : 'querySelectorAll'](selector));
                return results;

            } catch (qsaError) {} finally {
                if (!old) {
                    context.removeAttribute("id");
                }
            }
        }

        // Run the parser

        return hAzzle.merge(results, Jiesa.parse(selector.replace(rtrim, "$1"), context));
    },

}, Jiesa);

// Boolean true / false
// If 'true', QSA got activated

Jiesa.useNative = false;

// Attach the selector engine to the globale
// hAzzle object
hAzzle.find = Jiesa.find;