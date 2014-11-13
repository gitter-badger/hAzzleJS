// prophooks.js
hAzzle.define('prophooks', function () {

    var util = hAzzle.require('util'),
        setters = hAzzle.require('setters');

    util.mixin(setters.propHooks.get, {
        'tabIndex': function (elem) {
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
        setters.propHooks.get.selected = function (elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
            }
            return null;
        };
    }
      return {};
});