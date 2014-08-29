// percentage.js
var percent = '%';

function Percentage(elem, to, options) {
    return new Percentage.prototype.init(elem, to, options);
}

hAzzle.Percentage = Percentage;

Percentage.prototype = {

    constructor: Percentage,

    init: function(elem, to, options) {

        length = dictionary.length;

        this.elem = elem;
        this.complete = options.callback;
        this.completeParams = options.callbackParams;
        this.originalState = [];

        var i = 0, ar = [],
            prop, begin, end,
            newbs = to.to,
            from = to.from,
            style = elem.style,
            self = hAzzle.private(elem, 'fxDta', dictionary[length++] = this),
            easing = options.ease || hAzzle.defaultEasing,

            // Support for jQuery's named durations.
            // Duration '0' will likely never happen, it will see it as false,
            // and set 'defaultDuration'

            duration = options.duration ?
            (hAzzle.speeds[options.duration] || options.duration) :
            defaultDuration;
        
		// Height/width overflow pass
		
        if (elem.nodeType === 1 && ('height' in to.to || 'width' in to.to)) {
            this.originalState.overflow = [style.overflow, style.overflowX, style.overflowY];
            display = hAzzle.css(elem, 'display');
            checkDisplay = display === 'none' ?
                hAzzle.getPrivate(elem, 'olddisplay') || defaultDisplay(elem.nodeName) : display;
            if (checkDisplay === 'inline' && hAzzle.css(elem, 'float') === 'none') {
                style.display = 'inline-block';
            }
        }

        if (this.originalState.overflow) {
            style.overflow = 'hidden';
        }

        for (prop in from) {

            end = parseInt(newbs[prop], 10);
            begin = parseInt(from[prop], 10);
            
			// Create the array
            
			ar[i++] = [end > begin, prop, end, begin];
        }

        // Make visible if hidden

        elem.style.visibility = 'visible';

        self.transitions = self.animate(elem, ar, duration, easing);

        // Start the animation

        if (!isRunning) {
			
            ticker();
        }
    },

    cycle: function() {
        return this.transitions();
    },

    // Animate percentages

    animate: function(elem, to, duration, ease) {

        var tick, timed = 0,
            then = pnow(),
            now, i, style = elem.style,
            len = to.length;

        return function(force) {

            now = pnow();
            timed += now - then;
            then = now;
            tick = hAzzle.easing[ease](timed / duration);
			
            i = len;

            if (tick < 0.99 && !force) {

                // Note! For now we are setting the styles directly - better performance.
                // I'm going to change this in the future

                while (i--) {

                     if (to[i][0]) {

                        style[to[i][1]] = (to[i][3] + ((to[i][2] - to[i][3]) * tick)) + percent;

                    } else {

                        style[to[i][1]] = (to[i][3] - ((to[i][3] - to[i][2]) * tick)) + percent;
                    }
                }

                return true;

            } else {

                while (i--) {

                    style[to[i][1]] = to[i][2] + percent;
                }

                return false;
            }

        };

    },

    // Stop a percentage animation

    stop: function(complete, callback, popped) {

        var self = this,
            state = self.originalState,
            elem = self.elem,
            transitions = self.transitions,
            style = elem.style;
        this.originalState = [];

        if (state != null) {

            style.overflow = state.overflow[0];
            style.overflowX = state.overflow[1];
            style.overflowY = state.overflow[2];
        }

        hAzzle.removePrivate(elem, 'fxDta');

        if (complete && transitions) {

            transitions(true);
        }

        if (callback) {
            callback = this.complete;
        }

        if (!popped) {
            popTween(this, elem, callback, this.completeParams);
        }

    }
};

Percentage.prototype.init.prototype = Percentage.prototype;