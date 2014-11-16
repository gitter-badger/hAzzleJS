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
        })();

    // Setter
    util.mixin(setters.valHooks.set, {

        'select': function(elem, value) {
            var optionSet, option,
                options = elem.options,
                values = collection.makeArray(value),
                i = options.length;

            while (i--) {
                option = options[i];
              
              // ECMA 7 - contains

                if ((option.selected = values.contains(option.value))) {
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
            return val !== null ? val : strings.trim(text.getText(elem));
        },

        'select': function(elem) {

            var index = elem.selectedIndex,

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
               // ECMA 7 - contains
                return (elem.checked = value.contains( hAzzle(elem).val() ));
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