// features.js - Browser feature detection
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('features', function() {

    var win = window,
        doc = win.document,
        has = hAzzle.require('has');

    // XPath

    has.add('xpath', !!doc.evaluate);

    // Air 

    has.add('air', !!win.runtime);

    // Detects native support for the Dart programming language

    has.add('dart', !!(win.startDart || doc.startDart));

    // Detects native support for promises

    has.add('promise', !!win.Promise);

    // Touch support

    has.add('touch', "ontouchstart" in document ||
        ("onpointerdown" in document && navigator.maxTouchPoints > 0) ||
        window.navigator.msMaxTouchPoints);

    // Touch events 

    has.add('touchEvents', 'ontouchstart' in document);

    // Pointer Events

    has.add('pointerEvents', 'onpointerdown' in document);

    has.add('MSPointer', 'msMaxTouchPoints' in navigator); //IE10+

    // querySelectorAll
    has.add('qsa', !!document.querySelectorAll);

    return {};
});