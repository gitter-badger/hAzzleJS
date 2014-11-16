// easings.js
// Dependencies: hAzzle Javascript library && fx.js
var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('easings', function() {

    var
    // Dependencies

        util = hAzzle.require('util'),
        fx = hAzzle.require('fx');

    util.mixin(fx.easings, {

        easeOutStrong: function(t) {
            return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
        },

        easeIn: function(t) {
            return t * t;
        },

        easeInStrong: function(t) {
            return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
        },

        easeOutBounce: function(pos) {
            if ((pos) < (1 / 2.75)) {
                return (7.5625 * pos * pos);
            } else if (pos < (2 / 2.75)) {
                return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
            } else if (pos < (2.5 / 2.75)) {
                return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
            } else {
                return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
            }
        },

        easeInBack: function(pos) {
            var s = 1.70158;
            return (pos) * pos * ((s + 1) * pos - s);
        },

        easeOutBack: function(pos) {
            var s = 1.70158;
            return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
        },

        bounce: function(t) {
            if (t < (1 / 2.75)) {
                return 7.5625 * t * t;
            }
            if (t < (2 / 2.75)) {
                return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
            }
            if (t < (2.5 / 2.75)) {
                return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
            }
            return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
        },
        bouncePast: function(pos) {
            if (pos < (1 / 2.75)) {
                return (7.5625 * pos * pos);
            } else if (pos < (2 / 2.75)) {
                return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
            } else if (pos < (2.5 / 2.75)) {
                return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
            } else {
                return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
            }
        },
        swingTo: function(pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
        },
        swingFrom: function(pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s);
        },
        elastic: function(pos) {
            return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
        },
        spring: function(pos) {
            return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
        },
        blink: function(pos, blinks) {
            return Math.round(pos * (blinks || 5)) % 2;
        },
        pulse: function(pos, pulses) {
            return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
        },
        wobble: function(pos) {
            return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
        },

        sinusoidal: function(pos) {
            return (-Math.cos(pos * Math.PI) / 2) + 0.5;
        }
    });


    return {};
});