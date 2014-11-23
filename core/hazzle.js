/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.2d
 * Released under the MIT License.
 *
 * Date: 2014-11-22
 */
 
(function() {

    var

    // Container for all modules

        modules = {},

        // Container for installed modules

        installed = {},

        // Version

        version = '1.0.2d',

        // Codename

        codename = 'new-age',

        // Throws an error if `condition` is `true`.

        err = function(condition, code, message) {
            if (condition) {
                throw new Error('[hAzzle-' + code + '] ' + message);
            }
        },

        // Lower case 

        tlc = function(str) {
            return str.toLowerCase();
        },

        // Require a module

        require = function(name) {
            if (name && typeof name === 'string') {
                return modules[tlc(name)];
            }
        },

        // Defines a module

        define = function(name, fn) {
            if (typeof name === 'string' && typeof fn === 'function' && !modules[name]) {
                installed[tlc(name)] = true;
                modules[tlc(name)] = fn.call(hAzzle.prototype);
            }
        },

        validTypes = function(elem) {
            return elem && (elem.ELEMENT_NODE || elem.DOCUMENT_NODE);
        },

        // Define a local copy of hAzzle

        hAzzle = function(sel, ctx) {

            // hAzzle(), hAzzle(null), hAzzle(undefined), hAzzle(false)
            if (!sel) {
                return;
            }
            // Allow instantiation without the 'new' keyword
            if (!(this instanceof hAzzle)) {
                return new hAzzle(sel, ctx);
            }

            if (sel instanceof hAzzle) {
                return sel;
            }

            var els, util = require('Util');

            // DOM ready

            if (typeof sel === 'function') {
                if (installed.ready) {
                    require('ready').ready(sel);
                } else {
                    err(true, 6, 'ready.js module not installed');
                }
            }

            if (typeof sel === 'string') {
                if (installed.manipulation &&
                    sel[0] === '<' &&
                    sel[sel.length - 1] === '>' &&
                    sel.length >= 3) {
                    els = require('manipulation').create(
                        sel,
                        ctx && ctx.nodeType ? ctx.ownerDocument || ctx : document
                    );
                } else {
                    els = this.find(sel, ctx, true);
                }
                // hAzzle([dom]) 
            } else if (Array.isArray(sel)) {
                els = util.unique(util.filter(sel, validTypes));
                // hAzzle(dom)
            } else if (this.isNodeList(sel)) {
                els = util.filter(util.makeArray(sel), validTypes);
                // hAzzle(dom)
            } else if (sel.nodeType) {
                // If it's a html fragment, create nodes from it
                if (sel.nodeType === 11) {
                    // This children? Are they an array or not?
                    els = sel.children;
                } else {
                    els = [sel];
                }
                // window     
            } else if (sel === window) {
                els = [sel];
            } else {
                els = [];
            }

            // Create a new hAzzle collection from the nodes found

            if (els === undefined) {
                this.length = 0;
                this.elements = [];
            } else {
                this.elements = els;
                this.length = els.length;
            }
            return this;
        };

    var _hAzzle = window.hAzzle;

    // Restores original hAzzle namespace  

    hAzzle.noConflict = function() {
        if (window.hAzzle === hAzzle) {
            window.hAzzle = _hAzzle;
        }

        return window;
    };

    // Expose

    hAzzle.err = err;
    hAzzle.installed = installed;
    hAzzle.require = require;
    hAzzle.define = define;
    hAzzle.codename = codename;
    hAzzle.version = version;

    // Hook hAzzle on the window object

    window.hAzzle = hAzzle;

}(window));