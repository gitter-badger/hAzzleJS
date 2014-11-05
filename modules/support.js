// support.js
// NOTE! This module are here just to be a 'litle' compatible with jQuery for developers 
// that are used to support() from jQuery. We only use this a few places. 
// For 'feature detection', use has.js (included in the Core).
hAzzle.define('Support', function() {

    // Feature detection of elements

    var support = {},

        assert = function(fn) {

            var el = document.createElement('fieldset');

            try {
                return !!fn(el);
            } catch (e) {
                return false;
            } finally {

                // Remove from its parent by default
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
                // release memory in IE
                el = null;
            }
        },

        input = document.createElement('input');

    input.type = 'checkbox';

    // Support: IE<=11+
    // An input loses its value after becoming a radio
    input = document.createElement('input');
    input.value = 't';
    input.type = 'radio';
    support.radioValue = input.value === 't';

    assert(function(div) {
        support.supportBorderRadius = div.style.borderRadius != null;
    });

    return {
        assert: assert,
        support: support,
        radioValue: support.radioValue,
        noCloneChecked: support.noCloneChecked,
        borderRadius: support.supportBorderRadius
    };
});