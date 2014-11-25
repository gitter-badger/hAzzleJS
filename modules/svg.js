// svg.js
hAzzle.define('svg', function() {

    var // Dependencies
        features = hAzzle.require('types'),

        // Default SVG namespaces
        ns = 'http://www.w3.org/2000/svg',
        xmlns = 'http://www.w3.org/2000/xmlns/',
        xlink = 'http://www.w3.org/1999/xlink';

    //# FEATURE DETECTION

    // SVG support test

    features.add('SVG', !!document.createElementNS &&
        !!document.createElementNS(ns, 'svg').createSVGRect
    );

    // Method for element creation
    var create = function(name) {
            // create element
            return document.createElementNS(ns, name);
        },

        // Get id from reference string
        idFromReference = function(url) {
            var m = url.toString().match(/#([a-z0-9\-_]+)/i);

            if (m) {
                return m[1];
            }
        },

        getID = function(id) {
            var node = document.getElementById(idFromReference(id) || id);
            if (node) {
                return node.instance;
            }
        }

    return {
        ns: ns,
        xmlns: xmlns,
        xlink: xlink,
        support: features.has('SVG'),
        create: create,
        get: getID
    };
});