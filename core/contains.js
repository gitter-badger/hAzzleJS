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

            if (len < 1) {
                return false;
            }
            var from = Math.floor(arguments[1] || 0);
            // In ECMA 6 max length is 2^53-1, currently limited to 2^32-1
            if (from >= len || from > 0xFFFFFFFF) {
                return false;
            }

            if (from < 0) {
                from = len + from;
            }
            if (from === -Infinity || from < 0) {
                from = 0;
            }

            var check;

            if (from >= 0) {
                check = from;
            } else {
                check = len + Math.abs(from);
                if (check < 0) {
                    check = 0;
                }
            }
            while (check < len) {
                var currentElement = O[check];
                if (target === currentElement ||
                    target !== target && currentElement !== currentElement
                ) {
                    return true;
                }
                check += 1;
            }
            return false;
        }
    });
}