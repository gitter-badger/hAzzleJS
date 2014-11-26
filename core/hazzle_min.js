/*!
 * hAzzle Javascript Library
 * Copyright (c) 2014 Kenny Flashlight
 *
 * Version: 1.0.2d
 * Released under the MIT License.
 *
 * Date: 2014-11-27
 */
(function(){var g=function(a,d){if(!a)return this;if(!(this instanceof g))return new g(a,d);if(a instanceof g)return a;if("string"===typeof a)this.elements=h.manipulation&&"<"===a[0]&&">"===a[a.length-1]&&3<=a.length?p("manipulation").create(a,d&&d.nodeType?d.ownerDocument||d:document):this.find(a,d,!0);else if(Array.isArray(a)){var r=p("Util");this.elements=r.unique(r.filter(a,l))}else if(p("types").isNodeList(a))r=p("Util"),this.elements=r.filter(r.makeArray(a),l);else{if(a.nodeType)return this.elements=
11===a.nodeType?a.children:[a],this.length=1,this;if(a===window)this.elements=[a];else if("function"===typeof a){if(h.ready)return p("ready").ready(a);m(!0,6,"ready.js module not installed")}else return this.elements=[],this.length=0,this}this.elements?this.length=this.elements.length:(this.elements=[],this.length=0);return this},d={},h=g.installed={};g.version="1.0.2d";var m=g.err=function(a,d,g){if(a)throw Error("[hAzzle-"+d+"] "+g);},p=g.require=function(a){if(a&&"string"===typeof a)return d[a.toLowerCase()]};
g.define=function(a,n){"string"!==typeof a||"function"!==typeof n||d[a]||(h[a.toLowerCase()]=!0,d[a.toLowerCase()]=n.call(g.prototype))};var l=function(a){return a&&(1===a.nodeType||9===a.nodeType)},a=window.hAzzle;g.noConflict=function(){window.hAzzle===g&&(window.hAzzle=a);return window};window.hAzzle=g})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var g=navigator.userAgent,d=window,h=d.document,m=h.createElement("div"),p=Object.prototype.toString,l={},a=function(){if(h.documentMode)return h.documentMode;for(var a=7,q;4<a;a--)if(q=h.createElement("div"),q.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e",q.getElementsByTagName("span").length)return a}(),b=function(a){return"function"===typeof l[a]?l[a]=l[a](d,h,m):l[a]},n=function(a,q,k,e){("undefined"===typeof l[a]||e)&&(l[a]=q);return k&&b(a)};n("mobile",
/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(g));n("android",/^Android/i.test(g));n("opera","[object Opera]"===p.call(window.opera));n("firefox","undefined"!==typeof InstallTrigger);n("chrome",d.chrome);n("webkit","WebkitAppearance"in h.documentElement.style);n("safari",0<p.call(window.HTMLElement).indexOf("Constructor"));n("ie",function(){return!!h.documentMode});n("mac",0<=navigator.appVersion.indexOf("Macintosh"));n("classlist",!!document.documentElement.classList);n("quirks",
"BackCompat"===document.compatMode);n("xpath",!!h.evaluate);n("air",!!d.runtime);n("dart",!(!d.startDart&&!h.startDart));n("promise",!!d.Promise);n("audio",!!("webkitAudioContext"in window||"AudioContext"in window));n("qsa",!!document.querySelectorAll);return{has:b,add:n,cache:l,clear:function(a){a.innerHTML="";return a},ie:a}});
hAzzle.define("Types",function(){var g=Object.prototype.toString,d=Array.isArray,h=function(a){return"string"===typeof a},m=function(a){return"number"===typeof a},p=function(a){return a&&a.window===a},l=function(a){return a?function(b){return g.call(b)==="[object "+a+"]"}:function(){}};return{isType:l,isArray:d,isEmpty:function(a){if(null==a)return!0;if(d(a)||h(a)||l("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:p,
isObject:function(a){return null!==a&&"object"===typeof a},isPlainObject:function(a){return l("Object")(a)&&!p(a)&&Object.getPrototypeOf(a)===Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},isNode:function(a){return!!a&&"object"===typeof a&&"nodeType"in a},isElement:function(a){return!(!a||!a.nodeName)},isString:h,isArrayLike:function(a){if(null==a||p(a))return!1;var b=a.length;return 1===a.nodeType&&b?!0:h(a)||d(a)||0===b||"number"===typeof b&&0<b&&b-1 in a},isNumber:m,
isBoolean:function(a){return"boolean"===typeof a},isNaN:function(a){return m(a)&&a!=+a},isSVGElem:function(a){return 1===a.nodeType&&"http://www.w3.org/2000/svg"===a.namespaceURI||window.SVGElement&&a instanceof window.SVGElement},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b||"[object HTMLFormControlsCollection]"===b)return!0;
if(!("length"in a&&"item"in a))return!1;try{if(null===a(0)||a(0)&&a(0).tagName)return!0}catch(d){}return!1},isFunction:l("Function")}});hAzzle.define("text",function(){var g=function(d){var h,m="",p=0;h=d.nodeType;if(!h)for(;h=d[p++];)m+=g(h);else if(1===h||9===h||11===h){if("string"===typeof d.textContent)return d.textContent;for(d=d.firstChild;d;d=d.nextSibling)m+=g(d)}else if(3===h||4===h)return d.nodeValue;return m};return{getText:g}});
hAzzle.define("util",function(){var g=hAzzle.require("types"),d=Object.keys,h=function(a,k,e,f){var c,b;if(e)if("function"===typeof a)for(c in a){if("prototype"!==c&&"length"!==c&&"name"!==c&&!1===k.call(a[c],a[c],c,e))break}else if(g.isArrayLike(a))for(;c<b&&(c=f?a.length-c-1:c,!1!==k.apply(a[c],e));c++);else for(c in a){if(!1===k.apply(a[c],e))break}else if(a)if("function"===typeof a)for(c in a){if("prototype"!==c&&"length"!==c&&"name"!==c&&!1===k.call(a[c],a[c],c))break}else if(g.isArray(a)||g.isArrayLike(a))for(c=
0,b=a.length;c<b&&(c=f?a.length-c-1:c,!1!==k.call(a[c],a[c],c));c++);else for(c in a)if(!1===k.call(a[c],a[c],c))break;return a},m=function(a,k,e){if("function"===typeof a){if(void 0===k)return a;e=e?e:3;return 1===e?function(f){return a.call(k,f)}:2===e?function(f,c){return a.call(k,f,c)}:3===e?function(f,c,e){return a.call(k,f,c,e)}:4===e?function(f,c,e,b){return a.call(k,f,c,e,b)}:function(){return a.apply(k,arguments)}}if(!a)return function(a){return a}},p=function(){for(var a,k,e,f,c=arguments[0],
b=1,d=arguments.length;b<d;b++)if(null!==(a=arguments[b]))for(k in a)e=c[k],f=a[k],c!==f&&(f&&g.isObject(f)?(e=e&&g.isObject(e)?e:{},c[k]=p(e,f)):void 0!==f&&(c[k]=f));return c},l=function(b,k,e){return b?"function"===typeof b?m(b,k,e):g.isObject(b)?a(b):n(b):function(a){return a}},a=function(a){var k=b(a),e=k.length;return function(a){if(!a)return!e;a=Object(a);for(var c=0,b,q;c<e;c++)if(b=k[c],q=b[0],b[1]!==a[q]||!(q in a))return!1;return!0}},b=function(a){for(var k=d(a),e=k.length,f=Array(e),c=
0;c<e;c++)f[c]=[k[c],a[k[c]]];return f},n=function(a){return function(k){return k[a]}},r=function(a,k,e){if(null==a)return-1;var f=0,c=a.length;if(e)if("number"===typeof e)f=0>e?Math.max(0,c+e):e;else{e=l(void 0,void 0,1);for(var f=e(k),c=0,b=a.length;c<b;){var d=c+b>>>1;e(a[d])<f?c=d+1:b=d}f=c;return a[f]===k?f:-1}for(;f<c;f++)if(a[f]===k)return f;return-1};return{map:function(a,k,e){if(a){k=l(k,e);e=a.length!==+a.length&&d(a);for(var f=(e||a).length,c=Array(f),b,g=0;g<f;g++)b=e?e[g]:g,c[g]=k.call(a[b],
a[b],b,a);return c}return[]},some:function(a,b,e){if(a){b=l(b,e);for(var f=a.length!==+a.length&&d(a),c=0,g;c<e;c++)if(g=f?f[c]:c,b(a[g],g,a))return!0}return!1},reduce:function(a,b,e,f){a&&(a=[]);b=m(b,f,4);var c=a.length!==+a.length&&d(a),g=(c||a).length,h=0,n;3>arguments.length&&(hAzzle.err(!g,7," no collection length exist in collection.reduce()"),e=a[c?c[h++]:h++]);for(;h<g;h++)n=c?c[h]:h,e=b(e,a[n],n,a);return e},each:h,mixin:p,makeArray:function(a){if(g.isArray(a))return a;for(var b=-1,e=a.length,
f=Array(e);++b<e;)f[b]=a[b];return f},merge:function(a,b){for(var e=+b.length,f=0,c=a.length;f<e;f++)a[c++]=b[f];a.length=c;return a},nodeName:function(a,b){return b&&a&&a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},unique:function(a,b,e,f){if(!a)return[];g.isBoolean(b)&&(f=e,e=b,b=!1);void 0!==e&&(e=l(e,f));f=[];for(var c=[],d=0,h,n=a.length;d<n;d++)if(h=a[d],b)d&&c===h||f.push(h),c=h;else if(e){var t=e(h,d,a);0>r(c,t)&&(c.push(t),f.push(h))}else 0>r(f,h)&&f.push(h);return f},indexOf:r,
filter:function(a,b,e){var f=[];if(!a)return f;b=l(b,e);h(a,function(a,e,d){b(a,e,d)&&f.push(a)});return f},now:Date.now}});
hAzzle.define("Core",function(){var g=1,d=window.document,h=window.document,m="hAzzle_"+1*new Date,p,l,a=Array.prototype.indexOf,b={},n,r=d.createElement("div").compareDocumentPosition(d.createElement("div"))&1,q,k=function(){return!!q},e=function(a,c){a===c&&(q=!0);return 0},f=m.split("").sort(e).join("")===m,c=function(a,c){var b=c&&a,e=b&&1===a.nodeType&&1===c.nodeType&&(~c.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(e)return e;if(b)for(;b=b.nextSibling;)if(b===c)return-1;return a?
1:-1},v=function(a){return/^[^{]+\{\s*\[native \w/.test(""+a)},s=function(a){var c,e,f,k;p=a=a.ownerDocument||a;c=a.documentElement;if(9!==p.nodeType||!p.documentElement)return d;d=a;if(e=c.getAttribute("__hAzzle"))return l=b[e];c.setAttribute("__hAzzle",g);l={id:++g};l.qsa=v(a.querySelectorAll);l.compare=v(c.compareDocumentPosition);l.contains=v(c.contains);l.QSABugs=f=[];l.matchesBugs=k=[];l.qsa&&(e=a.createElement("div"),e.appendChild(a.createElement("select")),(a=a.createElement("option")).setAttribute("selected",
""),e.firstChild.appendChild(a),e.querySelectorAll(":checked").length||f.push(":checked"),l.QSABugs=f.length&&new RegExp(f.join("|")));v(c=c.webkitMatchesSelector||c.mozMatchesSelector||c.oMatchesSelector||c.msMatchesSelector)&&(l.matchesSelector=c,l.disconMatch=c.call(e,"div"),l.matchesBugs=k.length&&new RegExp(k.join("|")));b[g]=l;return b[g]};s(d);var u=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},t=l.compare&&l.contains?function(a,c){var b=9===a.nodeType?
a.documentElement:a,e=c&&c.parentElement;return a===e||!!(e&&1===e.nodeType&&(b.contains?b.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentElement;)if(c===a)return!0;return!1},e=l.compare?function(c,b){if(c===b)return q=!0,0;var e=!c.compareDocumentPosition-!b.compareDocumentPosition;if(e)return e;e=(c.ownerDocument||c)===(b.ownerDocument||b)?c.compareDocumentPosition(b):1;return e&1||!r&&b.compareDocumentPosition(c)===e?c===p||c.ownerDocument===
h&&t(h,c)?-1:b===p||b.ownerDocument===h&&t(h,b)?1:n?a(n,c)-a(n,b):0:e&4?-1:1}:function(b,e){if(b===e)return q=!0,0;var f,d=0,k=b.parentNode,g=e.parentNode,t=[b],l=[e];if(!k||!g)return b===f?-1:e===f?1:k?-1:g?1:n?a(n,b)-a(n,e):0;if(k===g)return c(b,e);for(f=b;f=f.parentNode;)t.unshift(f);for(f=e;f=f.parentNode;)l.unshift(f);for(;t[d]===l[d];)d++;return d?c(t[d],l[d]):t[d]===h?-1:l[d]===h?1:0};return{environment:l,expando:m,addFeature:function(a,c){"string"===typeof a&&c&&(b[g][a]=c)},setDocument:s,
isXML:u,isHTML:!u(d),contains:t,unique:function(a){var c,b=[],d=0,g=0;q=!k;n=!f&&a.slice(0);a.sort(e);if(q){for(;c=a[g++];)c===a[g]&&(d=b.push(g));for(;d--;)a.splice(b[d],1)}n=null;return a},matches:l.matchesSelector,qsa:l.qsa,QSABugs:l.QSABugs,matchesBugs:l.matchesBugs}});
hAzzle.define("Collection",function(){var g=hAzzle.require("util"),d=hAzzle.require("types"),h=Array.prototype,m=h.concat,p=h.push,l=function(a,b,d){b="undefined"===typeof b?0:b;var g=-1;d=("undefined"===typeof d?a?a.length:0:d)-b||0;for(var h=Array(0>d?0:d);++g<d;)h[g]=a[b+g];return h};this.toJqueryZepto=function(){for(var a=this.length;a--;)this[a]=this.elements[a];return this};this.get=function(a){return void 0===a?l(a,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=function(a){var b=
this.length;a=+a+(0>a?b:0);return hAzzle(0<=a&&a<b?[this.elements[a]]:[])};this.reduce=function(a,b,d){return g.reduce(this.elements,a,b,d)};this.indexOf=function(a,b,d){return null==b?-1:h.indexOf.call(b,a,d)};this.map=function(a,b){return hAzzle(g.map(this.elements,a,b))};this.each=function(a,b,d){g.each(this.elements,a,b,d);return this};this.slice=function(a,b){return hAzzle(l(this.elements,a,b))};this.concat=function(){var a=g.map(l(arguments),function(a){return a instanceof hAzzle?a.elements:
a});return hAzzle(m.apply(this.elements,a))};this.contents=function(){return this.map(function(){return this.contentDocument||l(this.childNodes)||[]})};this.is=function(a){return a?0<this.length&&0<this.filter(a).length:!1};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var b=this.elements;return a?"string"===typeof a?g.indexOf(hAzzle(a).elements,b[0]):g.indexOf(b,a instanceof hAzzle?a.elements[0]:a):b[0]&&b[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,
b){return this.concat("string"===typeof a?hAzzle(a,b).elements:a)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.next=function(a){return this.map(function(){return this.nextElementSibling}).filter(a)};this.prev=function(a){return this.map(function(){return this.previousElementSibling}).filter(a)};this.prevAll=function(){var a=[];this.each(function(b){for(;(b=b.previousElementSibling)&&9!==b.nodeType;)a.push(b)});
return hAzzle(a)};this.nextAll=function(){var a=[];this.each(function(b){for(;(b=b.nextElementSibling)&&9!==b.nodeType;)a.push(b)});return hAzzle(a)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};this.shift=function(){return this.elements.shift.apply(this.elements,arguments)};this.lastIndexOf=function(){return this.elements.lastIndexOf.apply(this.elements,arguments)};this.reduceRight=function(){return this.elements.rediceRight.apply(this.elements,
arguments)};this.forEach=function(){return this.elements.forEach.apply(this.elements,arguments)};this.splice=function(){return this.elements.splice.apply(this.elements,arguments)};return{makeArray:function(a,b){var h=b||[];void 0!==a&&(d.isArrayLike(Object(a))?g.merge(h,d.isString(a)?[a]:a):p.call(h,a));return h},slice:l}});
Function.prototype.bind=function(){var g=this,d=Array.prototype.slice,h=g,m=d.call(arguments),p=m.shift(),l=function(){return h.apply(p,m.concat(d.call(arguments,m.length)))};l.bind=function(){var a=d.call(arguments);return Function.prototype.bind.apply(g,a)};return l};
hAzzle.define("bind",function(){var g=hAzzle.require("collection");return{bind:function(d,h){var m=2<arguments.length?g.slice(arguments,2):[],p;"string"===typeof h&&(p=d[h],h=d,d=p);return"function"!==typeof d||h instanceof RegExp?h:m.length?function(){return arguments.length?d.apply(h||this,m.concat(g.slice(arguments,0))):d.apply(h||this,m)}:function(){return arguments.length?d.apply(h||this,arguments):d.call(h||this)}}}});
hAzzle.define("Jiesa",function(){var g=hAzzle.require("util"),d=hAzzle.require("core"),h=hAzzle.require("collection"),m=hAzzle.require("types"),p=hAzzle.require("has"),l=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,a=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,b=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,n=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,r=/^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,q=/^\s*[+~]/,k=/[\n\t\r]/g,e={":enabled":function(a){return!1===a.disabled},":disabled":function(a){return!0===
a.disabled},":checked":function(a){var c=a.nodeName.toLowerCase();return"input"===c&&!!a.checked||"option"===c&&!!a.selected},":hidden":function(a){var c=a.style;return!c||"none"!==c.display&&"hidden"!==c.visibility?"hidden"===a.type:!0},":visible":function(a){return!e[":hidden"](a)}},f=function(a,c,e){var f=a,d=a.getAttribute("id"),k=d||"__hAzzle__",g=a.parentNode,h=q.test(c);if(h&&!g)return[];d?k=k.replace(/'/g,"\\$&"):a.setAttribute("id",k);h&&g&&(a=a.parentNode);c=c.match(b);for(g=0;g<c.length;g++)c[g]=
"[id='"+k+"'] "+c[g];c=c.join(",");try{return e.call(a,c)}finally{d||f.removeAttribute("id")}},c=function(a,c,b){return b&&9!==b.nodeType?f(b,c,function(c){return a.matches(c)}):a.matches(c)},v=function(a){return a?"string"===typeof a?s(a):!a.nodeType&&m.isArrayLike(a)?a[0]:a:document},s=function(c,b){var e,n,m,r,q=[];b=v(b);if(!c||"string"!==typeof c)return q;if(1!==(n=b.nodeType)&&9!==n&&11!==n)return[];if(d.isHTML){if(e=l.exec(c)){if(c=e[1]){if(9===n)return(m=b.getElementById(c))&&m.id===c?[m]:
[];if(b.ownerDocument&&(m=b.ownerDocument.getElementById(c))&&d.contains(b,m)&&m.id===e)return[m]}else if(c=e[2])r=b.getElementsByClassName(c);else if(c=e[3])r=b.getElementsByTagName(c);return h.slice(r)}if(e=a.exec(c)){n=b.getElementsByTagName(e[1]);var s=e[2],u=e[3];g.each(n,function(a){var c;(c=a.id===s)||(c=p.has("classList")?a.classList.contains(u):0<=(" "+a.className+" ").replace(k," ").indexOf(u));c&&q.push(a)});return q}}if(d.qsa&&(!d.QSABugs||!d.QSABugs.test(c)))try{return r=1===b.nodeType?
f(b,c,b.querySelectorAll):b.querySelectorAll(c),h.slice(r)}catch(E){}},u=function(a,b,f){if(b.nodeType)return a===b;(a.ownerDocument||a)!==document&&d.setDocument(a);b="string"===typeof b?b.replace(n,"='$1']"):b;if(b instanceof hAzzle)return g.some(b.elements,function(c){return u(a,c)});if(a===document)return!1;var k=r.exec(b);if(k)return k[1]&&(k[1]=k[1].toLowerCase()),k[3]&&(k[3]=k[3].split("=")),k[4]&&(k[4]=" "+k[4]+" "),(!k[1]||a.nodeName.toLowerCase()===k[1])&&(!k[2]||a.id===k[2])&&(!k[3]||(k[3][1]?
a.getAttribute(k[3][0])===k[3][1]:a.hasAttribute(k[3][0])))&&(!k[4]||0<=(" "+a.className+" ").indexOf(k[4]));if(k=e[b])return!!k(a);if(!d.matches||!d.isHTML||d.rbuggyMatches&&d.rbuggyMatches.test(b)||d.QSABugs&&d.QSABugs.test(b))hAzzle.err(!0,23," jiesa.js module need to be installed");else try{var h=c(a,b,f);if(h||d.disconMatch||a.document&&11!==a.document.nodeType)return h}catch(l){}};this.find=function(a,c,b){if(!b){if("string"!==typeof a){var e=0,f=this.length,k=this.elements;return hAzzle(g.filter(hAzzle(a).elements,
function(a){for(;e<f;e++)if(d.contains(k[e],a))return!0}))}return g.reduce(this.elements,function(c,b){return hAzzle(c.concat(h.slice(s(a,b))))},[])}return s(a,c)};this.filter=function(a,c){if(void 0===a)return this;if("function"===typeof a){var b=[];this.each(function(c,e){a.call(c,e)&&b.push(c)});return hAzzle(b)}return this.filter(function(){return u(this,a)!==(c||!1)})};return{matchesSelector:c,matches:u,pseudos:e,find:s}});
hAzzle.define("Strings",function(){var g=/[A-Z]/g,d=/([\:\-\_]+(.))/g,h=/^moz([A-Z])/,m=[],p=function(a,b,d,g){return g?d.toUpperCase():d},l=function(a){return"-"+a.charAt(0).toLowerCase()};return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(g,l):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():
a},camelize:function(a){return m[a]?m[a]:m[a]=a.replace(d,p).replace(h,"Moz$1")},trim:function(a){return"string"===typeof a?a.trim():a},lowercase:function(a){return"string"===typeof a?a.toLowerCase():a},uppercase:function(a){return"string"===typeof a?a.toUpperCase():a}}});
hAzzle.define("storage",function(){var g=hAzzle.require("util"),d=hAzzle.require("strings"),h=hAzzle.require("types"),m=hAzzle.require("core"),p=d.camelize,l=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,a=/([A-Z])/g,b=/\S+/g,n=function(b,e,f){if(void 0===f&&1===b.nodeType)if(f="data-"+e.replace(a,"-$1").toLowerCase(),f=b.getAttribute(f),"string"===typeof f){try{f="true"===f?!0:"false"===f?!1:"null"===f?null:+f+""===f?+f:l.test(f)?JSON.parse(f+""):f}catch(c){}q.set(b,e,f)}else f=void 0;return f},d=function(){this.expando=
m.expando+Math.random()};d.prototype={constructor:d,register:function(a,b){hAzzle.err(!h.isObject(a),22,"no valid DOM element in storage.js");a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperty(a,this.expando,{value:b||{},writable:!0,configurable:!0});return a[this.expando]},cache:function(a,b){if(!a||1!==a.nodeType&&9!==a.nodeType&&+a.nodeType)return{};var f=a[this.expando];return f?f:this.register(a,b)},set:function(a,b,f){if(a){var c;if(a=this.cache(a)){if("string"===typeof b)a[b]=f;
else if(h.isEmptyObject(a))g.mixin(a,b);else for(c in b)a[c]=b[c];return a}}},access:function(a,b,f){if(void 0===b||b&&"string"===typeof b&&void 0===f)return f=this.get(a,b),void 0!==f?f:this.get(a,p(b));this.set(a,b,f);return void 0!==f?f:b},get:function(a,b){var f=this.cache(a);if(f)return void 0!==f&&void 0===b?f:f[b]},release:function(a,e){var f,c,d=this.cache(a);if(void 0===e)this.register(a);else for(h.isArray(e)?c=e.concat(e.map(p)):(f=p(e),e in d?c=[e,f]:(c=f,c=d[c]?[c]:c.match(b)||[])),f=
c.length;f--;)delete d[c[f]]},hasData:function(a){return!h.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var r=new d,q=new d;this.data=function(a,b){var f,c,d,g=this.elements[0],h=g&&g.attributes;if(void 0===a){if(this.length&&(d=q.get(g),1===g.nodeType&&!r.get(g,"hasDataAttrs"))){for(f=h.length;f--;)h[f]&&(c=h[f].name,0===c.indexOf("data-")&&(c=p(c.slice(5)),n(g,c,d[c])));r.set(g,"hasDataAttrs",!0)}return d}if("object"===typeof a)return this.each(function(c){q.set(c,
a)});var l=p(a);if(g&&void 0===b){d=q.get(g,a);if(void 0!==d)return d;d=q.get(g,l);var m=r.get(this,"hasDataAttrs"),x=-1!==a.indexOf("-");if(void 0!==d)return d;d=n(g,l,void 0);if(void 0!==d)return d}else this.each(function(c){var f=q.get(c,l);q.set(c,l,b);x&&void 0!==f&&q.set(c,a,b);x&&void 0===m&&q.set(c,a,b)})};this.removeData=function(a){return this.each(function(b){q.release(b,a)})};return{"private":r,data:q}});
hAzzle.define("css",function(){var g=hAzzle.require("storage"),d=hAzzle.require("has"),h="b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img mapobject q script span sub button input label select textarea".split(" "),m=/^(-?[\d+\.\-]+)([a-z]+|%)$/i,p=document.documentElement,l,a={},b=function(a){if(a&&a.nodeType&&null!==a.ownerDocument){var b=!1;return a||a.elements?a?(void 0!==a.ownerDocument&&(b=a.ownerDocument.defaultView),b&&b.opener?b.getComputedStyle(a,null):window.getComputedStyle(a,
null)):a.style:void 0}return""},n=function(a){if(a)return void 0===g["private"].get(a,"css")&&g["private"].access(a,"css",{computedStyle:null}),g["private"].get(a,"css")},r=function(a){return!a||void 0!==n(a).computedStyle&&null!=n(a).computedStyle?n(a).computedStyle:n(a).computedStyle=b(a)},q=function(a){return parseFloat(a)||0},k=function(a){if(a){a=a.tagName.toLowerCase();if(a in h)return"inline";if("li"===a)return"list-item";if("tr"===a)return"table-row";if("table"===a)return"table"}return"block"},
e=function(a,b,g){if(null!==a&&void 0!==a&&(a=null!=a&&a instanceof hAzzle?a.elements:a.length?a[0]:a,!a||!a.elements)){var h=0,n=["paddingTop","paddingBottom","borderTop","borderBottom"],p=4;"width"!==b&&"height"!==b||0!==e(a,"display")||(a.style.display="none",a.style.display=k(a));if(!g||void 0===g){if("height"===b&&"border-box"!==e(a,"boxSizing"))return a.offsetHeight-q(e(a,"borderTopWidth"))-q(e(a,"borderBottomWidth"))-q(e(a,"paddingTop"))-q(e(a,"paddingBottom"))+"px";if("width"===b&&"border-box"!==
e(a,"boxSizing"))return a.offsetWidth-q(e(a,"borderLeftWidth"))-q(e(a,"borderRightWidth"))-q(e(a,"paddingLeft"))-q(e(a,"paddingRight"))+"px"}g=r(a);"fontSize"===b?h=f(a,"1em","left",1)+"px":g&&((d.ie||d.has("firefox"))&&"borderColor"===b&&(b="borderTopColor"),h=9===d.ie&&"filter"===b?g.getPropertyValue(b):g[b],""!==h||hAzzle.require("Core").contains(a.ownerDocument,a)||(h=a.style[b]));if(h){g=(h.match(m)||[])[2];if("%"===g&&l)if("top"===b||"bottom"===b){for(a=(b=a.parentNode||a).offsetHeight;p--;)a-=
parseFloat(e(b,n[p]));h=parseFloat(h)/100*a+"px"}else h=f(a,h);if("auto"===h||g&&"px"!==g)h=0}return void 0!==h?h+"":h}},f=function(b,f,d,g){d=d||"width";var h;h=(f.match(m)||[])[2];var k="px"===h?1:a[h+"toPx"],l=/r?em/i;k||l.test(h)&&!g?(b=k?b:"rem"===h?p:"fontSize"===d?b.parentNode||b:b,k=k||parseFloat(e(b,"fontSize"),!0),b=parseFloat(f)*k):(g=b.style,h=g[d],g[d]=f,b=g[d]?parseFloat(e(b,d,!0)):0,g[d]=void 0!==h?h:null);return b};(function(){var c=[1/25.4,1/2.54,1/72,1/6],d="mm cm pt pc in mozmm".split(" "),
e=d.length,g=document.createElement("div");p.appendChild(g);g.style.marginTop="1%";for(l="1%"===b(g).marginTop;e--;)a[d[e]+"toPx"]=c[e]?c[e]*a.inToPx:f(g,"1"+d[e]);p.removeChild(g)})();return{computed:n,display:k,styles:r,toPx:f,css:e}});
hAzzle.define("setters",function(){var g=hAzzle.require("util"),d=hAzzle.require("core"),h=hAzzle.require("has"),m=hAzzle.require("types"),p=/\S+/g,l=/\r/g,a=0,b,n="multiple selected checked disabled readOnly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readOnly type accesskey dropzone spellcheck isMap loop scoped open".split(" "),r="input select option textarea button form details".split(" "),
q="cellPadding cellSpacing maxLength rowSpan accessKey colSpan useMap frameBorder contentEditable textContent valueType tabIndex encType longDesc dateTime readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),k="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2",e={},f={},c="className",v="for";(function(){var a=document.createElement("div");a.setAttribute("class","x");"x"===a.className&&(c="class")})();(function(){var a=document.createElement("label");
a.setAttribute(v,"x");"x"!==a.getAttribute.htmlFor&&(a.setAttribute("htmlFor","x"),"x"===a.getAttribute.htmlFor&&(v="htmlFor"))})();var s={"class":c,className:c,"for":v,htmlFor:v},u={get:{},set:{}},t={get:{},set:{}},w={get:{},set:{}},x={get:{},set:{}},A=function(a){return a instanceof hAzzle?a.elements[0]:a.length?a[0]:a},C={1:1,4:1,5:1,6:1,7:1,9:1,10:1,11:1,12:1},D=function(a,b){var c=e[b.toLowerCase()];return c&&f[a.nodeName]&&c},B=function(a,b){a=A(a);var c,d,e=0,f=b&&b.match(p);if(f&&1===a.nodeType)for(;c=
f[e++];)d=s[c]||c,D(a,c)?a[d]=!1:a.removeAttribute(c),a.removeAttribute(c)},z=function(a,b,c){var e=(a=A(a))?a.nodeType:void 0,f,g;if(a&&C[a.nodeType]){if("undefined"===typeof a.getAttribute)return y(a,b,c);1===e&&d.isXML(a)||(b=b.toLowerCase(),f=t["undefined"===c?"get":"set"][b]||D(a,b)?x["undefined"===c?"get":"set"][b]:!1);if(void 0===c){if(f&&(g=f.get(a,b))&&null!==g)return g;g=a.getAttribute(b,2);return null==g?void 0:g}if(c){if(f&&void 0!==(g=f.set(a,c,b)))return g;a.setAttribute(b,c+"")}else B(a,
b)}return""},y=function(a,b,c){var f=(a=A(a))?a.nodeType:void 0,e,g;if(a&&C[a.nodeType]){if(1!==f||d.isHTML)b=s[b]||b,e="undefined"===c?u.get[b]:u.set[b];return"undefined"!==typeof c?e&&void 0!==(g=e.set(a,c,b))?g:a[b]=c:e&&null!==(g=e(a,b))?g:a[b]}return""};this.val=function(a){var b,c,e;c=this.elements[0];if(arguments.length)return e=m.isType("Function")(a),this.each(function(c,f){var d;1===c.nodeType&&(d=e?a.call(c,f,hAzzle(c).val()):a,null==d?d="":"number"===typeof d?d+="":m.isArray(d)&&(d=g.map(d,
function(a){return null==a?"":a+""})),b=w.set[c.type]||w.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,d,"value")||(c.value=d))});if(c){if(b=w.get[c.type]||w.get[c.nodeName.toLowerCase()])return b(c,"value");c=c.value;return"string"===typeof c?c.replace(l,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){g.each(a,function(a,c){y(b,c,a)})});if("undefined"===typeof b)return y(c[0],a);this.each(c,function(c){y(c,a,b)})};this.toggleProp=
function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[s[a]||a]})};this.removeAttr=function(a){return this.each(function(b){B(b,a)})};for(this.attr=function(a,b){return"object"===typeof a?this.each(function(b){g.each(a,function(a,c){z(b,c,a)})}):"undefined"===typeof b?z(this.elements[0],a):this.each(function(c){z(c,a,b)})};b=n[a];a++)e[b.toLowerCase()]=b;for(a=0;b=r[a];a++)f[b]=!0;for(a=0;b=q[a];a++)s[b.toLowerCase()]=
b;return{attrHooks:t,propHooks:u,valHooks:w,nodeHooks:x,propMap:s,boolAttr:e,boolElem:f,removeAttr:B,SVGAttr:function(a){if(h.ie||h.has("android")&&!h.has("chrome"))k+="|transform";return(new RegExp("^("+k+")$","i")).test(a)},attr:z,prop:y}});
hAzzle.define("attrHooks",function(){var g=hAzzle.require("util"),d=hAzzle.require("setters"),h=function(){var d=document.createElement("input");d.type="checkbox";d=document.createElement("input");d.value="t";d.type="radio";return"t"===d.value}();g.mixin(d.attrHooks.set,{type:function(d,p){if(!h&&"radio"===p&&g.nodeName(d,"input")){var l=d.value;d.setAttribute("type",p);l&&(d.value=l);return p}}});return{}});
hAzzle.define("prophooks",function(){var g=hAzzle.require("setters");hAzzle.require("util").mixin(g.propHooks.get,{tabIndex:function(d){return d.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(d.nodeName)||d.href?d.tabIndex:-1}});(function(){document.createElement("select").appendChild(document.createElement("option")).selected||(g.propHooks.get.selected=function(d){(d=d.parentNode)&&d.parentNode&&d.parentNode.selectedIndex;return null})})();return{}});
hAzzle.define("valhooks",function(){var g=hAzzle.require("util"),d=hAzzle.require("strings"),h=hAzzle.require("text"),m=hAzzle.require("types"),p=hAzzle.require("collection"),l=hAzzle.require("setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}();g.mixin(l.valHooks.set,{select:function(a,d){for(var g,h,k=a.options,e=p.makeArray(d),f=k.length;f--;)if(h=k[f],h.selected=e.contains(h.value))g=!0;g||(a.selectedIndex=
-1);return e}});g.mixin(l.valHooks.get,{type:function(a){return a.getAttribute("type")||a.type},option:function(a){var g=a.getAttribute(name,2);return null!==g?g:d.trim(h.getText(a))},select:function(a){var d=a.selectedIndex,g="select-one"===a.type;a=a.options;var h=[],k,e,f;if(0>d)return"";f=g?d:0;for(e=g?d+1:a.length;f<e;f++)if(k=a[f],k.selected&&null===k.getAttribute("disabled")&&(!k.parentElement.disabled||"OPTGROUP"!==k.parentElement.tagName)){k=hAzzle(k).val();if(g)return k;h.push(k)}return g&&
!h.length&&a.length?a[d].value:h}});g.each(["radio","checkbox"],function(a){l.valHooks.set[a]=function(a,b){if(m.isArray(b))return a.checked=b.contains(hAzzle(a).val())}});a||(l.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(g){function d(a){return"string"===typeof a?g.document.createTextNode(a):a}function h(a){var b=g.document.createDocumentFragment(),h=p.call(a,0),e=0,f=a.length;if(1===a.length)return d(a[0]);for(;e<f;e++)try{b.appendChild(d(h[e]))}catch(c){}return b}for(var m=Array.prototype,p=m.slice,l=m.indexOf,m=(g.Element||g.Node||g.HTMLElement).prototype,a=["append",function(){try{this.appendChild(h(arguments))}catch(a){}},"prepend",function(){try{this.firstChild?this.insertBefore(h(arguments),this.firstChild):
this.appendChild(h(arguments))}catch(a){}},"before",function(){var a=this.parentElement;a&&a.insertBefore(h(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(h(arguments),this.nextSibling):this.parentElement.appendChild(h(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(h(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",m.matchesSelector||m.webkitMatchesSelector||
m.mozMatchesSelector||m.msMatchesSelector||function(a){var b=this.parentElement;return!!b&&-1<l.call(b.querySelectorAll(a),this)}],b=a.length;b;b-=2)m[a[b-2]]||(m[a[b-2]]=a[b-1]);try{new g.CustomEvent("?")}catch(n){g.CustomEvent=function(a,b){function d(a,b,c,g){this.initEvent(a,b,c);this.detail=g}return function(e,f){var c=document.createEvent(a);if("string"!==typeof e)throw Error("An event name must be provided");"Event"===a&&(c.initCustomEvent=d);null==f&&(f=b);c.initCustomEvent(e,f.bubbles,f.cancelable,
f.detail);return c}}(g.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}[].contains||Object.defineProperty(Array.prototype,"contains",{enumerable:!1,configurable:!0,writable:!0,value:function(a,b){if(void 0===this||null===this)throw new TypeError("Cannot convert this value to object");var d=Object(this),e=parseInt(d.length)||0;if(1>e)return!1;var f=Math.floor(b||0);if(f>=e||4294967295<f)return!1;0>f&&(f=e+f);if(-Infinity===f||0>f)f=0;0<=f||(f=e+Math.abs(f),0>f&&(f=0));for(;f<
e;){var c=d[f];if(a===c||a!==a&&c!==c)return!0;f+=1}return!1}})})(window);