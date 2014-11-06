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
            var div = document.createElement('div');
            // Should return 1, but returns 4 (following)
            return div.compareDocumentPosition(document.createElement('div')) & 1;
            div = null;
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

            return (envsCache[docset] = environment);
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
        setDocument:setDocument,
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