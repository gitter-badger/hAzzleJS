// touch.js
hAzzle.define('touch', function() {

    var // Dependencies 
        features = hAzzle.require('has');

    //# FEATURE DETECTION

    features.add({

        // Touch support       

        'touch': 'ontouchstart' in document ||
            ('onpointerdown' in document && navigator.maxTouchPoints > 0) ||
            window.navigator.msMaxTouchPoints,

        // Touch events 

        'touchEvents': 'ontouchstart' in document,

        // Pointer Events

        'pointerEvents': 'onpointerdown' in document,

        // Microsoft Pointer devices

        'MSPointer': 'msMaxTouchPoints' in navigator, //IE10+

        'touch': 'ontouchstart' in document ||
            ('onpointerdown' in document && navigator.maxTouchPoints > 0) ||
            window.navigator.msMaxTouchPoints,

        // Touch events 

        'touchEvents': 'ontouchstart' in document,

        // Pointer Events

        'pointerEvents': 'onpointerdown' in document,

        'MSPointer': 'msMaxTouchPoints' in navigator //IE10+
    });

    return {};
});