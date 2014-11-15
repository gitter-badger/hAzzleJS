// storage.js
hAzzle.define('storage', function() {

    var // Dependencies

        util = hAzzle.require('util'),
        strings = hAzzle.require('strings'),
        types = hAzzle.require('types'),
        core = hAzzle.require('core'),

        // camelize 

        camelize = strings.camelize,

        // RegExes

        htmlRegEx = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        charRegEx = /([A-Z])/g,
        WhiteRegex = (/\S+/g),

        dataAttr = function(elem, key, data) {

            var name;

            if (data === undefined && elem.nodeType === 1) {

                name = 'data-' + key.replace(charRegEx, '-$1').toLowerCase();

                data = elem.getAttribute(name);

                if (typeof data === 'string') {
                    try {
                        data = data === 'true' ? true :
                            data === 'false' ? false :
                            data === 'null' ? null :
                            // Only convert to a number if it doesn't change the string
                            +data + '' === data ? +data :
                            htmlRegEx.test(data) ? JSON.parse(data + '') : data;
                    } catch (e) {}

                    // Make sure we set the data so it isn't changed later
                    userData.set(elem, key, data);

                } else {

                    data = undefined;
                }
            }

            return data;
        },

        Storage = function() {
            this.expando = core.expando + Math.random();
        };

    Storage.prototype = {
        
        constructor: Storage,

        register: function(elem, initial) {

            hAzzle.err(!types.isObject(elem), 22, 'no valid DOM element in storage.js');

            if (elem.nodeType) {

                elem[this.expando] = {
                    value: initial || {}
                };

                // Only use ES5 defineProperty for non-nodes
            } else {
                Object.defineProperty(elem, this.expando, {
                    value: initial || {},
                    writable: true,
                    configurable: true
                });
            }

            return elem[this.expando];
        },
        cache: function(elem, initial) {

            // Always return an empty object.
            if (!elem || !(elem.nodeType === 1 ||
                    elem.nodeType === 9 ||
                    !(+elem.nodeType))) {
                return {};
            }

            // Check if the elem object already has a cache
            var cache = elem[this.expando];

            // If so, return it
            if (cache) {
                return cache;
            }

            // If not, register one
            return this.register(elem, initial);
        },
        set: function(elem, data, value) {
            if (elem) {

                var prop, cache = this.cache(elem);

                if (cache) {
                    // Handle: [ elem, key, value ] args
                    if (typeof data === 'string') {
                        cache[data] = value;

                        // Handle: [ elem, { properties } ] args
                    } else {
                        // Fresh assignments by object are shallow copied
                        if (types.isEmptyObject(cache)) {

                            util.mixin(cache, data);
                            // Otherwise, copy the properties one-by-one to the cache object
                        } else {
                            for (prop in data) {
                                cache[prop] = data[prop];
                            }
                        }
                    }
                    return cache;
                }
            }
        },
        access: function(elem, key, value) {
            var stored;

            if (key === undefined ||
                ((key && typeof key === 'string') && value === undefined)) {

                stored = this.get(elem, key);

                return stored !== undefined ?
                    stored : this.get(elem, camelize(key));
            }

            this.set(elem, key, value);

            // Since the 'set' path can have two possible entry points
            // return the expected data based on which path was taken[*]
            return value !== undefined ? value : key;
        },
        get: function(elem, key) {
            var cache = this.cache(elem);
            if (cache) {
                return cache !== undefined && key === undefined ? cache : cache[key];
            }
        },
        release: function(elem, key) {
            var i, name, camel,
                cache = this.cache(elem);

            if (key === undefined) {
                this.register(elem);

            } else {
                // Support array or space separated string of keys
                if (types.isArray(key)) {
                    name = key.concat(key.map(camelize));
                } else {
                    camel = camelize(key);
                    // Try the string as a key before any manipulation
                    if (key in cache) {
                        name = [key, camel];
                    } else {
                        name = camel;
                        name = cache[name] ? [name] : (name.match(WhiteRegex) || []);
                    }
                }

                i = name.length;

                while (i--) {
                    delete cache[name[i]];
                }
            }
        },
        hasData: function(elem) {
            return !types.isEmptyObject(
                elem[this.expando] || {}
            );
        },
        flush: function(elem) {
            if (elem[this.expando]) {
                delete elem[this.expando];
            }
        }
    };

    var privateData = new Storage(),
        userData = new Storage();

    this.data = function(key, value) {

        var i, name, data,
            elem = this.elements[0],
            attrs = elem && elem.attributes;

        // Gets all values

        if (key === undefined) {

            if (this.length) {

                data = userData.get(elem);

                if (elem.nodeType === 1 && !privateData.get(elem, 'hasDataAttrs')) {

                    i = attrs.length;

                    while (i--) {

                        if (attrs[i]) {

                            name = attrs[i].name;

                            if (name.indexOf('data-') === 0) {

                                name = camelize(name.slice(5));
                                dataAttr(elem, name, data[name]);
                            }
                        }
                    }

                    privateData.set(elem, 'hasDataAttrs', true);
                }
            }

            return data;
        }

        // Sets multiple values

        if (typeof key === 'object') {

            return this.each(function(elem) {
                userData.set(elem, key);
            });
        }
        var camelKey = camelize(key);

        if (elem && value === undefined) {

            data = userData.get(elem, key);

            if (data !== undefined) {

                return data;
            }

            data = userData.get(elem, camelKey);

            var hasDataAttrs = privateData.get(this, 'hasDataAttrs'),
                isHyphenated = key.indexOf('-') !== -1;

            if (data !== undefined) {

                return data;
            }

            data = dataAttr(elem, camelKey, undefined);

            if (data !== undefined) {

                return data;
            }

            // We tried really hard, but the data doesn't exist.

            return;
        }

        // Set the data...

        this.each(function(elem) {

            var data = userData.get(elem, camelKey);
            userData.set(elem, camelKey, value);

            if (isHyphenated && data !== undefined) {
                userData.set(elem, key, value);
            }

            if (isHyphenated && hasDataAttrs === undefined) {
                userData.set(elem, key, value);
            }
        });
    };

    // Remove attributes from element collection

    this.removeData = function(key) {
        return this.each(function(elem) {
            userData.release(elem, key);
        });
    };

    return {
        private: privateData,
        data: userData
    };
});