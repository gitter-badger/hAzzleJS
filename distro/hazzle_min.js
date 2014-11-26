/*!
 * hAzzle Javascript Library
 * Copyright (c) 2014 Kenny Flashlight
 *
 * Version: 1.0.2d
 * Released under the MIT License.
 *
 * Date: 2014-11-26
 */
(function(){var m={},d={},k=function(a,d,r){if(a)throw Error("[hAzzle-"+d+"] "+r);},n=function(a){if(a&&"string"===typeof a)return m[a.toLowerCase()]},p=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},g=function(a,l){if(!a)return this;if(!(this instanceof g))return new g(a,l);if(a instanceof g)return a;if("string"===typeof a)this.elements=d.manipulation&&"<"===a[0]&&">"===a[a.length-1]&&3<=a.length?n("manipulation").create(a,l&&l.nodeType?l.ownerDocument||l:document):this.find(a,l,!0);else if(Array.isArray(a)){var r=
n("Util");this.elements=r.unique(r.filter(a,p))}else if(this.isNodeList(a))r=n("Util"),this.elements=r.filter(r.makeArray(a),p);else{if(a.nodeType)return this.elements=11===a.nodeType?a.children:[a],this.length=1,this;if(a===window)this.elements=[a];else if("function"===typeof a){if(d.ready)return n("ready").ready(a);k(!0,6,"ready.js module not installed")}else return this.elements=[],this.length=0,this}this.elements?this.length=this.elements.length:(this.elements=[],this.length=0);return this},a=
window.hAzzle;g.noConflict=function(){window.hAzzle===g&&(window.hAzzle=a);return window};g.err=k;g.installed=d;g.require=n;g.define=function(a,l){"string"!==typeof a||"function"!==typeof l||m[a]||(d[a.toLowerCase()]=!0,m[a.toLowerCase()]=l.call(g.prototype))};g.codename="new-age";g.version="1.0.2d";window.hAzzle=g})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var m=navigator.userAgent,d=window,k=d.document,n=k.createElement("div"),p=Object.prototype.toString,g={},a=function(){if(k.documentMode)return k.documentMode;for(var a=7,q;4<a;a--)if(q=k.createElement("div"),q.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e",q.getElementsByTagName("span").length)return a}(),b=function(a){return"function"===typeof g[a]?g[a]=g[a](d,k,n):g[a]},l=function(a,q,h,f){("undefined"===typeof g[a]||f)&&(g[a]=q);return h&&b(a)};l("mobile",
/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(m));l("android",/^Android/i.test(m));l("opera","[object Opera]"===p.call(window.opera));l("firefox","undefined"!==typeof InstallTrigger);l("chrome",d.chrome);l("webkit","WebkitAppearance"in k.documentElement.style);l("safari",0<p.call(window.HTMLElement).indexOf("Constructor"));l("ie",function(){return!!k.documentMode});l("mac",0<=navigator.appVersion.indexOf("Macintosh"));l("classlist",!!document.documentElement.classList);l("quirks",
"BackCompat"==document.compatMode);l("xpath",!!k.evaluate);l("air",!!d.runtime);l("dart",!(!d.startDart&&!k.startDart));l("promise",!!d.Promise);l("qsa",!!document.querySelectorAll);return{has:b,add:l,load:function(a,q,h){a?q([a],h):h()},cache:g,clear:function(a){a.innerHTML="";return a},ie:a}});
hAzzle.define("Types",function(){var m=Object.prototype.toString,d=Array.isArray,k=function(a){return"string"===typeof a},n=function(a){return"number"===typeof a},p=function(a){return a&&a.window===a},g=function(a){return a?function(b){return m.call(b)==="[object "+a+"]"}:function(){}};return{isType:g,isArray:d,isEmpty:function(a){if(null==a)return!0;if(d(a)||k(a)||g("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:p,
isObject:function(a){return null!==a&&"object"===typeof a},isPlainObject:function(a){return g("Object")(a)&&!p(a)&&Object.getPrototypeOf(a)===Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},isFunction:g("Function"),isNode:function(a){return!!a&&"object"===typeof a&&"nodeType"in a},isElement:function(a){return!(!a||!a.nodeName)},isString:k,isArrayLike:function(a){if(null==a||p(a))return!1;var b=a.length;return 1===a.nodeType&&b?!0:k(a)||d(a)||0===b||"number"===typeof b&&
0<b&&b-1 in a},isNumber:n,isBoolean:function(a){return"boolean"===typeof a},isNaN:function(a){return n(a)&&a!=+a},isSVGElem:function(a){return 1===a.nodeType&&"http://www.w3.org/2000/svg"===a.namespaceURI||window.SVGElement&&a instanceof window.SVGElement},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b||"[object HTMLFormControlsCollection]"===
b)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===a(0)||a(0)&&a(0).tagName)return!0}catch(d){}return!1}}});hAzzle.define("text",function(){var m=function(d){var k,n="",p=0;k=d.nodeType;if(!k)for(;k=d[p++];)n+=m(k);else if(1===k||9===k||11===k){if("string"===typeof d.textContent)return d.textContent;for(d=d.firstChild;d;d=d.nextSibling)n+=m(d)}else if(3===k||4===k)return d.nodeValue;return n};return{getText:m}});
hAzzle.define("util",function(){var m=hAzzle.require("types"),d=Object.keys,k=function(a,h,f,e){var c,b;if(f)if("function"===typeof a)for(c in a){if("prototype"!==c&&"length"!==c&&"name"!==c&&!1===h.call(a[c],a[c],c,f))break}else if(m.isArrayLike(a))for(;c<b&&(c=e?a.length-c-1:c,!1!==h.apply(a[c],f));c++);else for(c in a){if(!1===h.apply(a[c],f))break}else if(a)if("function"===typeof a)for(c in a){if("prototype"!==c&&"length"!==c&&"name"!==c&&!1===h.call(a[c],a[c],c))break}else if(m.isArray(a)||m.isArrayLike(a))for(c=
0,b=a.length;c<b&&(c=e?a.length-c-1:c,!1!==h.call(a[c],a[c],c));c++);else for(c in a)if(!1===h.call(a[c],a[c],c))break;return a},n=function(a,h,f){if("function"===typeof a){if(void 0===h)return a;f=f?f:3;return 1===f?function(e){return a.call(h,e)}:2===f?function(e,c){return a.call(h,e,c)}:3===f?function(e,c,f){return a.call(h,e,c,f)}:4===f?function(e,c,f,b){return a.call(h,e,c,f,b)}:function(){return a.apply(h,arguments)}}if(!a)return function(a){return a}},p=function(){for(var a,h,f,e,c=arguments[0],
b=1,d=arguments.length;b<d;b++)if(null!==(a=arguments[b]))for(h in a)f=c[h],e=a[h],c!==e&&(e&&m.isObject(e)?(f=f&&m.isObject(f)?f:{},c[h]=p(f,e)):void 0!==e&&(c[h]=e));return c},g=function(b,h,f){return b?"function"===typeof b?n(b,h,f):m.isObject(b)?a(b):l(b):function(a){return a}},a=function(a){var h=b(a),f=h.length;return function(a){if(!a)return!f;a=Object(a);for(var c=0,b,q;c<f;c++)if(b=h[c],q=b[0],b[1]!==a[q]||!(q in a))return!1;return!0}},b=function(a){for(var h=d(a),f=h.length,e=Array(f),c=
0;c<f;c++)e[c]=[h[c],a[h[c]]];return e},l=function(a){return function(h){return h[a]}},r=function(a,h,f){if(null==a)return-1;var e=0,c=a.length;if(f)if("number"===typeof f)e=0>f?Math.max(0,c+f):f;else{f=g(void 0,void 0,1);for(var e=f(h),c=0,b=a.length;c<b;){var d=c+b>>>1;f(a[d])<e?c=d+1:b=d}e=c;return a[e]===h?e:-1}for(;e<c;e++)if(a[e]===h)return e;return-1};return{map:function(a,h,f){if(a){h=g(h,f);f=a.length!==+a.length&&d(a);for(var e=(f||a).length,c=Array(e),b,l=0;l<e;l++)b=f?f[l]:l,c[l]=h.call(a[b],
a[b],b,a);return c}return[]},some:function(a,h,f){if(a){h=g(h,f);f=(e||a).length;var e,c=0,b;for(a.length!==+a.length&&(e=e(a));c<f;c++)if(b=e?e[c]:c,h(a[b],b,a))return!0}return!1},reduce:function(a,b,f,e){a&&(a=[]);b=n(b,e,4);var c=a.length!==+a.length&&d(a),l=(c||a).length,g=0,k;3>arguments.length&&(hAzzle.err(!l,7," no collection length exist in collection.reduce()"),f=a[c?c[g++]:g++]);for(;g<l;g++)k=c?c[g]:g,f=b(f,a[k],k,a);return f},each:k,mixin:p,makeArray:function(a){if(m.isArray(a))return a;
for(var b=-1,f=a.length,e=Array(f);++b<f;)e[b]=a[b];return e},merge:function(a,b){for(var f=+b.length,e=0,c=a.length;e<f;e++)a[c++]=b[e];a.length=c;return a},nodeName:function(a,b){return b&&a&&a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},unique:function(a,b,f,e){if(!a)return[];m.isBoolean(b)&&(e=f,f=b,b=!1);void 0!==f&&(f=g(f,e));e=[];for(var c=[],d=0,l,k=a.length;d<k;d++)if(l=a[d],b)d&&c===l||e.push(l),c=l;else if(f){var s=f(l,d,a);0>r(c,s)&&(c.push(s),e.push(l))}else 0>r(e,l)&&e.push(l);
return e},indexOf:r,filter:function(a,b,f){var e=[];if(!a)return e;b=g(b,f);k(a,function(a,f,d){b(a,f,d)&&e.push(a)});return e},now:Date.now}});
hAzzle.define("Core",function(){var m=1,d=window.document,k=window.document,n="hAzzle_"+1*new Date,p,g,a=Array.prototype.indexOf,b={},l,r=d.createElement("div").compareDocumentPosition(d.createElement("div"))&1,q,h=function(){return!!q},f=function(a,c){a===c&&(q=!0);return 0},e=n.split("").sort(f).join("")===n,c=function(a,c){var b=c&&a,f=b&&1===a.nodeType&&1===c.nodeType&&(~c.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(f)return f;if(b)for(;b=b.nextSibling;)if(b===c)return-1;return a?
1:-1},v=function(a){return/^[^{]+\{\s*\[native \w/.test(""+a)},t=function(a){var c,f,e,h;p=a=a.ownerDocument||a;c=a.documentElement;if(9!==p.nodeType||!p.documentElement)return d;d=a;if(f=c.getAttribute("__hAzzle"))return g=b[f];c.setAttribute("__hAzzle",m);g={id:++m};g.qsa=v(a.querySelectorAll);g.compare=v(c.compareDocumentPosition);g.contains=v(c.contains);g.QSABugs=e=[];g.matchesBugs=h=[];g.qsa&&(f=a.createElement("div"),f.appendChild(a.createElement("select")),(a=a.createElement("option")).setAttribute("selected",
""),f.firstChild.appendChild(a),f.querySelectorAll(":checked").length||e.push(":checked"),g.QSABugs=e.length&&new RegExp(e.join("|")));v(c=c.webkitMatchesSelector||c.mozMatchesSelector||c.oMatchesSelector||c.msMatchesSelector)&&(g.matchesSelector=c,g.disconMatch=c.call(f,"div"),g.matchesBugs=h.length&&new RegExp(h.join("|")));b[m]=g;return b[m]};t(d);var u=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},s=g.compare&&g.contains?function(a,c){var b=9===a.nodeType?
a.documentElement:a,f=c&&c.parentElement;return a===f||!!(f&&1===f.nodeType&&(b.contains?b.contains(f):a.compareDocumentPosition&&a.compareDocumentPosition(f)&16))}:function(a,c){if(c)for(;c=c.parentElement;)if(c===a)return!0;return!1},f=g.compare?function(c,b){if(c===b)return q=!0,0;var f=!c.compareDocumentPosition-!b.compareDocumentPosition;if(f)return f;f=(c.ownerDocument||c)===(b.ownerDocument||b)?c.compareDocumentPosition(b):1;return f&1||!r&&b.compareDocumentPosition(c)===f?c===p||c.ownerDocument===
k&&s(k,c)?-1:b===p||b.ownerDocument===k&&s(k,b)?1:l?a(l,c)-a(l,b):0:f&4?-1:1}:function(b,f){if(b===f)return q=!0,0;var e,h=0,d=b.parentNode,s=f.parentNode,g=[b],m=[f];if(!d||!s)return b===e?-1:f===e?1:d?-1:s?1:l?a(l,b)-a(l,f):0;if(d===s)return c(b,f);for(e=b;e=e.parentNode;)g.unshift(e);for(e=f;e=e.parentNode;)m.unshift(e);for(;g[h]===m[h];)h++;return h?c(g[h],m[h]):g[h]===k?-1:m[h]===k?1:0};return{environment:g,expando:n,addFeature:function(a,c){"string"===typeof a&&c&&(b[m][a]=c)},setDocument:t,
isXML:u,isHTML:!u(d),contains:s,unique:function(a){var c,b=[],d=0,s=0;q=!h;l=!e&&a.slice(0);a.sort(f);if(q){for(;c=a[s++];)c===a[s]&&(d=b.push(s));for(;d--;)a.splice(b[d],1)}l=null;return a},matches:g.matchesSelector,qsa:g.qsa,QSABugs:g.QSABugs,matchesBugs:g.matchesBugs}});
hAzzle.define("Collection",function(){var m=hAzzle.require("util"),d=hAzzle.require("types"),k=Array.prototype,n=k.concat,p=k.push,g=function(a,b,d){b="undefined"===typeof b?0:b;var g=-1;d=("undefined"===typeof d?a?a.length:0:d)-b||0;for(var k=Array(0>d?0:d);++g<d;)k[g]=a[b+g];return k};this.toJqueryZepto=function(){for(var a=this.length;a--;)this[a]=this.elements[a];return this};this.get=function(a){return void 0===a?g(a,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=function(a){var b=
this.length;a=+a+(0>a?b:0);return hAzzle(0<=a&&a<b?[this.elements[a]]:[])};this.reduce=function(a,b,d){return m.reduce(this.elements,a,b,d)};this.indexOf=function(a,b,d){return null==b?-1:k.indexOf.call(b,a,d)};this.map=function(a,b){return hAzzle(m.map(this.elements,a,b))};this.each=function(a,b,d){m.each(this.elements,a,b,d);return this};this.slice=function(a,b){return hAzzle(g(this.elements,a,b))};this.concat=function(){var a=m.map(g(arguments),function(a){return a instanceof hAzzle?a.elements:
a});return hAzzle(n.apply(this.elements,a))};this.contents=function(){return this.map(function(){return this.contentDocument||g(this.childNodes)||[]})};this.is=function(a){return a?0<this.length&&0<this.filter(a).length:!1};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var b=this.elements;return a?"string"===typeof a?m.indexOf(hAzzle(a).elements,b[0]):m.indexOf(b,a instanceof hAzzle?a.elements[0]:a):b[0]&&b[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,
b){return this.concat("string"===typeof a?hAzzle(a,b).elements:a)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.next=function(a){return this.map(function(){return this.nextElementSibling}).filter(a)};this.prev=function(a){return this.map(function(){return this.previousElementSibling}).filter(a)};this.prevAll=function(){var a=[];this.each(function(b){for(;(b=b.previousElementSibling)&&9!==b.nodeType;)a.push(b)});
return hAzzle(a)};this.nextAll=function(){var a=[];this.each(function(b){for(;(b=b.nextElementSibling)&&9!==b.nodeType;)a.push(b)});return hAzzle(a)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};this.shift=function(){return this.elements.shift.apply(this.elements,arguments)};this.lastIndexOf=function(){return this.elements.lastIndexOf.apply(this.elements,arguments)};this.reduceRight=function(){return this.elements.rediceRight.apply(this.elements,
arguments)};this.forEach=function(){return this.elements.forEach.apply(this.elements,arguments)};this.splice=function(){return this.elements.splice.apply(this.elements,arguments)};return{makeArray:function(a,b){var g=b||[];void 0!==a&&(d.isArrayLike(Object(a))?m.merge(g,d.isString(a)?[a]:a):p.call(g,a));return g},slice:g}});
Function.prototype.bind=function(){var m=this,d=Array.prototype.slice,k=m,n=d.call(arguments),p=n.shift(),g=function(){return k.apply(p,n.concat(d.call(arguments,n.length)))};g.bind=function(){var a=d.call(arguments);return Function.prototype.bind.apply(m,a)};return g};
hAzzle.define("bind",function(){var m=hAzzle.require("collection");return{bind:function(d,k){var n=2<arguments.length?m.slice(arguments,2):[],p;"string"===typeof k&&(p=d[k],k=d,d=p);return"function"!==typeof d||k instanceof RegExp?k:n.length?function(){return arguments.length?d.apply(k||this,n.concat(m.slice(arguments,0))):d.apply(k||this,n)}:function(){return arguments.length?d.apply(k||this,arguments):d.call(k||this)}}}});
hAzzle.define("Jiesa",function(){var m=hAzzle.require("util"),d=hAzzle.require("core"),k=hAzzle.require("collection"),n=hAzzle.require("types"),p=hAzzle.require("has"),g=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,a=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,b=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,l=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,r=/^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,q=/^\s*[+~]/,h=/[\n\t\r]/g,f={":enabled":function(a){return!1===a.disabled},":disabled":function(a){return!0===
a.disabled},":checked":function(a){var c=a.nodeName.toLowerCase();return"input"===c&&!!a.checked||"option"===c&&!!a.selected},":hidden":function(a){var c=a.style;return!c||"none"!==c.display&&"hidden"!==c.visibility?"hidden"===a.type:!0},":visible":function(a){return!f[":hidden"](a)}},e=function(a,c,f){var e=a,h=a.getAttribute("id"),d=h||"__hAzzle__",g=a.parentNode,k=q.test(c);if(k&&!g)return[];h?d=d.replace(/'/g,"\\$&"):a.setAttribute("id",d);k&&g&&(a=a.parentNode);c=c.match(b);for(g=0;g<c.length;g++)c[g]=
"[id='"+d+"'] "+c[g];c=c.join(",");try{return f.call(a,c)}finally{h||e.removeAttribute("id")}},c=function(a,c,b){return b&&9!==b.nodeType?e(b,c,function(c){return a.matches(c)}):a.matches(c)},v=function(a){return a?"string"===typeof a?t(a):!a.nodeType&&n.isArrayLike(a)?a[0]:a:document},t=function(c,b){var f,l,n,r,q=[];b=v(b);if(!c||"string"!==typeof c)return q;if(1!==(l=b.nodeType)&&9!==l&&11!==l)return[];if(d.isHTML){if(f=g.exec(c)){if(c=f[1]){if(9===l)return(n=b.getElementById(c))&&n.id===c?[n]:
[];if(b.ownerDocument&&(n=b.ownerDocument.getElementById(c))&&d.contains(b,n)&&n.id===f)return[n]}else if(c=f[2])r=b.getElementsByClassName(c);else if(c=f[3])r=b.getElementsByTagName(c);return k.slice(r)}if(f=a.exec(c)){l=b.getElementsByTagName(f[1]);var t=f[2],u=f[3];m.each(l,function(a){var c;(c=a.id===t)||(c=p.has("classList")?a.classList.contains(u):0<=(" "+a.className+" ").replace(h," ").indexOf(u));c&&q.push(a)});return q}}if(d.qsa&&(!d.QSABugs||!d.QSABugs.test(c)))try{return r=1===b.nodeType?
e(b,c,b.querySelectorAll):b.querySelectorAll(c),k.slice(r)}catch(E){}},u=function(a,b,e){if(b.nodeType)return a===b;(a.ownerDocument||a)!==document&&d.setDocument(a);b="string"===typeof b?b.replace(l,"='$1']"):b;if(b instanceof hAzzle)return m.some(b.elements,function(c){return u(a,c)});if(a===document)return!1;var h=r.exec(b);if(h)return h[1]&&(h[1]=h[1].toLowerCase()),h[3]&&(h[3]=h[3].split("=")),h[4]&&(h[4]=" "+h[4]+" "),(!h[1]||a.nodeName.toLowerCase()===h[1])&&(!h[2]||a.id===h[2])&&(!h[3]||(h[3][1]?
a.getAttribute(h[3][0])===h[3][1]:a.hasAttribute(h[3][0])))&&(!h[4]||0<=(" "+a.className+" ").indexOf(h[4]));if(h=f[b])return!!h(a);if(!d.matches||!d.isHTML||d.rbuggyMatches&&d.rbuggyMatches.test(b)||d.QSABugs&&d.QSABugs.test(b))hAzzle.err(!0,23," jiesa.js module need to be installed");else try{var g=c(a,b,e);if(g||d.disconMatch||a.document&&11!==a.document.nodeType)return g}catch(k){}};this.find=function(a,c,b){if(!b){if("string"!==typeof a){var f=0,e=this.length,h=this.elements;return hAzzle(m.filter(hAzzle(a).elements,
function(a){for(;f<e;f++)if(d.contains(h[f],a))return!0}))}return m.reduce(this.elements,function(c,b){return hAzzle(c.concat(k.slice(t(a,b))))},[])}return t(a,c)};this.filter=function(a,c){if(void 0===a)return this;if("function"===typeof a){var b=[];this.each(function(c,f){a.call(c,f)&&b.push(c)});return hAzzle(b)}return this.filter(function(){return u(this,a)!==(c||!1)})};return{matchesSelector:c,matches:u,pseudos:f,find:t}});
hAzzle.define("Strings",function(){var m=/[A-Z]/g,d=/([\:\-\_]+(.))/g,k=/^moz([A-Z])/,n=[],p=function(a,b,d,g){return g?d.toUpperCase():d},g=function(a){return"-"+a.charAt(0).toLowerCase()};return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(m,g):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():
a},camelize:function(a){return n[a]?n[a]:n[a]=a.replace(d,p).replace(k,"Moz$1")},trim:function(a){return"string"===typeof a?a.trim():a},lowercase:function(a){return"string"===typeof a?a.toLowerCase():a},uppercase:function(a){return"string"===typeof a?a.toUpperCase():a}}});
hAzzle.define("storage",function(){var m=hAzzle.require("util"),d=hAzzle.require("strings"),k=hAzzle.require("types"),n=hAzzle.require("core"),p=d.camelize,g=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,a=/([A-Z])/g,b=/\S+/g,l=function(b,f,e){if(void 0===e&&1===b.nodeType)if(e="data-"+f.replace(a,"-$1").toLowerCase(),e=b.getAttribute(e),"string"===typeof e){try{e="true"===e?!0:"false"===e?!1:"null"===e?null:+e+""===e?+e:g.test(e)?JSON.parse(e+""):e}catch(c){}q.set(b,f,e)}else e=void 0;return e},d=function(){this.expando=
n.expando+Math.random()};d.prototype={constructor:d,register:function(a,b){hAzzle.err(!k.isObject(a),22,"no valid DOM element in storage.js");a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperty(a,this.expando,{value:b||{},writable:!0,configurable:!0});return a[this.expando]},cache:function(a,b){if(!a||1!==a.nodeType&&9!==a.nodeType&&+a.nodeType)return{};var e=a[this.expando];return e?e:this.register(a,b)},set:function(a,b,e){if(a){var c;if(a=this.cache(a)){if("string"===typeof b)a[b]=e;
else if(k.isEmptyObject(a))m.mixin(a,b);else for(c in b)a[c]=b[c];return a}}},access:function(a,b,e){if(void 0===b||b&&"string"===typeof b&&void 0===e)return e=this.get(a,b),void 0!==e?e:this.get(a,p(b));this.set(a,b,e);return void 0!==e?e:b},get:function(a,b){var e=this.cache(a);if(e)return void 0!==e&&void 0===b?e:e[b]},release:function(a,f){var e,c,d=this.cache(a);if(void 0===f)this.register(a);else for(k.isArray(f)?c=f.concat(f.map(p)):(e=p(f),f in d?c=[f,e]:(c=e,c=d[c]?[c]:c.match(b)||[])),e=
c.length;e--;)delete d[c[e]]},hasData:function(a){return!k.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var r=new d,q=new d;this.data=function(a,b){var e,c,d,g=this.elements[0],k=g&&g.attributes;if(void 0===a){if(this.length&&(d=q.get(g),1===g.nodeType&&!r.get(g,"hasDataAttrs"))){for(e=k.length;e--;)k[e]&&(c=k[e].name,0===c.indexOf("data-")&&(c=p(c.slice(5)),l(g,c,d[c])));r.set(g,"hasDataAttrs",!0)}return d}if("object"===typeof a)return this.each(function(c){q.set(c,
a)});var m=p(a);if(g&&void 0===b){d=q.get(g,a);if(void 0!==d)return d;d=q.get(g,m);var n=r.get(this,"hasDataAttrs"),x=-1!==a.indexOf("-");if(void 0!==d)return d;d=l(g,m,void 0);if(void 0!==d)return d}else this.each(function(c){var e=q.get(c,m);q.set(c,m,b);x&&void 0!==e&&q.set(c,a,b);x&&void 0===n&&q.set(c,a,b)})};this.removeData=function(a){return this.each(function(b){q.release(b,a)})};return{"private":r,data:q}});
hAzzle.define("css",function(){var m=hAzzle.require("storage"),d=hAzzle.require("has"),k="b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img mapobject q script span sub button input label select textarea".split(" "),n=/^(-?[\d+\.\-]+)([a-z]+|%)$/i,p=document.documentElement,g,a={},b=function(a){if(a&&a.nodeType&&null!==a.ownerDocument){var b=!1;return a||a.elements?a?(void 0!==a.ownerDocument&&(b=a.ownerDocument.defaultView),b&&b.opener?b.getComputedStyle(a,null):window.getComputedStyle(a,
null)):a.style:void 0}return""},l=function(a){if(a)return void 0===m["private"].get(a,"css")&&m["private"].access(a,"css",{computedStyle:null}),m["private"].get(a,"css")},r=function(a){return!a||void 0!==l(a).computedStyle&&null!=l(a).computedStyle?l(a).computedStyle:l(a).computedStyle=b(a)},q=function(a){return parseFloat(a)||0},h=function(a){if(a){a=a.tagName.toLowerCase();if(a in k)return"inline";if("li"===a)return"list-item";if("tr"===a)return"table-row";if("table"===a)return"table"}return"block"},
f=function(a,b,k){if(null!==a&&void 0!==a&&(a=null!=a&&a instanceof hAzzle?a.elements:a.length?a[0]:a,!a||!a.elements)){var l=0,m=["paddingTop","paddingBottom","borderTop","borderBottom"],p=4;"width"!==b&&"height"!==b||0!==f(a,"display")||(a.style.display="none",a.style.display=h(a));if(!k||void 0===k){if("height"===b&&"border-box"!==f(a,"boxSizing"))return a.offsetHeight-q(f(a,"borderTopWidth"))-q(f(a,"borderBottomWidth"))-q(f(a,"paddingTop"))-q(f(a,"paddingBottom"))+"px";if("width"===b&&"border-box"!==
f(a,"boxSizing"))return a.offsetWidth-q(f(a,"borderLeftWidth"))-q(f(a,"borderRightWidth"))-q(f(a,"paddingLeft"))-q(f(a,"paddingRight"))+"px"}k=r(a);"fontSize"===b?l=e(a,"1em","left",1)+"px":k&&((d.ie||d.has("firefox"))&&"borderColor"===b&&(b="borderTopColor"),l=9===d.ie&&"filter"===b?k.getPropertyValue(b):k[b],""!==l||hAzzle.require("Core").contains(a.ownerDocument,a)||(l=a.style[b]));if(l){k=(l.match(n)||[])[2];if("%"===k&&g)if("top"===b||"bottom"===b){for(a=(b=a.parentNode||a).offsetHeight;p--;)a-=
parseFloat(f(b,m[p]));l=parseFloat(l)/100*a+"px"}else l=e(a,l);if("auto"===l||k&&"px"!==k)l=0}return void 0!==l?l+"":l}},e=function(b,e,d,g){d=d||"width";var h;h=(e.match(n)||[])[2];var k="px"===h?1:a[h+"toPx"],l=/r?em/i;k||l.test(h)&&!g?(b=k?b:"rem"===h?p:"fontSize"===d?b.parentNode||b:b,k=k||parseFloat(f(b,"fontSize"),!0),b=parseFloat(e)*k):(g=b.style,h=g[d],g[d]=e,b=g[d]?parseFloat(f(b,d,!0)):0,g[d]=void 0!==h?h:null);return b};(function(){var c=[1/25.4,1/2.54,1/72,1/6],f="mm cm pt pc in mozmm".split(" "),
d=f.length,h=document.createElement("div");p.appendChild(h);h.style.marginTop="1%";for(g="1%"===b(h).marginTop;d--;)a[f[d]+"toPx"]=c[d]?c[d]*a.inToPx:e(h,"1"+f[d]);p.removeChild(h)})();return{computed:l,display:h,styles:r,toPx:e,css:f}});
hAzzle.define("setters",function(){var m=hAzzle.require("util"),d=hAzzle.require("core"),k=hAzzle.require("has"),n=hAzzle.require("types"),p=/\S+/g,g=/\r/g,a=0,b,l="multiple selected checked disabled readOnly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readOnly type accesskey dropzone spellcheck isMap loop scoped open".split(" "),r="input select option textarea button form details".split(" "),
q="cellPadding cellSpacing maxLength rowSpan accessKey colSpan useMap frameBorder contentEditable textContent valueType tabIndex encType longDesc dateTime readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),h="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2",f={},e={},c="className",v="for";(function(){var a=document.createElement("div");a.setAttribute("class","x");"x"===a.className&&(c="class")})();(function(){var a=document.createElement("label");
a.setAttribute(v,"x");"x"!==a.htmlFor&&(a.setAttribute("htmlFor","x"),"x"===a.htmlFor&&(v="htmlFor"))})();alert(c);var t={"class":c,className:c,"for":v,htmlFor:v},u={get:{},set:{}},s={get:{},set:{}},w={get:{},set:{}},x={get:{},set:{}},A=function(a){return a instanceof hAzzle?a.elements[0]:a.length?a[0]:a},C={1:1,4:1,5:1,6:1,7:1,9:1,10:1,11:1,12:1},D=function(a,b){var c=f[b.toLowerCase()];return c&&e[a.nodeName]&&c},B=function(a,b){a=A(a);var c,e,f=0,d=b&&b.match(p);if(d&&1===a.nodeType)for(;c=d[f++];)e=
t[c]||c,D(a,c)?a[e]=!1:a.removeAttribute(c),a.removeAttribute(c)},z=function(a,b,c){var e=(a=A(a))?a.nodeType:void 0,f,g;if(a&&C[a.nodeType]){if("undefined"===typeof a.getAttribute)return y(a,b,c);1===e&&d.isXML(a)||(b=b.toLowerCase(),f=s["undefined"===c?"get":"set"][b]||D(a,b)?x["undefined"===c?"get":"set"][b]:!1);if(void 0===c){if(f&&(g=f.get(a,b))&&null!==g)return g;g=a.getAttribute(b,2);return null==g?void 0:g}if(c){if(f&&void 0!==(g=f.set(a,c,b)))return g;a.setAttribute(b,c+"")}else B(a,b)}return""},
y=function(a,b,c){var f=(a=A(a))?a.nodeType:void 0,e,g;if(a&&C[a.nodeType]){if(1!==f||d.isHTML)b=t[b]||b,e="undefined"===c?u.get[b]:u.set[b];return"undefined"!==typeof c?e&&void 0!==(g=e.set(a,c,b))?g:a[b]=c:e&&null!==(g=e(a,b))?g:a[b]}return""};this.val=function(a){var b,c,e;c=this.elements[0];if(arguments.length)return e=n.isType("Function")(a),this.each(function(c,f){var d;1===c.nodeType&&(d=e?a.call(c,f,hAzzle(c).val()):a,null==d?d="":"number"===typeof d?d+="":n.isArray(d)&&(d=m.map(d,function(a){return null==
a?"":a+""})),b=w.set[c.type]||w.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,d,"value")||(c.value=d))});if(c){if(b=w.get[c.type]||w.get[c.nodeName.toLowerCase()])return b(c,"value");c=c.value;return"string"===typeof c?c.replace(g,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){m.each(a,function(a,c){y(b,c,a)})});if("undefined"===typeof b)return y(c[0],a);this.each(c,function(c){y(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,
!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[t[a]||a]})};this.removeAttr=function(a){return this.each(function(b){B(b,a)})};for(this.attr=function(a,b){return"object"===typeof a?this.each(function(b){m.each(a,function(a,c){z(b,c,a)})}):"undefined"===typeof b?z(this.elements[0],a):this.each(function(c){z(c,a,b)})};b=l[a];a++)f[b.toLowerCase()]=b;for(a=0;b=r[a];a++)e[b]=!0;for(a=0;b=q[a];a++)t[b.toLowerCase()]=b;return{attrHooks:s,propHooks:u,valHooks:w,nodeHooks:x,
propMap:t,boolAttr:f,boolElem:e,removeAttr:B,SVGAttr:function(a){if(k.ie||k.has("android")&&!k.has("chrome"))h+="|transform";return(new RegExp("^("+h+")$","i")).test(a)},attr:z,prop:y}});
hAzzle.define("attrHooks",function(){var m=hAzzle.require("util"),d=hAzzle.require("setters"),k=function(){var d=document.createElement("input");d.type="checkbox";d=document.createElement("input");d.value="t";d.type="radio";return"t"===d.value}();m.mixin(d.attrHooks.set,{type:function(d,p){if(!k&&"radio"===p&&m.nodeName(d,"input")){var g=d.value;d.setAttribute("type",p);g&&(d.value=g);return p}}});return{}});
hAzzle.define("prophooks",function(){var m=hAzzle.require("setters");hAzzle.require("util").mixin(m.propHooks.get,{tabIndex:function(d){return d.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(d.nodeName)||d.href?d.tabIndex:-1}});(function(){document.createElement("select").appendChild(document.createElement("option")).selected||(m.propHooks.get.selected=function(d){(d=d.parentNode)&&d.parentNode&&d.parentNode.selectedIndex;return null})})();return{}});
hAzzle.define("valHooks",function(){var m=hAzzle.require("util"),d=hAzzle.require("strings"),k=hAzzle.require("text"),n=hAzzle.require("types"),p=hAzzle.require("collection"),g=hAzzle.require("setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}();m.mixin(g.valHooks.set,{select:function(a,d){for(var g,k,h=a.options,f=p.makeArray(d),e=h.length;e--;)if(k=h[e],k.selected=f.contains(k.value))g=!0;g||(a.selectedIndex=
-1);return f}});m.mixin(g.valHooks.get,{type:function(a){return a.getAttribute("type")||a.type},option:function(a){var g=a.getAttribute(name,2);return null!==g?g:d.trim(k.getText(a))},select:function(a){alert("");var d=a.selectedIndex,g="select-one"===a.type;a=a.options;var k=[],h,f,e;if(0>d)return"";e=g?d:0;for(f=g?d+1:a.length;e<f;e++)if(h=a[e],h.selected&&null===h.getAttribute("disabled")&&(!h.parentElement.disabled||"OPTGROUP"!==h.parentElement.tagName)){h=hAzzle(h).val();if(g)return h;k.push(h)}return g&&
!k.length&&a.length?a[d].value:k}});m.each(["radio","checkbox"],function(a){g.valHooks.set[a]=function(a,b){if(n.isArray(b))return a.checked=b.contains(hAzzle(a).val())}});a||(g.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(m){function d(a){return"string"===typeof a?m.document.createTextNode(a):a}function k(a){var b=m.document.createDocumentFragment(),g=p.call(a,0),f=0,e=a.length;if(1===a.length)return d(a[0]);for(;f<e;f++)try{b.appendChild(d(g[f]))}catch(c){}return b}for(var n=Array.prototype,p=n.slice,g=n.indexOf,n=(m.Element||m.Node||m.HTMLElement).prototype,a=["append",function(){try{this.appendChild(k(arguments))}catch(a){}},"prepend",function(){try{this.firstChild?this.insertBefore(k(arguments),this.firstChild):
this.appendChild(k(arguments))}catch(a){}},"before",function(){var a=this.parentElement;a&&a.insertBefore(k(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(k(arguments),this.nextSibling):this.parentElement.appendChild(k(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(k(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",n.matchesSelector||n.webkitMatchesSelector||
n.mozMatchesSelector||n.msMatchesSelector||function(a){var b=this.parentElement;return!!b&&-1<g.call(b.querySelectorAll(a),this)}],b=a.length;b;b-=2)n[a[b-2]]||(n[a[b-2]]=a[b-1]);try{new m.CustomEvent("?")}catch(l){m.CustomEvent=function(a,b){function d(a,b,c,g){this.initEvent(a,b,c);this.detail=g}return function(f,e){var c=document.createEvent(a);if("string"!==typeof f)throw Error("An event name must be provided");"Event"===a&&(c.initCustomEvent=d);null==e&&(e=b);c.initCustomEvent(f,e.bubbles,e.cancelable,
e.detail);return c}}(m.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}[].contains||Object.defineProperty(Array.prototype,"contains",{enumerable:!1,configurable:!0,writable:!0,value:function(a,b){if(void 0===this||null===this)throw new TypeError("Cannot convert this value to object");var d=Object(this),f=parseInt(d.length)||0;if(1>f)return!1;var e=Math.floor(b||0);if(e>=f||4294967295<e)return!1;0>e&&(e=f+e);if(-Infinity===e||0>e)e=0;0<=e||(e=f+Math.abs(e),0>e&&(e=0));for(;e<
f;){var c=d[e];if(a===c||a!==a&&c!==c)return!0;e+=1}return!1}})})(window);