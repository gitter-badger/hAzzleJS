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
        } else if (nodeType === 1 ||
            nodeType === 9 ||
            nodeType === 11) {

            if (typeof elem.textContent === 'string') {
                return elem.textContent;
            }
            // Traverse its children
            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                ret += getText(elem);
            }

        } else if (nodeType === 3 ||
            nodeType === 4) { // Text or CDataSection
            return elem.nodeValue;
        }
        return ret;
    };

    return {
        getText: getText
    };
});