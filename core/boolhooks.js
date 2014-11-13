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