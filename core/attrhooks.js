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