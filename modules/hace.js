/**
 * hAzzle Animation Core engine ( hACE )
 */
var win = this,
    thousand = 1000,
    perf = win.performance || {},
    top,
    requestFrame,
    cancelFrame,

	// Use the best resolution timer that is currently available

    perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow || perf.oNow),
    now = perfNow ? function () {
        return perfNow.call(perf);
    } : function () {
		var nowOffset;
		if(performance.timing && performance.timing.navigationStart) {
		   nowOffset = performance.timing.navigationStart;
		}
		return hAzzle.now - nowOffset;
    };

   // Test if we are within a foreign domain. Use raf from the top if possible.
    
	try {
		
    // Accessing .name will throw SecurityError within a foreign domain.
	
     win.top.name;
     top = win.top;
    } catch (e) {
     top = win;
    }

  requestFrame = top.requestAnimationFrame;
  cancelFrame = top.cancelAnimationFrame || top.cancelRequestAnimationFrame;

 if (!requestFrame) {
    requestFrame = win.requestAnimationFrame ||
        win.webkitRequestAnimationFrame ||
        win.oRequestAnimationFrame ||
        win.msRequestAnimationFrame ||
        win.mozRequestAnimationFrame;

    cancelFrame = win.cancelAnimationFrame ||
        win.cancelRequestAnimationFrame ||
        win.webkitCancelAnimationFrame ||
        win.webkitCancelRequestAnimationFrame ||
        win.mozCancelAnimationFrame ||
        win.oCancelAnimationFrame ||
        win.mozCancelRequestAnimationFrame;
}


if (!requestFrame || !cancelFrame) {
    var last = 0,
        id = 0,
        queue = [],
        frameDuration = thousand / 60;

    requestFrame = function (callback) {
        if (queue.length === 0) {
            var _now = now(),
                next = Math.max(0, frameDuration - (_now - last));
				
                last = next + _now;

            win.setTimeout(function () {
                var cp = queue.slice(0),
                    i = 0,
                    len = cp.length;

                // Clear queue here to prevent
                // callbacks from appending listeners
                // to the current frame's queue
                
				queue.length = 0;
				
                for (; i < len; i++) {
                    if (!cp[i].cancelled) {
                        try {
                            cp[i].callback(last);
                        } catch (e) {}
                    }
                }
            }, next);
        }
        queue.push({
            handle: ++id,
            callback: callback,
            cancelled: false
        });
        return id;
    };

    cancelFrame = function (handle) {
        var i = 0,
            len = queue.length;
        for (; i < len; i++) {
            if (queue[i].handle === handle) {
                queue[i].cancelled = true;
//				clearTimeout(queue[i]); // Need to be tested first !!
            }
        }
    };
}

// Extend the hAzzle Object

hAzzle.extend({

    fps: 60, // fps. This can be changed publicly. 

    // String based duration aka jQuery style. This can be changed publicly.

    speed: {
        slow: 8500,
        fast: 400,
        quick: 180,
        // Default speed
        _default: 1500

    },

    // Our ticker

    tick: function () {
        var hp = hAzzle.pipe,
            n;
        hp.raf = requestFrame.call(win, hAzzle.tick);
        hp.now = now();
        hp.delta = hp.now - hp.then;
        if (hp.delta > hp.interval) {
            for (n in hp.hACEPipe) {
                if (hp.hACEPipe.hasOwnProperty(n)) {
                    hp.hACEPipe[n](hp.delta);
                }
            }
            hp.then = hp.now - (hp.delta % hp.interval);
        }

        // Set to undefined to avoid leaks

        hp.now = undefined;
    },

    hACE: function (controller) {

        var self = this;

        /*
         * Unique ID on each animation
         *
         * This 'id' will be created everytime
         * we create an new 'hACE' instance.
         *
         * Meaning every animations in
         * the chain who are using the
         * current instance, have the same
         * unique 'id'
         */

        self.name = hAzzle.getUID(self);

        // Normalize some internal values

        self.controller = controller || new hAzzle.hACEController();
        self.startVal = 0;

        self.endVal = 0;
        self.differences = {};
        self.canStart = true;
        self.hasStarted = false;
        self.hasCompleted = false;
        self.hACEDuration = hAzzle.speed._default;
        self.delayDuration = 0;

        /**
         * @property delayed
         * @type {Boolean}
         * @default false
         */

        self.delayed = false;

        /**
         * @property paused
         * @type {Boolean}
         * @default false
         */

        self.paused = false;

        /**
         * @property repeatCount
         * @type {Number}
         * @default false
         */

        self.repeatCount = 0;

        self.easing = hAzzle.easing.linear; // Default easing function
        self.onStep = function () {};
        self.onComplete = function () {};
        self.onStopped = function () {};
        self.onEnd = function () {};
        self.andThen = function () {};
    },

    /**
     * All animations are saved in the 'pipe'.
     * and executed one after one.
     *
     * When we pause or resume, we are in
     * reality removing / adding the
     * from / to the 'pipe'
     *
     */

    hACEPipe: function () {
        var self = this;
        self.hACEPipe = {};
        self.then = now();
        self.now = 'undefined';

        // 'raf' are the returned value from the animation frame

        self.raf = 'undefined';

        // 'delta' are only used inside hAzzle.tick()

        self.delta = 'undefined';

        // The framerate at which hAzzle updates.

        self.interval = thousand / hAzzle.fps;

        self.running = self.hasNative = false;
    },

    hACEController: function () {

        this.q = []; // Our 'queue' where we keep all queued animations
    }

}, hAzzle);


/**
 * Prototype for hACEPipe
 */

hAzzle.hACEPipe.prototype = {

    /**
     * Add animation to the 'pipe'
     *
     * @param{String} name
     * @param{Function} fn
     * @return{hAzzle}
     *
     */

    add: function (name, fn) {
        if (typeof name === "string" && typeof fn === "function") {
            this.hACEPipe[name] = fn;
        }
    },

    /**
     * Remove animation from the 'pipe'
     *
     * @param{String} name
     * @return{hAzzle}
     *
     */

    remove: function (name) {
        if (typeof name === "string") {
            delete this.hACEPipe[name];
        }
    },

    /**
     * Starts the animation engine
     *
     * @param{Nummber} fps
     * @return{hAzzle}
     *
     * Note!
     *
     * 'fps' is an number to to be used as the
     * approximated FPS for the defined functions to run at.
     *
     */

    start: function (fps) {

        /**
         * Only start the animation, if the
         * animation are not running
         */

        if (!this.running) {
            hAzzle.fps = fps || hAzzle.fps;
            this.interval = 1000 / hAzzle.fps;

            // Start the animation

            hAzzle.tick();
        }
    },
	
    stop: function() {
     var self = this;
	 if (self.running) {
          self.running = false;
        cancelFrame.call(win, self.raf);
      }
    },

    /**
     * Check if the 'pipe' contains an animation
     *
     * @param {String} name
     * @return {hAzzle}
     *
     */

    has: function (name) {
        return typeof name === "string" ? name in this.hACEPipe : "";
    },

    /**
     * Pause the specified animation
     * This method cancels the requestAnimationFrame callback.
     * @return {hAzzle}
     *
     */

    pause: function () {
        var self = this;
        if (self.running) {
            cancelFrame.call(win, self.raf);
            self.running = false;
        }
        return this;
    },

    /**
     * Takes a number to be used as an approximated FPS for the defined functions to run at.
     *
     * @param {Number} fps
     * @return {hAzzle}
     *
     */

    setFPS: function (fps) {
        this.interval = thousand / fps || hAzzle.fps;
    }
};


/**
 * hAzzle.pipe has to be created and
 * started automaticly else the
 * hACE will not run
 */

hAzzle.pipe = new hAzzle.hACEPipe();
hAzzle.pipe.start();


/**
 * Prototype for our hACEController
 */

hAzzle.hACEController.prototype = {

    queue: function () {

        var self = this,
            _hACE = new hAzzle.hACE(self),
            _queue = self.q[self.q.length];


        if (!_queue || _queue && _queue.hasCompleted) {

            _hACE.canStart = true;

        } else {

            _hACE.canStart = false;
            _queue.then(function () {
                _hACE.canStart = true;
                _hACE.start();
            });
        }

        // Push the animation to the queue
        self.q.push(_hACE);

        return _hACE;
    },

    /**


     * Mehran!!
     *
     * Experimental attempt.
     *
     * Here is what I think of how to
     * grab things from queue by name
     * or number
     *
     *   NOT WORKING OR IN USE!!!!
     *
     */

    queueIterate: function (name) {

        var self = this,
            _hACE = new hAzzle.hACE(self),
            _queue;

        if (typeof name === 'string') {

            _queue = self.q[name];

        } else if (typeof name === 'number') {

            _queue = self.q[name];
        }

        if (_queue) {

            _queue.shift();

            if (_queue.length) {

            } else {

            }

        }
        return this;
    },

    queueShift: function (name) {
        return this.q[typeof name === 'string' || typeof name === 'number' ? name : ''].shift();
    },

    queueUnShift: function (name) {
        return this.q[typeof name === 'string' || typeof name === 'number' ? name : ''].unshift();
    },

    // Empty the animation queue

    queueEmpty: function (name) {

        // If number, delete from queue by name

        if (typeof name === 'string') {

            delete this.q[name];

            // If number, delete from queue by number
        } else if (typeof name === 'number') {

            delete this.q[name];

            // If no name, empty the queue		

        } else {
            this.q = [];
        }
        return this;
    },

    // Return the length of the queue
    queueLength: function () {

        return this.q.length;
    }

};

/**
 * Prototype for hACE
 */

hAzzle.hACE.prototype = {

    /**
     * Start position
     *
     * @param {Number/Object} properties
     * @return {hAzzle}
     *
     * 'val' could be an object. Example
     * if we are dealing with 'X' and 'Y' coordinates.
     *
     * from( {x:20, y: 20  })
     *
     */

    from: function (properties) {

        if (typeof properties === 'number') {

            this.startVal = properties || 0;

        } else if (typeof properties === 'object') {

            this.startVal = properties || {};

        }
        return this;
    },

    /**
     * End position
     *
     * @param {Number/Object} properties
     * @return {hAzzle}
     *
     * 'val' could be an object. Example
     * if we are dealing with 'X' and 'Y' coordinates.
     *
     * from( {x:30, y: 30  })
     *
     * In the step() function, we then grab the returned
     * value like this:


     *
     * - val.x
     * - val.y
     */


    to: function (properties) {

        if (typeof properties === 'object') {

            this.endVal = properties || {};

            // This can be everything from number to string
            // We are dealing with it later on if it's
            // an relative number

        } else {

            this.endVal = properties;

        }
        return this;
    },

    /**
     * Set duration
     *
     * @param {Number} ms
     * @return {hAzzle}
     */

    duration: function (ms) {

        /**
         * To make this familiar with jQuery, hAzzle are
         * supporting:
         *
         * - slow
         * - fast
         * - quick
         *
         * and
         *
         * _default as an fallback
         *
         */

        if (typeof ms === "string") {

            this.hACEDuration = hAzzle.speed[ms] || hAzzle.speed._default;

        } else if (typeof ms === "number") {

            this.hACEDuration = ms || hAzzle.speed._default;
        }

        return this;
    },

    /**
     * Set an delay in ms before execution
     *
     * @param {Number} amount
     * @return {hAzzle}
     */

    delay: function (amount) {
        this.delayDuration = typeof amount === "number" ? amount : 1;
        return this;
    },

    /**
     * Repetation of the animation x times
     *
     * @param {Number} times
     * @param {Boolean} end
     * @return {hAzzle}
     */

    repeat: function (times) {
        this.repeatCount = typeof times === "number" ? times : 0;
        return this;
    },

    /**

     * Easing
     *
     * @param {String / Function} callback 
     * @return {hAzzle}
     */

    ease: function (callback) {

        var self = this;

        if (typeof callback === 'string') {

            self.easing = hAzzle.easing[callback] || hAzzle.easing.linear;

            // else, it's an Function

        } else if (typeof callback === 'function') {
            self.easing = callback || hAzzle.easing.linear;
        }
        return self;
    },

    /**
     * Animation steping
     *
     * @param {Function} callback
     * @return {hAzzle}
     */

    step: function (callback) {
        this.onStep = callback || function () {};
        return this;
    },

    /**
     * Function to be executed when animation are completed
     *
     * @param {Function} callback
     * @return {hAzzle}
     */

    complete: function (callback) {
        this.onComplete = callback || function () {};
        return this;
    },

    /**
     * Function to be executed when the animation have stopped.
     *
     * This function will only run as an callback after
     * the stop() have been executed.
     *
     * @param {Function} callback
     * @return {hAzzle}
     */

    stopped: function (callback) {
        this.onStopped = callback || function () {};
        return this;
    },

    /**
     * Then
     *
     * @param {Function} callback
     * @return {hAzzle}
     *
     * 'then' are an 'promise' like
     * function and will be executed
     * after the complete() function.
     *
     * Example:
     *
     *  new hAzzle.hACE()
     *     .from()
     *     .to()
     * .step(function(val) {})
     * .complete(function() {
     *
     * alert( 'completed the animnation!' )
     * })
     * .then(function() {
     *
     * // Going in reverse
     *
     * this.reverse();
     * })
     * .start()
     *
     */

    then: function (callback) {
        this.andThen = callback || function () {};
        return this;
    },

    /**
     * Reverse the animation
     *
     * @return {hAzzle}
     */
    reverse: function () {
        var self = this,
            sV = self.startVal,
            eV = self.endVal;
        self.startVal = eV;
        self.endVal = sV;
        self.start();
    },


    /**
     * Start the animation
     *
     * @return {hAzzle}
     */

    start: function () {

        var self = this;


        if (!self.canStart) {

            return self;
        }

        /* Set timeOut for delay
         *
         *	Mehran!
         *
         * Fix me! Make sure we are deleating this
         * timeOut later on so we avoid memory leaks */

        if (self.delayDuration > 0 && !self.delayed) {
            setTimeout(function () {
                self.start();
            }, self.delayDuration);
            self.delayed = true;
            return self;
        }

        var val,
            start,
            end,
            stepDuration = thousand / hAzzle.fps,
            steps = self.hACEDuration / stepDuration || 0;

        if (typeof self.endVal === 'object') {

            // Force the 'startVal' to be an object
            // if 'endVal' already are an object

            if (typeof self.startVal !== 'object') {

                self.startVal = {};
            }

            for (val in self.endVal) {

                start = self.startVal[val];
                end = self.endVal[val];

                // Parses relative end values with start as base (e.g.: +10, -3)

                if (typeof end === "string") {

                    end = start + parseFloat(end, 10);
                }

                // Protect against non numeric properties.

                if (typeof end === "number") {

                    self.differences[val] = end - start;
                }
            }

        } else {

            start = self.startVal;
            end = self.endVal;

            // Parses relative end values with start as base (e.g.: +10, -3)

            if (typeof end === "string") {

                end = start + parseFloat(end, 10);
            }

            // Protect against non numeric properties.

            if (typeof end === "number") {

                self.differences.mehran = end - start;
            }
        }

        self.hasStarted = true;

        // Animation have stopped. Deal with it !!

        self.stopIt = function () {

            // If the animation have started...

            if (steps >= 0 && self.hasStarted) {

                var v,
                    percent = self.hACEDuration - (steps * stepDuration),
                    ease,
                    tick;

                steps--;

                // Calculat the easing

                ease = self.easing.call(hAzzle.easing, percent / self.hACEDuration);

                if (self.differences.hasOwnProperty('mehran')) {

                    tick = self.startVal + (self.differences.mehran - self.startVal) * ease;

                } else {

                    tick = {};
                }

                /**
                 * The 'tick' can be an object if
                 * we - as one example - are dealing with
                 * x and y coordinates.
                 *
                 * The tick will then look like:
                 *
                 * { x: value,  y: value }
                 *
                 */

                if (typeof tick === 'object') {

                    for (v in self.differences) {

                        tick[v] = self.startVal[v] + (self.differences[v] - self.startVal[v]) * ease;
                    }
                }

                /**
                 * Avoid a negative 'tick' (e.g.: -3,324, -1,77 ), and set 'tick' to '0'
                 */

                if (typeof tick !== 'object' && tick < 0) {

                    tick = 0;
                }

                // Call the 'step' function

                self.onStep.call(self, tick, self.endVal);

            } else if (!self.hasStarted) {

                /**
                 * If animation have not started yet, remove it from the 'pipe'
                 *
                 * This will be executed when we stop the animation using the
                 * stop() function
                 *
                 * Part of this has to be extended. See the stop() function
                 * comment for further info
                 *
                 */

                hAzzle.pipe.remove(self.name);

                self.onStopped.call(self);

            } else { // The animation have finished, and stopped itself

                // Remove from the 'pipe'

                hAzzle.pipe.remove(self.name);

                // Set hasStarted to false

                self.hasStarted = false;

                // Set delayed to false

                self.delayed = false;

                /**
                 * Related to the repeat() function.
                 *
                 * If .repeat(count) are used, the animation will be
                 * repeated x times, and when finish it execute
                 * the OnComplete() function.
                 *
                 */

                if (self.repeatCount > 0 || self.repeatCount === -1) {
                    self.repeatCount = self.repeatCount < 0 || self.repeatCount === Infinity ? self.repeatCount : self.repeatCount--;

                    // Start all over again

                    self.start();

                } else {

                    self.hasCompleted = true;

                    if (self.onComplete !== null) {

                        self.onComplete.call(self);

                    }

                    if (self.andThen !== null) {

                        self.andThen.call(self);

                    }

                    /**
                     * Mehran!
                     *
                     * onEnd() function that will be executed
                     * after all animations in the queue are
                     * finished.
                     *
                     * Just make sure this really happend, and
                     * there is no problems.
                     *
                     */

                    if (self.controller.q.length === 0) {

                        // Call the onEnd function so we can clean up our mess

                        self.onEnd.call(self);
                    }

                    self.controller.q.shift();
                }
            }
        };

        // Add the animation and the stop function to the 'pipe'

        hAzzle.pipe.add(self.name, self.stopIt);

        return self;
    },


    /**
     * Stop the animation
     *
     * @return {hAzzle}
     *
     * Mehran!!
     *
     * See the hACE issues email I sent
     * you earlier.
     *
     * The stop function only stop the
     * last running animation.
     * It should be fixed so it stop
     * all running animations.
     *
     *
     * BIG NOTE!!!
     *
     * I'm starting to see an solution on this problem!!
     *
     * Get the 'raf' value from the 'pipe' first. This value
     * contains the ID on the running animation.
     *
     * See the technical info I sent you in email.
     *
     * You then use that 'raf' value to controll which
     * animation to stop, pause and resume.
     *
     *
     * AFTER THAT, it should be extended ...
     *
     * - Boolan value true / false. If true it should
     *   jump to the end of the tick
     *
     * - string param. This is related to the
     *   'queue system'. So before this, when we
     *   'queue' an animation, we should fix it so:
     *
     *    .queue()
     *
     *    become:
     *
     *    .queue( name )
     *
     *  so every animation in the queue got an unique name the
     *  user of hAzzle Core are choosing.
     *
     *  In this case and with the string param we can stop
     *  running animations by name, and not all animations.
     *
     *  Say we have 500 animations, and we should stop
     *  animation number 245 that has the name 'jiesa'.
     *  We just paste in the name 'jiesa' and only that
     *  animation are stopped.
     *
     * - number param. Same as 'string param', but with the
     *   difference that we paste in an number and not an name.
     *   If we have 500 animations, we paste inn number
     *   245 and not the name 'jiesa' to stop it.
     */

    stop: function (gotoEnd) {
		self.hasStarted = false;
        return self;
    },

    /**
     * Stop and remove all existing animations.
     */

    stopAll: function () {

        // Loop through the queue
        // Stop all animations
        // Remove all animations from the pipe
        // Cancel the frame

    },

    /**
     * Mehran!
     *
     * For the forward() and rewind() function. Make sure
     * the speed increase / decrease happend on current
     * step, and not start the animation over again from
     * start.
     */

    /**
     * Increase the animation speed
     *
     * @param {Number} count
     * @return {hAzzle}
     */

    forward: function (count) {
        if (typeof count === "number") {
            this.hACEDuration = this.hACEDuration / count || hAzzle.speed._default;
        }
    },

    /**
     * Decrease the animation speed
     *
     * @param {Number} count
     * @return {hAzzle}
     */

    rewind: function (count) {
        if (typeof count === "number") {
            this.hACEDuration = this.hACEDuration * count || hAzzle.speed._default;
        }
    },

    /**
     * Pause the animation
     *
     * @return {hAzzle}
     *
     *  FIX ME!!
     *
     * The animation that got paused now are the last one
     * added. Need to be fixed.
     *
     * This also has to be extended the same way as the stop()
     * function, but here we pause the animation not stopping it.
     *
     */

    pause: function () {
        var self = this;

        // Remove the animation from the pipe if animation are running

        if (self.hasStarted) {
            hAzzle.pipe.remove(self.name);
        }
        return self;

    },

    /**
     * Resume the animation
     *
     * @return {hAzzle}
     *
     *  FIX ME!!
     *
     * The animation that we resume after we paused it, are the last one
     * added. Need to be fixed.
     *
     * This also has to be extended the same way as the stop()
     * function, but here we pause the animation not stopping it.
     *
     */

    resume: function () {

        var self = this;
        if (self.hasStarted) {

            // Do nothing if the animation are in the pipe

            if (hAzzle.pipe.has(self.name)) {
                return;
            }

            // Add the animation back into the pipe

            hAzzle.pipe.add(self.name, self.stopIt);

            return self;
        }
    },

    /**
     * Returns whether or not a animation is running.
     * @return {boolean}
     */

    isPlaying: function () {
        return self.hasStarted;
    },

    /**
     * Queue the animation
     *
     * @return {hAzzle}
     */

    queue: function () {
        return this.controller.queue();
    },

    /**
     * Function to be executed after all
     * animations have been ended
     *
     * @param {Function} callback
     * @return {hAzzle}
     */

    end: function (callback) {
        if (typeof callback === "function") {
            this.onEnd = callback;
        }
        return this;
    }
};