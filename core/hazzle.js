/*!
 * hAzzle Javascript Library
 * Copyright (c) 2014 Kenny Flashlight
 *
 * Version: 1.0.4a
 * Released under the MIT License.
 *
 * Date: 2014-11-28
 */
(function() {

    var

    //  Create a new hAzzle Object

        hAzzle = function(selector, context) {

            // hAzzle(), hAzzle(''), hAzzle(null), hAzzle(undefined), hAzzle(false)
            if (!selector) {
                return this;
            }

            // Allow instantiation without the 'new' keyword

            if (!(this instanceof hAzzle)) {
                return new hAzzle(selector, context);
            }

            if (selector instanceof hAzzle) {
                return selector;
            }

            // Handle HTML strings if the manipulation.js module are loaded

            if (typeof selector === 'string') {

                if (installed.manipulation &&
                    selector[0] === '<' &&
                    selector[selector.length - 1] === '>' &&
                    selector.length >= 3) {

                    // Require the manipualtion.js module, and create the HTML

                    this.elements = require('manipulation').create(
                        selector,
                        context && context.nodeType ? context.ownerDocument || context : document
                    );
                    // If no HTML creation, select DOM nodes with Jiesa
                } else {
                    this.elements = this.find(selector, context, true);
                }
                // Arrays
            } else if (Array.isArray(selector)) {
                var util = require('Util');
                this.elements = util.unique(util.filter(selector, validTypes));
                // nodeList
            } else if (require('types').isNodeList(selector)) {
                var util = require('Util');
                this.elements = util.filter(util.makeArray(selector), validTypes);
                // DOMElement
            } else if (selector.nodeType) {
                // If it's a html fragment, create nodes from it
                if (selector.nodeType === 11) {
                    this.elements = selector.children;
                } else {
                    this.elements = [selector];
                }
                this.length = 1;
                return this;
                // browser window     
            } else if (selector === window) {
                this.elements = [selector];
                // DOM ready
            } else if (typeof selector === 'function') {
                if (installed.ready) {
                    return require('ready').ready(selector);
                } else {
                    err(true, 6, 'ready.js module not installed');
                }

            } else {
                this.elements = [];
                this.length = 0;
                return this;
            }

            // Create a new hAzzle collection from the nodes found
            //
            // NOTE! hAzzle doesn't try to subclass Array in any way. A hAzzle instance is just a 
            // standard object, with the current elements selection stored in the .elements array. 
            if (this.elements) {
                this.length = this.elements.length;
            } else {
                this.elements = [];
                this.length = 0;

            }
            return this;
        },

        // Container for all modules

        modules = {},

        // Container for installed modules

        installed = hAzzle.installed = {},

        // Version

        version = hAzzle.version = '1.0.2d',

        // Throws an error if `condition` is `true`.

        err = hAzzle.err = function(condition, code, message) {
            if (condition) {
                throw new Error('[hAzzle-' + code + '] ' + message);
            }
        },

        // Require a module

        require = hAzzle.require = function(name) {
            if (name && typeof name === 'string') {
                return modules[name.toLowerCase()];
            }
        },

        // Define a module

        define = hAzzle.define = function(name, fn) {
            if (typeof name === 'string' && typeof fn === 'function' && !modules[name]) {
                installed[name.toLowerCase()] = true;
                modules[name.toLowerCase()] = fn.call(hAzzle.prototype);
            }
        },

        validTypes = function(elem) {
            return elem && (elem.nodeType === 1 || elem.nodeType === 9);
        },

        _hAzzle = window.hAzzle;

    // Restore the original hAzzle namespace  

    hAzzle.noConflict = function() {
        if (window.hAzzle === hAzzle) {
            window.hAzzle = _hAzzle;
        }

        return window;
    };

    // Expose hAzzle to the global namespace

    window.hAzzle = hAzzle;

}(window));