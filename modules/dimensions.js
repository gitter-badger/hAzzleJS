// dimensions.js
hAzzle.define('dimensions', function() {

    var win = window,
        doc = win.document,
        docElem = doc.documentElement,

        // Dependencies

        util = hAzzle.require('util'),
        types = hAzzle.require('types'),
        features = hAzzle.require('has'),
        styles = hAzzle.require('style'),
        css = hAzzle.require('css'),

        getElem = function(elem) {
            return elem instanceof hAzzle ? elem.elements[0] : elem.length ? elem[0] : elem;
        },
        isOffset = function(elem) {
            elem = getElem(elem);
            return css.css(elem, 'position') !== 'static' || !util.nodeName(elem, 'html');
        },
        isStatic = function(elem) {
            elem = getElem(elem);
            var tag = elem.tagName.toLowerCase();
            return isOffset(elem) ||
                (tag === 'table' ||
                    tag === 'td' ||
                    tag === 'th');
        },
        origValues = function(elem, t) {

            var originalValues = {
                position: elem.style.position || '',
                visibility: elem.style.visibility || '',
                display: elem.style.display || ''
            };
            // New CSS style values we are setting to get right values for hidden elements,
            // the original values will be restored later on

            t.first().css({
                position: 'absolute',
                visibility: 'hidden',
                display: 'block'
            });

            return originalValues;
        },

        _matchMedia = win.matchMedia || win.msMatchMedia,
        mq = _matchMedia ? function(q) {
            return !!_matchMedia.call(win, q).matches;
        } : function() {
            return false;
        },

        viewportW = function() {
            var cw = docElem.clientWidth,
                iw = win.innerWidth;
            return cw < iw ? iw : cw;
        },
        viewportH = function() {
            var ch = docElem.clientHeight,
                ih = win.innerHeight;
            return ch < ih ? ih : ch;
        },

        getWindow = function(elem) {
            return types.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
        },
        // Test if a media query is active   
        mediaQuery = function() {
            hAzzle.err(!mq, 15, 'matchMedia are not supported by this browser!');
            return true;
        },

        matchMedia = _matchMedia ? function() {
            // matchMedia must be binded to window
            return _matchMedia.apply(win, arguments);
        } : function() {
            return {};
        },
        // Test if any part of an element (or the first element in a matched set) is in the 
        // current viewport
        viewport = function() {
            return {
                'width': viewportW(),
                'height': viewportH()
            };
        },
        calibrate = function(coords, cushion) {
            var opt = {};
            cushion = +cushion || 0;
            opt.width = (opt.right = coords.right + cushion) - (opt.left = coords.left - cushion);
            opt.height = (opt.bottom = coords.bottom + cushion) - (opt.top = coords.top - cushion);
            return opt;
        },

        // Get an a object containing the properties top, bottom, left, right, width, and height 
        // with respect to the top-left corner of the current viewport, and with an 
        // optional cushion amount

        rectangle = function(elem, cushion) {
            if ((elem = elem instanceof hAzzle ? elem.elements[0] : elem.length ? elem[0] : elem)) {
                if (!elem || elem.nodeType !== 1) {
                    return false;
                }
                return calibrate(elem.getBoundingClientRect(), cushion);
            }
        },

        // Get the aspect ratio of the viewport or of an object with width/height properties

        aspect = function(opt) {
            opt = !null ? viewport() : opt.nodeType === 1 ? rectangle(opt) : opt;
            var h = opt.height,
                w = opt.width;
            h = types.isType('Function')(h) ? h.call(opt) : h;
            w = types.isType('Function')(w) ? w.call(opt) : w;
            return w / h;
        },

        // Test if an element is in the same x-axis section as the viewport.
        Xaxis = function(elem, cushion) {
            var r = rectangle(elem, cushion);
            return !!r && r.right >= 0 && r.left <= viewportW();
        },
        // Test if an element is in the same y-axis section as the viewport.    

        Yaxis = function(elem, cushion) {
            var r = rectangle(elem, cushion);
            return !!r && r.bottom >= 0 && r.top <= viewportH();
        },
        // Test if an element is in the viewport.
        inViewport = function(elem, cushion) {
            var r = rectangle(elem, cushion);
            return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
        },
        setOffset = function(elem, opts, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
                position = css.css(elem, 'position'),
                curElem = hAzzle(elem),
                props = {};

            // Set position first, in-case top/left are set even on static elem
            if (position === 'static') {
                elem.style.position = 'relative';
            }

            curOffset = curElem.offset();
            curCSSTop = css.css(elem, 'top');
            curCSSLeft = css.css(elem, 'left');
            calculatePosition = (position === 'absolute' || position === 'fixed') &&
                (curCSSTop + curCSSLeft).indexOf('auto') > -1;

            // Need to be able to calculate position if either
            // top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;

            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (types.isType('function')(opts)) {
                opts = opts.call(elem, i, util.mixing({}, curOffset));
            }

            if (opts.top != null) {
                props.top = (opts.top - curOffset.top) + curTop;
            }
            if (opts.left != null) {
                props.left = (opts.left - curOffset.left) + curLeft;
            }

            if ('using' in opts) {
                opts.using.call(elem, props);

            } else {
                curElem.css(props);
            }
        };

    // BIG NOTE!! getBoundingClientRect() should have been the best solution for this method, but
    // it's terrible slow, and hAzzle need to be fast.
    // http://jsperf.com/getboundingclientrect-vs-offset

    this.offset = function(opts) {
        if (arguments.length) {
            return opts === undefined ?
                this.elements :
                this.each(function(elem, i) {
                    setOffset(elem, opts, i);
                });
        }

        var docElem, elem = this.elements[0],
            FireFox = features.has('firefox'),
            doc = elem && elem.ownerDocument,
            top = 0,
            left = 0;

        if (!doc) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if (!hAzzle.require('Core').contains(docElem, elem)) {
            return {
                top: 0,
                left: 0
            };
        }

        while (elem && elem !== document.body && elem !== document.documentElement) {

            left += elem.offsetLeft;
            top += elem.offsetTop;

            if (FireFox) {
                if (css.css(elem, 'mozBoxSizing') !== 'border-box') {
                    left += parseFloat(css.css(elem, 'borderLeftWidth')) || 0;
                    top += parseFloat(css.css(elem, 'borderTopWidth')) || 0;
                }
                if (elem.parentElement && css.css(elem.parentElement, 'overflow') !== 'visible') {
                    top += parseFloat(css.css(elem.parentElement, 'borderTopWidth')) || 0;
                    left += parseFloat(css.css(elem.parentElement, 'borderLeftWidth')) || 0;

                }
            } else if (features.has('safari')) {
                left += parseFloat(css.css(elem, 'borderLeftWidth')) || 0;
                top += parseFloat(css.css(elem, 'borderTopWidth')) || 0;
            }
            elem = elem.offsetParent;
        }
        if (FireFox && css.css(elem, 'mozBoxSizing') !== 'border-box') {
            left -= parseFloat(css.css(elem, 'borderLeftWidth')) || 0;
            top -= parseFloat(css.css(elem, 'borderTopWidth')) || 0;
        }

        return {
            top: top,
            left: left
        };
    };

    this.position = function() {

        var elem = this.elements[0];

        if (!elem) {
            return null;
        }

        var element = elem.parentNode,
            position = {
                x: 0,
                y: 0
            };

        // Do some magic...

        while (element && !util.nodeName(element, 'html')) {
            position.x += element.scrollLeft;
            position.y += element.scrollTop;
            element = element.parentNode;
        }

        var offsetParent = this.offsetParent().elements,
            offset = this.offset(),
            parentOffset = !util.nodeName(offsetParent[0], 'html') ? {
                top: 0,
                left: 0
            } : offsetParent.offset();
        offset.top -= position.y;
        offset.left -= position.x;

        parentOffset.top += parseFloat(css.css(offsetParent[0], 'borderTopWidth')) || 0;
        parentOffset.left += parseFloat(css.css(offsetParent[0], 'borderLeftWidth')) || 0;

        // Subtract the two offsets

        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    };

    this.offsetParent = function() {
        return this.map(function(elem) {
            if (util.nodeName(elem, 'html') || css.css(elem, 'position') == 'fixed') return null;

            var isOffsetCheck = (css.css(elem, 'position') == 'static') ? isStatic : isOffset;
            while ((elem = elem.parentNode)) {
                if (isOffsetCheck(elem)) {
                    return elem;
                }
            }
            return null;
        });
    };

    this.getWidthHeight = function(dim) {

        if (!this.length) {
            return;
        }

        var elem = this.elements[0],

            // Get window width or height

            win = types.isWindow(elem),

            // Get document width or height

            doc = elem.nodeType == 9 && elem.documentElement,

            // Check if the element are visible or not. If hidden, we get the original values, and set new ones so
            // we can measure the right values properly. The original values will be restored later on

            orig = !doc && !!elem.style && !elem.offsetWidth && !elem.offsetHeight ? origValues(elem, this) : null,

            // Calculate width

            width = win ? elem.document.documentElement.clientWidth :
            doc ? Math.max(elem.body.scrollWidth, elem.body.offsetWidth, doc.scrollWidth, doc.offsetWidth, doc.clientWidth) :
            elem.offsetWidth,

            // Calculate height

            height = win ? elem.document.documentElement.clientHeight :
            doc ? Math.max(elem.body.scrollHeight, elem.body.offsetHeight, doc.scrollHeight, doc.offsetHeight, doc.clientHeight) :
            elem.offsetHeight;

        // Restore original CSS values on current element it's not a window or document object

        if (orig) {
            this.first().css(orig);
        }

        // Return 'width' or 'height' if given, if not return a object with both dimensions

        return (dim === 'width') ? width : (dim === 'height') ? height : {
            height: height,
            width: width
        };
    };

    this.width = function() {
        return this.getWidthHeight('width');

    };

    this.height = function() {
        return this.getWidthHeight('height');
    };

    // innerHeight / outerHeight

    util.each({
        height: 'Height',
        width: 'Width'
    }, function(val, prop) {

        // innerHeight / innerWidth
        this['inner' + val] = function() {
            return this.elements[0]['client' + val];
        };
        // outerHeight / outerWidth
        this['outer' + val] = function(margin) {

            var elem = this.elements[0];

            if (margin) {
                // Set new value
               hAzzle(this.elements).css('width', margin);
               // Return the new value
                return (elem['offset' + val] +
                    (parseInt(css.css(elem, prop === 'height' ? 'marginTop' : 'marginLeft'), 10) || 0) +
                    (parseInt(css.css(elem, prop === 'height' ? 'marginBottom' : 'marginRight'), 10) || 0))
            }

            return elem['offset' + val];

        };
    }.bind(this));


    util.each({
        scrollLeft: 'pageXOffset',
        scrollTop: 'pageYOffset'
    }, function(method, prop) {
        var top = 'pageYOffset' === prop;

        this[method] = function(val) {
            var elem = this.elements[0],
                win = getWindow(elem);

            if (val === undefined) {
                return win ? win[prop] : elem[method];
            }

            if (win) {
                win.scrollTo(!top ? val : window.pageXOffset,
                    top ? val : window.pageYOffset
                );

            } else {
                elem[method] = val;
            }
        };
    }.bind(this));

    return {
        getWindow: getWindow,
        matchMedia: matchMedia,
        mediaQuery: mediaQuery,
        aspect: aspect,
        inViewport: inViewport,
        Xaxis: Xaxis,
        Yaxis: Yaxis,
        rectangle: rectangle,
        viewportW: viewportW,
        viewportH: viewportH

    };
});