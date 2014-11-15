if (![].contains) {
        Object.defineProperty(Array.prototype, 'contains', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function(target /*, fromIndex*/ ) {
                if (this === undefined || this === null) {
                    throw new TypeError('Cannot convert this value to object');
                }

                var O = Object(this),
                    len = parseInt(O.length) || 0;

                if (len === 0) {
                    return false;
                }
                var n = (arguments[1] !== undefined) ? parseInt(arguments[1]) : 0;
                 
                if (n >= len) {
                    return false;
                }
                var k;
                if (n >= 0) {
                    k = n;
                } else {
                    k = len + Math.abs(n);
                    if (k < 0) {
                        k = 0;
                    }
                }
                while (k < len) {
                    var currentElement = O[k];
                    if (target === currentElement ||
                        target !== target && currentElement !== currentElement
                    ) {
                        return true;
                    }
                    k += 1;
                }
                return false;
            }
        });
}