// selector.js
// hAzzle main selector engine
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('selector', function() {

    var doc = window.document,
        _core = hAzzle.require('Core'),
        _types = hAzzle.require('Types');

    // Feature / bug detection

    // NOTE: Windows 8 Native Apps
    // The type attribute is restricted during .innerHTML assignment
    var div = doc.createElement('div'),
        node = doc.createElement('a');
    node.setAttribute('href', '#');
    div.appendChild(node).setAttribute('class', 'abc e');
    node = doc.createElement('input');
    div.appendChild(node).setAttribute('class', 'abc');

    try {
        div.className = 'i';
    } catch (e) {}

    _core.addFeature('attributes', !div.getAttribute('className'));

    // IE will return comment node append by javascript
    div.appendChild(doc.createComment(''));

    _core.addFeature('byTagWithComment', div.getElementsByTagName('*').length > 2);

    // Check if getElementById returns elements by name. IE < 10
    doc.documentElement.appendChild(div).setAttribute('id', _core.expando);
    _core.addFeature('byId', !doc.getElementsByName || !doc.getElementsByName(_core.expando).length);
    doc.documentElement.removeChild(div);


     //A temporary solution just to test it as a module!
    var find = function(sel, ctx) {
        if (!ctx) {
            ctx = document;
        }
        if (_types.isType('Function')(ctx.querySelectorAll)) {
            return ctx.querySelectorAll(sel);
        } else {
            console.log('selector probably needs jiesa for this type of context!');
        }
    },
    matches = function() {}

    return {
        find: find,
        matches:matches
    };

});