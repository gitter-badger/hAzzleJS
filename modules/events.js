var win = this,
  doc = win.document || {},

  // Make sure we always are on the correct document

  docElem = hAzzle.docElem,
  cancelFrame = hAzzle.cancelFrame,
  evwhite = (/\S+/g),
  mouseEvent = /^click|mouse(?!(.*wheel|scroll))|menu|pointer|contextmenu|drag|drop/i,
  keyEvent = /^key/,
  namespaceRegex = /^([^\.]*(?=\..*)\.|.*)/,
  nameRegex = /(\..*)/,
  textEvent = /^text/i,
  mouseWheelEvent = /mouse.*(wheel|scroll)/i,
  touchEvent = /^touch|^gesture/i,
  messageEvent = /^message$/i,
  popstateEvent = /^popstate$/i,
  overOut = /over|out/,
  cache = [],
  slice = Array.prototype.slice,

  isObject = hAzzle.isObject,
  isString = hAzzle.isString,
  isFunction = hAzzle.isFunction,
  triggering = false,
  /**
   * We only use rAF on the *most important*
   * event types
   */

  frameEvents = {
    'mouseover': 1,
    'mousemove': 0,
    'mousewheel': 1,
    'drag': 1,
    'dropenter': 1,
    'dragstart': 1,
    'dragend': 1,
    'dragover': 1,
    'dropleave': 1,
    'touch': 1,
    'pointer': 1,
    'scroll': 1,
    'resize': 1,
    'gesturechange': 1,
    'gestureend': 1
  },
  ticking = false,
  safeRAF = hAzzle.safeRAF;

function returnTrue() {
  return true;
}

hAzzle.event = {

  'global': {},

  /**
   * Add event to element.
   * Using addEventListener
   *
   * @param {Object} elem
   * @param {String} events
   * @param {String} selector
   * @param {Function} fn
   */

  addEvent: function (elem, events, selector, fn, /* internal */ one) {

    var originalFn, type, types, i, args, entry, first,
      namespaces;

    // Don't attach events to text/comment nodes 

    if (elem.nodeType === 3 || elem.nodeType === 8 || !elem.nodeType || !events) {

      return;
    }

    /**
     * Attach multiple events on an object.
     *
     * Note!
     *
     * For event delegation, you use:
     *
     *   func:
     *   delegate:
     *
     * wrapped inside an object after the event type.
     * All events will then be delegated
     *
     * Examples:
     *
     * Multiple events
     * ---------------
     *
     *  hAzzle('p'.on({
     *
     *         click: function (e) {},
     *         mouseover: function (e) {},
     *  });
     *
     *
     * Multiple events - event delegation:
     * -----------------------------------
     *
     *  hAzzle( 'body' ).on({
     *    click: {
     *
     *      func: function (e) {}
     *      delegate: 'p'
     *    }
     *  });
     *
     */

    if (isObject(events)) {

      //move out 'call' and 'apply' from loops

      var addEventCall = (function (thisArg, events, elem) {
        return function (type) {
          var evto = events[type];

          if (isObject(evto)) {

            hAzzle.event.addEvent.call(thisArg, elem, type, evto.delegate, evto.func);

          } else {

            hAzzle.event.addEvent.call(thisArg, elem, type, events[type]);
          }
        };

      })(this, events, elem);

      for (type in events) {

        if (events.hasOwnProperty(type)) {

          addEventCall(type);

        }
      }

      return;
    }

    // Event delegation

    if (!isFunction(selector)) {
      originalFn = fn;
      args = slice.call(arguments, 4);
      fn = delegate(selector, originalFn);
    } else {
      args = slice.call(arguments, 3);
      fn = originalFn = selector;
    }

    // Handle multiple events separated by a space

    types = isString(events) && (events || '').match(evwhite) || [''];

    if (!types) {

      return;

    }

    // special case for one(), wrap in a self-removing handler

    if (one === 1) {

      fn = hAzzle.event.once(hAzzle.event.removeEvent, elem, events, fn, originalFn);
    }

    i = types.length;

    while (i--) {

      // event type

      type = types[i].replace(nameRegex, '');

      // There *must* be a type, no attaching namespace-only handlers

      if (!type) {

        continue;
      }

      /* If event delegation, check for eventHooks

             Note !! This is important. For us to get 'mouseenter'
             to work on delegated events, we use 'hooks'.
             'mouseenter' will then become 'mouseover' and work
             right out of the box.

             A possible problem can occur when we are going to delete
             the delegated events. We have to turn it back to normal
             event type before removing it. 
			 
             It can be done if we are using an hook for this inside
             the function for removing delegated events, and not inside
             the main function itself. This for better performance.

             Keep that in mind !!
			 
			 */

      var hooks = hAzzle.eventHooks[type] || {};

      if (hooks && ('delegateType' in hooks)) {
        type = selector ? hooks.delegateType : type;
      }

      // namespaces

      namespaces = types[i].replace(namespaceRegex, '').split('.').sort();

      first = hAzzle.event.register(entry = new Registry(
        elem,
        type,
        fn,
        originalFn,
        namespaces,
        args,
        false // not root
      ));

      // Add roothandler if we're the first

      if (first) {

        type = entry.eventType;

        // Trigger eventHooks if any
        // e.g. support for 'bubbling' focus and blur events

        hooks = hAzzle.eventHooks[type];

        if (hooks && ('simulate' in hooks)) {
          hooks.simulate(elem, type);
        }

        elem.addEventListener(type, rootListener, false);
      }
    }

    if (entry) {

      hAzzle.event.global[entry.eventType] = true;
    }
  },

  once: function (rm, element, type, fn, originalFn) {
    // wrap the handler in a handler that does a remove as well
    return function () {
      fn.apply(this, arguments);
      rm(element, type, originalFn);
    };
  },

  /**
   * Remove an event handler.
   *
   * @param {Object} el
   * @param {String} selector
   * @param {String} type
   * @param {Function} fn
   *
   *
   * FIX ME!!
   *
   * Left to do with this function is to remove
   * handlers on delegated events.
   *
   * For now we can do:
   *
   *  hAzzle( delegated node, root node).off()
   *
   */

  removeEvent: function (elem, evt, selector, fn) {

    var k, type, namespaces, i;

    if (!elem) {
      return;
    }

    if (selector === false || isFunction(selector)) {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }

    // hAzzle.inArray() are faster then native indexOf, and this
    // has to be fast

    if (isString(evt) && hAzzle.inArray(evt, ' ') > 0) {

      // Handle multiple events separated by a space

      evt = (evt || '').match(evwhite) || [''];

      i = evt.length;

      while (i--) {

        this.removeEvent(elem, evt[i], selector, fn);
      }

      return elem;
    }

    // Check for namespace

    if (isString(evt)) {

      type = evt.replace(nameRegex, '');
    }

    if (type) {

      // Checks if any 'type' need special threatment
      // e.g. mouseenter and mouseleave

      var hooks = hAzzle.eventHooks[type];

      if (hooks && ('specialEvents' in hooks)) {
        type = hooks.specialEvents.name || type;
      }
    }

    if (!evt || isString(evt)) {

      // namespace

      if ((namespaces = isString(evt) && evt.replace(namespaceRegex, ''))) {

        namespaces = namespaces.split('.').sort();
      }

      hAzzle.event.remove(elem, type, fn, namespaces, selector);

    } else if (isFunction(evt)) {

      // removeEvent(el, fn)

      this.remove(elem, null, evt, null, selector);

    } else {

      // removeEvent(el, { t1: fn1, t2, fn2 })

      for (k in evt) {

        if (evt.hasOwnProperty(k)) {

          this.removeEvent(elem, k, evt[k]);
        }
      }
    }

    return elem;
  },

  /**
   * Clone events attached to elements
   *
   * @param {Object} element
   * @param {Object} from
   * @param {String} type (e.g. 'click', 'mouseover')
   * @return {hAzzle}
   */

  clone: function (elem, from, type) {
    var handlers = hAzzle.event.get(from, type, null, false),
      l = handlers.length,
      i = 0;

    //move out 'apply' from loops
    var applyAddEvent = (function (elem, handlers) {
      return function (i) {
        var args, core;
        if (handlers[i].original) {
          args = [elem, handlers[i].type];
          if ((core = handlers[i].handler.__hAzzle)) {

            args.push(hAzzle.selector);
          }

          args.push(handlers[i].original);
          hAzzle.event.addEvent.apply(null, args);
        }
      };
    })(elem, handlers);

    for (; i < l; i++) {
      applyAddEvent(i);
    }

    return elem;
  },

  trigger: function (elem, type, args) {

    var cur, types = type.split(' '),
      i = types.length,
      j = 0,
      l, call, evt, names, handlers;

    cur = elem || doc;

    // Don't do events on text and comment nodes

    if (elem.nodeType === 3 || elem.nodeType === 8 || !type) {

      return;
    }

    while (i--) {

      type = types[i].replace(nameRegex, '');

      if ((names = types[i].replace(namespaceRegex, ''))) {

        names = names.split('.');
      }

      if (!names && !args) {

        /**
         * Create custom events.
         *
         * These events can be listened by hAzzle via `on`,
         * and by pure javascript via `addEventListener`
         *
         * Examples:
         *
         * hAzzle('p').on('customEvent', handler);
         *
         * hAzzle('p').trigger('customEvent');
         *
         * window.document.addEventListener('customEvent', handler);
         *
         */

        evt = doc.createEvent('HTMLEvents');
        evt.initEvent(type, true, true, win, 1);
        elem.dispatchEvent(evt);

      } else {

        // non-native event, either because of a namespace, arguments or a non DOM element
        // iterate over all listeners and manually 'fire'

        handlers = hAzzle.event.get(cur, type, null, false);

        evt = hAzzle.Event(null, cur);

        evt.type = type;

        call = args ? 'apply' : 'call';

        args = args ? [evt].concat(args) : evt;

        l = handlers.length;

        for (; j < l; j++) {

          if (handlers[j].inNamespaces(names)) {

            handlers[j].handler.apply(cur, args);
          }
        }
      }
    }
  },

  /**
   * Detach an event or set of events from an element
   *
   * There are many different methods for removing events:
   *
   *  hAzzle.('p').off(handler);
   *
   *  hAzzle.('p').off('click');
   *
   *  hAzzle.('p').off('click', handler);
   *
   *  hAzzle.('p').off('click mouseover');
   *
   *  hAzzle.('p').off({ click: clickHandler, keyup: keyupHandler });
   *
   *  hAzzle.('p').off();
   *
   */

  remove: function (elem, types, handler, namespaces /*, selector*/ ) {
    //the question here is what are we going to do with this selector argument
    var type = types && types.replace(nameRegex, ''),
      handlers = hAzzle.event.get(elem, type, null, false),
      removed = [],
      rAF = [],
      i = 0,
      j,
      x,
      l = handlers.length;

    for (; i < l; i++) {

      if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
        hAzzle.event.unregister(handlers[i]);
        if (!removed[handlers[i].type]) {
          rAF[handlers[i].rafId] = handlers[i].rafId;
          removed[handlers[i].type] = handlers[i].type;
        }
      }
    }

    // Cancel rAF if any		

    for (x in rAF) {
      cancelFrame(rAF[x]);
    }

    // Remove the root listener if this is the last one

    for (j in removed) {
      if (!hAzzle.event.has(elem, removed[j], null, false)) {
        elem.removeEventListener(removed[j], rootListener, false);
      }
    }
  },

  map: {},

  // This functions are developed with inspiration from Bean

  loopThrough: function (elem, type, original, handler, root, fn) {

    var pfx = root ? 'r' : '#',
      t, self = this;

    if (!type || type == '*') {
      for (t in self.map) {
        if (t.charAt(0) == pfx) {
          self.loopThrough(elem, t.substr(1), original, handler, root, fn);
        }
      }
    } else {

      var i = 0,
        l,
        list = self.map[pfx + type],
        all = elem == '*';

      if (!list) {

        return;
      }

      l = list.length;

      for (; i < l; i++) {

        if ((all || list[i].matches(elem, original, handler)) && !fn(list[i], list, i, type)) {

          return;
        }
      }
    }
  },

  has: function (elem, type, original, root) {

    var i, list = this.map[(root ? 'r' : '#') + type];

    if (list) {

      i = list.length;

      while (i--) {

        if (!list[i].root && list[i].matches(elem, original, null)) {

          return true;
        }
      }
    }
    return false;
  },

  get: function (elem, type, original, root) {
    var entries = [];
    this.loopThrough(elem, type, original, null, root, function (entry) {
      return entries.push(entry);
    });
    return entries;
  },

  // Add an event to the element's event registry.

  register: function (entry) {
    var has = !entry.root && !this.has(entry.element, entry.type, null, false),
      key;

    if (entry.root) {

      key = 'r' + entry.type;

    } else {

      key = '#' + entry.type;
    }

    (this.map[key] || (this.map[key] = [])).push(entry);

    return has;
  },

  // Remove an event from the element's event registry.

  unregister: function (entry) {

    var self = this;

    this.loopThrough(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {

      list.splice(i, 1);

      entry.removed = true;

      if (list.length === 0) {

        delete self.map[(entry.root ? 'r' : '#') + entry.type];
      }
      return false;
    });
  },

  entries: function () {
    var t, entries = [],
      self = this;

    for (t in self.map) {
      if (t.charAt(0) == '#') {
        entries = entries.concat(self.map[t]);
      }
    }

    return entries;
  },
  fixHook: {},

  // Common properties for all event types

  props: ('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail ' +
    'eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget ' +
    'shiftKey srcElement target timeStamp type view which propertyName').split(' '),

  // Return all common properties

  common: function () {
    return hAzzle.event.props;
  },

  keyHooks: function (event, original) {

    original.keyCode = event.keyCode || event.which;

    return 'char charCode key keyCode keyIdentifier keyLocation location'.split(' ');
  },

  mouseHooks: function (event, original, type) {

    original.rightClick = event.which === 3 || event.button === 2;
    original.pos = {
      x: 0,
      y: 0
    };

    if (event.pageX || event.pageY) {
      original.clientX = event.pageX;
      original.clientY = event.pageY;
    } else if (event.clientX || event.clientY) {
      original.clientX = event.clientX + doc.body.scrollLeft + docElem.scrollLeft;
      original.clientY = event.clientY + doc.body.scrollTop + docElem.scrollTop;
    }
    if (overOut.test(type)) {
      original.relatedTarget = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
    }

    return 'button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' ');
  },

  textHooks: function () {

    return 'data';
  },

  mouseWheelHooks: function () {

    return ('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
      'axis button buttons clientX clientY dataTransfer ' +
      'fromElement offsetX offsetY pageX pageY screenX screenY toElement').split(' ');
  },

  touchHooks: function () {

    return 'touches targetTouches changedTouches scale rotation'.split(' ');
  },

  messageHooks: function () {

    return 'data origin source'.split(' ');
  },

  popstateHooks: function () {

    return 'state';
  }
};

hAzzle.eventHooks = {};


hAzzle.Event = function (event, element) {

  // Allow instantiation without the 'new' keyword
  if (!(this instanceof hAzzle.Event)) {
    return new hAzzle.Event(event, element);
  }

  if (!arguments.length) {
    return;
  }

  event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event;

  if (!event) {

    return;
  }

  var self = this,
    type = event.type,
    target = event.target || event.srcElement,
    i, p, props, cleaned;

  self.originalEvent = event;
  self.target = target && target.nodeType === 3 ? target.parentNode : target;

  cleaned = hAzzle.event.fixHook[type];

  if (!cleaned) {

    hAzzle.event.fixHook[type] = cleaned =

    mouseEvent.test(type) ? hAzzle.event.mouseHooks :

    // keys

    keyEvent.test(type) ? hAzzle.event.keyHooks :

    // text

    textEvent.test(type) ? hAzzle.event.textHooks :

    // mouseWheel

    mouseWheelEvent.test(type) ? hAzzle.event.mouseWheelHooks :

    // touch and gestures

    touchEvent.test(type) ? hAzzle.event.touchHooks :

    // popstate

    popstateEvent.test(type) ? hAzzle.event.popstateHooks :

    // messages

    messageEvent.test(type) ? hAzzle.event.messageHooks :

    // common

    hAzzle.event.common;
  }

  props = cleaned(event, self);

  props = hAzzle.event.props;

  for (i = props.length; i--;) {

    if (!((p = props[i]) in this) && p in event) this[p] = event[p];
  }

  return self;
};

/* =========================== EVENT PROPAGATION ========================== */

hAzzle.Event.prototype = {

  preventDefault: function () {

    var e = this.originalEvent;

    this.isDefaultPrevented = returnTrue;

    if (e && e.preventDefault) {

      e.preventDefault();

    } else {

      e.returnValue = false;
    }
  },
  stopPropagation: function () {

    var e = this.originalEvent;

    this.isPropagationStopped = returnTrue;

    if (e && e.stopPropagation) {

      e.stopPropagation();

    } else {

      e.cancelBubble = true;
    }
  },

  // Set a 'stopped' property so that a custom event can be inspected

  stop: function () {
    this.stopped = true;
    this.preventDefault();
    this.stopPropagation();

  },

  stopImmediatePropagation: function () {

    var e = this.originalEvent;

    if (e && e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }

    this.isImmediatePropagationStopped = returnTrue;
  },
  isImmediatePropagationStopped: function () {

    var toE = this.originalEvent;

    if (toE.isImmediatePropagationStopped) {

      return toE.isImmediatePropagationStopped();
    }
  },
  clone: function (currentTarget) {
    var ne = hAzzle.Event(this, this.element);
    ne.currentTarget = currentTarget;
    return ne;
  }
};

// Registry

function Registry(element, type, handler, original, namespaces, args, root) {

  // Checks if any 'type' need special threatment
  // e.g. mouseenter and mouseleave

  var reg = this,
    hooks = hAzzle.eventHooks[type];

  if (hooks && ('specialEvents' in hooks)) {
    handler = reg.twistedBrain(element, handler, hooks.specialEvents.handler, args);
    type = hooks.specialEvents.name || type;
  }

  // If unload, remove the listener 
  if (type === 'unload') {

    handler = hAzzle.event.once(hAzzle.event.remove, element, type, handler, original);
  }

  reg.element = element;
  reg.type = type;
  reg.original = original;
  reg.namespaces = namespaces;
  reg.eventType = type;
  reg.target = element;

  // Deprecated ??

  reg.addEventListener = !! this.target.addEventListener;
  reg.root = root;
  reg.handler = reg.twistedBrain(element, handler, null, args);
}


Registry.prototype = {

  twistedBrain: function (element, fn, condition, args) {
    var call = function (event, eargs) {
      return fn.apply(element, args ? slice.call(eargs).concat(args) : eargs);
    },

      // Get correct target for delegated events

      getTarget = function (evt, eventElement) {
        var target = fn.__hAzzle ? findTarget(fn.__hAzzle.selector, evt.target, this) : eventElement;
        fn.__hAzzle.currentTarget = target;
        return target;
      },

      handler = condition ? function (event) {

        var target = getTarget(event, this);

        if (condition.apply(target, arguments)) {

          if (event) {

            event.currentTarget = target;
          }

          return call(event, arguments);
        }
      } : function (event) {

        //check if it is a delegated events
        if (fn.__hAzzle) {

          event = event.clone(getTarget(event));
        }

        return call(event, arguments);
      };
    handler.__hAzzle = fn.__hAzzle;
    return handler;
  },

  /**
   * Checks if there are any namespaces when we are
   * using the trigger() function
   */

  inNamespaces: function (checkNamespaces) {

    var self = this,
      i, j, c = 0;

    if (!checkNamespaces) {

      return true;
    }

    if (!self.namespaces) {

      return false;
    }

    i = checkNamespaces.length;

    while (i--) {

      for (j = self.namespaces.length; j--;) {
        if (checkNamespaces[i] === self.namespaces[j]) {

          c++;
        }
      }
    }
    return checkNamespaces.length === c;
  },

  matches: function (checkElement, checkOriginal, checkHandler) {
    return this.element === checkElement &&
      (!checkOriginal || this.original === checkOriginal) &&
      (!checkHandler || this.handler === checkHandler);
  }
};

/* =========================== PRIVATE FUNCTIONS ========================== */

/**
 * Root listener
 *
 * A 'rootlistener' are attached to each DOM event that we need to listen to, only once
 * per event type per DOM element
 *
 * @param {String} evt
 * @param {String} type
 * @return {hAzzle}
 */



function rootListener(evt, type) {

  var listeners = hAzzle.event.get(this, type || evt.type, null, false);

  evt = hAzzle.Event(evt, this, true);

  if (type) {
    evt.type = type;
  }

  triggering = true;

  triggerListeners(evt, listeners, this);

  triggering = false;
}

function triggerListeners(evt, listeners, thisArg) {
  var l = listeners.length,
    rafId = "",
    i = 0;

  var notifyListener = (function (evt, listeners, thisArg) {
    return function (i) {

      if (!listeners[i].removed) {

        /*    // Add rAF if possible

                if (frameEvents[evt.type]) {

                    if (!ticking) {

                        ticking = true;

                        // Todo !! Send rafId out of this function so we can
                        // grab it and cancel the frame

                        cancelFrame(rafId);

                        listeners[i].rafId = rafId = safeRAF( (function (e, that) {

                            return function (tick) {
                         console.log(tick)
                                listeners[i].handler.call(thisArg, evt);
                            };

                        })(evt, thisArg) );
                    }

                } else {*/

        listeners[i].handler.call(thisArg, evt);
        //   }

      }

    };
  })(evt, listeners, thisArg);

  if (listeners >= 2) {
    for (; i < l && !evt.isImmediatePropagationStopped(); i++) {
      notifyListener(i);
    }
  } else {
    notifyListener(0);
  }

  ticking = false;

}

/**
 * Event delegation core function
 *
 * The selector can either be an string, or series of
 * strings splitted by comma
 *
 * Examples:
 *
 * 'p'
 * 'p', 'div', 'span'
 *
 * You can delegate events like this:
 *
 * hAzzle(document).on('click', 'p', function(e) {}
 *
 * or
 *
 * hAzzle(document).on('click', ['p', 'div', 'span'], function(e) {}
 *
 * or
 *
 * hAzzle(document).on('click', hAzzle('p'), function(e) {}
 *
 */

function findTarget(selector, target, elem) {

  elem = elem || docElem;

  // We can never find CSS nodes in the window itself
  // so direct it back to document if elem = window

  elem = (elem === win) ? docElem : elem;

  var i, matches = cache[selector] ? cache[selector] : cache[selector] = hAzzle(selector, elem);
  for (; target !== elem; target = target.parentNode || elem) {
    if (matches !== null) {

      // Note!! if you use an while-loop here, you are sending
      // Firefox into infinity with huge crach

      for (i = matches.length; i--;) {
        if (matches[i] === target) {
          return target;
        }
      }
    }
  }
}

// Delegate handler

function delegate(selector, fn) {

  function handler(e) {

    var cur = e.target,
      type = e.type;

    if (cur.nodeType && (!e.button || type !== 'click')) {

      // Don't process clicks on disabled elements

      if (e.target.disabled !== true || type !== 'click') {

        var m = null;

        if (handler.__hAzzle) {
          m = handler.__hAzzle.currentTarget;
        }
        //check if the delagated event matches the selector
        if (m) {

          if (frameEvents[type]) {

            if (!handler.__hAzzle.rafId) {

              var raffn = (function (e, handler, fn, m, args) {

                return function rafcall() {
                  if (triggering) {
                    var output = fn.apply(m, args);

                    handler.__hAzzle.rafId = safeRAF(rafcall);

                    return output;
                  } else {
                    cancelFrame(handler.__hAzzle.rafId);

                    handler.__hAzzle.rafId = null;
                  }
                };

              })(e, handler, fn, m, arguments);

              raffn();

            }


          } else {

            return fn.apply(m, arguments);

          }

        } else {

          if (handler.__hAzzle.rafId) {

            cancelFrame(handler.__hAzzle.rafId);

            handler.__hAzzle.rafId = null;

          }

        }
      }
    }
  }

  handler.__hAzzle = {

    // Don't conflict with Object.prototype properties

    selector: selector, // + ' '
  };

  return handler;
}

hAzzle.extend({

  /**
   * Add event to element
   *
   * @param {String} events
   * @param {String} selector
   * @param {Function} fn
   * @return {hAzzle}
   */

  on: function (events, selector, fn) {
    return this.each(function (el) {
      hAzzle.event.addEvent(el, events, selector, fn);
    });
  },
  one: function (events, selector, fn) {
    return this.each(function (el) {
      hAzzle.event.addEvent(el, events, selector, fn, 1);
    });
  },

  /**
   * Remove event from element
   *
   * @param {String} events
   * @param {String} selector
   * @param {Function} fn
   * @return {hAzzle}
   */

  off: function (events, selector, fn) {
    return this.each(function (el) {
      hAzzle.event.removeEvent(el, events, selector, fn);
    });
  },

  /**
   * Trigger specific event for element collection
   *
   * @param {String} type
   * @return {hAzzle}
   */

  trigger: function (type, args) {

    return this.each(function (el) {
      hAzzle.event.trigger(el, type, args);
    });
  },

  hover: function (fnOver, fnOut) {
    return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
  },

  focus: function () {
    return this.each(function (el) {
      return el.focus();
    });

  },
  blur: function () {
    return this.each(function (el) {
      return el.blur();
    });
  },

  /**
   * Clone events attached to elements
   *
   * @param {Object} cloneElem
   * @param {String} type (e.g. 'click', 'mouseover')
   * @return {hAzzle}
   */

  cloneEvents: function (cloneElem, type) {
    return this.each(function (el) {
      hAzzle.event.clone(el, cloneElem, type);
    });
  }
});

hAzzle.each(('blur focus focusin focusout load resize scroll unload click dblclick ' +
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
  'change select submit keydown keypress keyup error contextmenu').split(' '), function (evt) {


  hAzzle.Core[evt] = function (delegate, fn) {
    return arguments.length > 0 ?
      this.on(evt, delegate, fn) :
      this.trigger(evt);
  };
});