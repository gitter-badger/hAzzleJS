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