// touch.js
hAzzle.define('touch', function() {

    var features = hAzzle.require('has');

    //# FEATURE DETECTION

    // Touch support

    add('touch', "ontouchstart" in document ||
        ("onpointerdown" in document && navigator.maxTouchPoints > 0) ||
        window.navigator.msMaxTouchPoints);

    // Touch events 

    add('touchEvents', 'ontouchstart' in document);

    // Pointer Events

    add('pointerEvents', 'onpointerdown' in document);

    // Microsoft Pointer devices

    add('MSPointer', 'msMaxTouchPoints' in navigator); //IE10+

    add('touch', "ontouchstart" in document ||
        ("onpointerdown" in document && navigator.maxTouchPoints > 0) ||
        window.navigator.msMaxTouchPoints);

    // Touch events 

    add('touchEvents', 'ontouchstart' in document);

    // Pointer Events

    add('pointerEvents', 'onpointerdown' in document);

    add('MSPointer', 'msMaxTouchPoints' in navigator); //IE10+

    return {};
});