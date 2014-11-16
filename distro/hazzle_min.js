/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.2c
 * Released under the MIT License.
 *
 * Date: 2014-11-16
 */
 
(function(){var h={},e={},l=function(a,d,b){if(a)throw Error("[hAzzle-"+d+"] "+b);},m=function(a){if(a&&"string"===typeof a)return h[a.toLowerCase()]},p=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},g=function(a,d){if(a){if(!(this instanceof g))return new g(a,d);if(a instanceof g)return a;var b;b=m("Util");"function"===typeof a&&(e.ready?m("ready").ready(a):l(!0,6,"ready.js module not installed"));b="string"===typeof a?e.manipulation&&"<"===a[0]&&">"===a[a.length-1]&&3<=a.length?m("manipulation").create(a,
d&&d.nodeType?d.ownerDocument||d:document):this.find(a,d,!0):Array.isArray(a)?b.unique(b.filter(a,p)):this.isNodeList(a)?b.filter(b.makeArray(a),p):a.nodeType?11===a.nodeType?a.children:[a]:a===window?[a]:[];void 0===b?(this.length=0,this.elements=[]):(this.elements=b,this.length=b.length);return this}};g.err=l;g.installed=e;g.require=m;g.define=function(a,d){"string"!==typeof a||"function"!==typeof d||h[a]||(e[a.toLowerCase()]=!0,h[a.toLowerCase()]=d.call(g.prototype))};g.codename="new-age";g.version=
"1.0.1b";window.hAzzle=g})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var h=navigator.userAgent,e=window,l=e.document,m=l.createElement("div"),p=Object.prototype.toString,g={},a=function(){if(l.documentMode)return l.documentMode;for(var a=7,d;4<a;a--)if(d=l.createElement("div"),d.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e",d.getElementsByTagName("span").length)return a}(),d=function(a){return"function"===typeof g[a]?g[a]=g[a](e,l,m):g[a]},b=function(a,b,k,n){("undefined"===typeof g[a]||n)&&(g[a]=b);return k&&d(a)};b("multiArgs",
function(){var a=document.createElement("div");a.classList.add("a","b");return/(^| )a( |$)/.test(a.className)&&/(^| )b( |$)/.test(a.className)});b("mobile",/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(h));b("android",/^Android/i.test(h));b("opera","[object Opera]"===p.call(window.opera));b("firefox","undefined"!==typeof InstallTrigger);b("chrome",e.chrome);b("webkit","WebkitAppearance"in l.documentElement.style);b("safari",0<p.call(window.HTMLElement).indexOf("Constructor"));
b("ie",function(){return!!l.documentMode});b("mac",0<=navigator.appVersion.indexOf("Macintosh"));b("classlist",!!document.documentElement.classList);b("quirks","BackCompat"==document.compatMode);b("xpath",!!l.evaluate);b("air",!!e.runtime);b("dart",!(!e.startDart&&!l.startDart));b("promise",!!e.Promise);b("touch","ontouchstart"in document||"onpointerdown"in document&&0<navigator.maxTouchPoints||window.navigator.msMaxTouchPoints);b("touchEvents","ontouchstart"in document);b("pointerEvents","onpointerdown"in
document);b("MSPointer","msMaxTouchPoints"in navigator);b("qsa",!!document.querySelectorAll);return{has:d,add:b,load:function(a,d,k){a?d([a],k):k()},cache:g,clear:function(a){a.innerHTML="";return a},ie:a}});
hAzzle.define("Types",function(){var h=Object.prototype.toString,e=Array.isArray,l=function(a){return"string"===typeof a},m=function(a){return"number"===typeof a},p=function(a){return a&&a.window===a},g=function(a){return a?function(b){return h.call(b)==="[object "+a+"]"}:function(){}},a=function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b||"[object HTMLFormControlsCollection]"===b)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===
a(0)||a(0)&&a(0).tagName)return!0}catch(e){}return!1};this.isNodeList=a;return{isType:g,isArray:e,isEmpty:function(a){if(null==a)return!0;if(e(a)||l(a)||g("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:p,isObject:function(a){return null!==a&&"object"===typeof a},isPlainObject:function(a){return g("Object")(a)&&!p(a)&&Object.getPrototypeOf(a)==Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},
isNode:function(a){return!!a&&"object"===typeof a&&"nodeType"in a},isElement:function(a){return!(!a||!a.nodeName)},isString:l,isArrayLike:function(a){if(null==a||p(a))return!1;var b=a.length;return 1===a.nodeType&&b?!0:l(a)||e(a)||0===b||"number"===typeof b&&0<b&&b-1 in a},isNumber:m,isBoolean:function(a){return"boolean"===typeof a},isNaN:function(a){return m(a)&&a!=+a},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:a}});
hAzzle.define("text",function(){var h=function(e){var l,m="",p=0;l=e.nodeType;if(!l)for(;l=e[p++];)m+=h(l);else if(1===l||9===l||11===l){if("string"===typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)m+=h(e)}else if(3===l||4===l)return e.nodeValue;return m};return{getText:h}});
hAzzle.define("util",function(){var h=Array.prototype.slice,e=hAzzle.require("types"),l=Object.keys,m=function(a,n,c,f){if(void 0===a)return a;hAzzle.err("function"!==typeof n,5,"'fn' must be a function in util.each()");var b,d=a.length,g;if("function"===typeof n&&"undefined"===typeof c&&"undefined"===typeof f&&e.isArray(a))for(;++b<d&&(b=f?a.length-b-1:b,!1!==n.call(a[b],a[b],b,a)););if(d===+d)for(b=0;b<d&&(b=f?a.length-b-1:b,!1!==n.call(a[b],a[b],b,a));b++);else if(a)for(g in a)if(!1===n.call(a[g],
a[g],g,a))break;return a},p=function(k,n,c){if("function"===typeof k){if(void 0===n)return k;c=c?c:3;return 1===c?function(a){return k.call(n,a)}:2===c?function(a,c){return k.call(n,a,c)}:3===c?function(a,c,b){return k.call(n,a,c,b)}:4===c?function(a,c,b,d){return k.call(n,a,c,b,d)}:function(){return k.apply(n,arguments)}}if(!k)return a},g=function(k,n,c){return k?"function"===typeof k?p(k,n,c):e.isObject(k)?d(k):r(k):a},a=function(a){return a},d=function(a){var n=b(a),c=n.length;return function(a){if(!a)return!c;
a=Object(a);for(var k=0,b,d;k<c;k++)if(b=n[k],d=b[0],b[1]!==a[d]||!(d in a))return!1;return!0}},b=function(a){for(var n=l(a),c=n.length,f=Array(c),b=0;b<c;b++)f[b]=[n[b],a[n[b]]];return f},r=function(a){return function(b){return b[a]}},q=function(a,b,c){if(null==a)return-1;var f=0,d=a.length;if(c)if("number"===typeof c)f=0>c?Math.max(0,d+c):c;else{c=g(void 0,void 0,1);for(var f=c(b),d=0,e=a.length;d<e;){var h=d+e>>>1;c(a[h])<f?d=h+1:e=h}f=d;return a[f]===b?f:-1}for(;f<d;f++)if(a[f]===b)return f;return-1};
return{map:function(a,b,c){if(a){b=g(b,c);c=a.length!==+a.length&&l(a);for(var f=(c||a).length,d=Array(f),e,h=0;h<f;h++)e=c?c[h]:h,d[h]=b.call(a[e],a[e],e,a);return d}return[]},some:function(a,b,c){if(a){b=g(b,c);c=(f||a).length;var f,d=0,e;for(a.length!==+a.length&&(f=f(a));d<c;d++)if(e=f?f[d]:d,b(a[e],e,a))return!0}return!1},reduce:function(a,b,c,f){a||(a=[]);b=p(b,f,4);var d=a.length!==+a.length&&l(a),e=(d||a).length,g=0,s;3>arguments.length&&(hAzzle.err(!e,7," no collection length exist in collection.reduce()"),
c=a[d?d[g++]:g++]);for(;g<e;g++)s=d?d[g]:g,c=b(c,a[s],s,a);return c},each:m,mixin:function(a){if(e.isObject(a))for(var b,c,f=1,d=arguments.length;f<d;f++)for(c in b=arguments[f],b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c]);return a},makeArray:function(a){if(e.isArray(a))return a;for(var b=-1,c=a.length,f=Array(c);++b<c;)f[b]=a[b];return f},merge:function(a,b){for(var c=+b.length,f=0,d=a.length;f<c;f++)a[d++]=b[f];a.length=d;return a},nodeName:function(a,b){return a&&a.nodeName&&a.nodeName.toLowerCase()===
b.toLowerCase()},unique:function(a,b,c,f){if(!a)return[];e.isBoolean(b)&&(f=c,c=b,b=!1);void 0!==c&&(c=g(c,f));f=[];for(var d=[],h=0,l,s=a.length;h<s;h++)if(l=a[h],b)h&&d===l||f.push(l),d=l;else if(c){var w=c(l,h,a);0>q(d,w)&&(d.push(w),f.push(l))}else 0>q(f,l)&&f.push(l);return f},indexOf:q,filter:function(a,b,c){var f=[];if(!a)return f;b=g(b,c);m(a,function(a,c,d){b(a,c,d)&&f.push(a)});return f},now:Date.now,bind:function(a,b){var c=2<arguments.length?h.call(arguments,2):[],f;"string"===typeof b&&
(f=a[b],b=a,a=f);return"function"!==typeof a||b instanceof RegExp?b:c.length?function(){return arguments.length?a.apply(b||this,c.concat(h.call(arguments,0))):a.apply(b||this,c)}:function(){return arguments.length?a.apply(b||this,arguments):a.call(b||this)}}}});
hAzzle.define("Core",function(){var h=1,e=window.document,l=window.document,m="hAzzle_"+1*new Date,p,g,a=Array.prototype.indexOf,d={},b,r=e.createElement("div").compareDocumentPosition(e.createElement("div"))&1,q,k=function(){return!!q},n=function(a,b){a===b&&(q=!0);return 0},c=m.split("").sort(n).join("")===m,f=function(a,b){var c=b&&a,f=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(f)return f;if(c)for(;c=c.nextSibling;)if(c===b)return-1;return a?
1:-1},v=function(a){return/^[^{]+\{\s*\[native \w/.test(""+a)},u=function(a){var b,c,f,k;p=a=a.ownerDocument||a;b=a.documentElement;if(9!==p.nodeType||!p.documentElement)return e;e=a;if(c=b.getAttribute("__hAzzle"))return g=d[c];b.setAttribute("__hAzzle",h);g={id:++h};g.qsa=v(a.querySelectorAll);g.compare=v(b.compareDocumentPosition);g.contains=v(b.contains);g.QSABugs=f=[];g.matchesBugs=k=[];g.qsa&&(c=a.createElement("div"),c.appendChild(a.createElement("select")),(a=a.createElement("option")).setAttribute("selected",
""),c.firstChild.appendChild(a),c.querySelectorAll(":checked").length||f.push(":checked"),g.QSABugs=f.length&&new RegExp(f.join("|")));v(b=b.webkitMatchesSelector||b.mozMatchesSelector||b.oMatchesSelector||b.msMatchesSelector)&&(g.matchesSelector=b,g.disconMatch=b.call(c,"div"),g.matchesBugs=k.length&&new RegExp(k.join("|")));d[h]=g;return d[h]};u(e);var t=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},s=g.compare&&g.contains?function(a,b){var c=9===a.nodeType?
a.documentElement:a,f=b&&b.parentElement;return a===f||!!(f&&1===f.nodeType&&(c.contains?c.contains(f):a.compareDocumentPosition&&a.compareDocumentPosition(f)&16))}:function(a,b){if(b)for(;b=b.parentElement;)if(b===a)return!0;return!1},n=g.compare?function(c,f){if(c===f)return q=!0,0;var d=!c.compareDocumentPosition-!f.compareDocumentPosition;if(d)return d;d=(c.ownerDocument||c)===(f.ownerDocument||f)?c.compareDocumentPosition(f):1;return d&1||!r&&f.compareDocumentPosition(c)===d?c===p||c.ownerDocument===
l&&s(l,c)?-1:f===p||f.ownerDocument===l&&s(l,f)?1:b?a(b,c)-a(b,f):0:d&4?-1:1}:function(c,d){if(c===d)return q=!0,0;var k,e=0,s=c.parentNode,n=d.parentNode,g=[c],h=[d];if(!s||!n)return c===k?-1:d===k?1:s?-1:n?1:b?a(b,c)-a(b,d):0;if(s===n)return f(c,d);for(k=c;k=k.parentNode;)g.unshift(k);for(k=d;k=k.parentNode;)h.unshift(k);for(;g[e]===h[e];)e++;return e?f(g[e],h[e]):g[e]===l?-1:h[e]===l?1:0};return{environment:g,expando:m,addFeature:function(a,b){"string"===typeof a&&b&&(d[h][a]=b)},setDocument:u,
isXML:t,isHTML:!t(e),contains:s,unique:function(a){var f,d=[],e=0,s=0;q=!k;b=!c&&a.slice(0);a.sort(n);if(q){for(;f=a[s++];)f===a[s]&&(e=d.push(s));for(;e--;)a.splice(d[e],1)}b=null;return a},matches:g.matchesSelector,qsa:g.qsa,QSABugs:g.QSABugs,matchesBugs:g.matchesBugs}});
hAzzle.define("Collection",function(){var h=hAzzle.require("util"),e=hAzzle.require("types"),l=Array.prototype,m=l.concat,p=l.push,g=function(a,d,b){"undefined"===typeof d&&(d=0);"undefined"===typeof b&&(b=a?a.length:0);var e=-1;b=b-d||0;for(var g=Array(0>b?0:b);++e<b;)g[e]=a[d+e];return g};this.toJqueryZepto=function(){for(var a=this.length,d=this.elements;a--;)this[a]=d[a];return this};this.get=function(a){return void 0===a?g(a,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=function(a){var d=
this.elements[0];return d.nodeType&&9!==d.nodeType?"number"===typeof a&&hAzzle(-1===a?g(this.elements,this.length-1):this.elements[a]):this};this.reduce=function(a,d,b){return h.reduce(this.elements,a,d,b)};this.indexOf=function(a,d,b){return null==d?-1:l.indexOf.call(d,a,b)};this.map=function(a,d){return hAzzle(h.map(this.elements,a,d))};this.each=function(a,d,b){h.each(this.elements,a,d,b);return this};this.slice=function(a,d){return hAzzle(g(this.elements,a,d))};this.concat=function(){var a=h.map(g(arguments),
function(a){return a instanceof hAzzle?a.elements:a});return hAzzle(m.apply(this.elements,a))};this.contents=function(){return this.map(function(){return this.contentDocument||g(this.childNodes)||[]})};this.is=function(a){return a?0<this.length&&0<this.filter(a).length:!1};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var d=this.elements;return a?"string"===typeof a?h.indexOf(hAzzle(a).elements,d[0]):h.indexOf(d,a instanceof hAzzle?a.elements[0]:a):d[0]&&d[0].parentElement?
this.first().prevAll().length:-1};this.add=function(a,d){return this.concat("string"===typeof a?hAzzle(a,d).elements:a)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};h.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,d){this[d]=function(b){return this.map(function(){return this[a]}).filter(b)}}.bind(this));
h.each({prevAll:"previousElementSibling",nextAll:"nextElementSibling"},function(a,d){this[d]=function(){var b=[];this.each(function(d){for(;(d=d[a])&&9!==d.nodeType;)b.push(d)});return hAzzle(b)}}.bind(this));h.each("shift splice unshift join lastIndexOf forEach reduceRight".split(" "),function(a){this[a]=function(){return this.elements[a].apply(this.elements,arguments)}}.bind(this));return{makeArray:function(a,d){var b=d||[];void 0!==a&&(e.isArrayLike(Object(a))?h.merge(b,e.isString(a)?[a]:a):p.call(b,
a));return b},inArray:inArray,arrayRemove:function(a,d){var b=a.indexOf(d);0<=b&&a.splice(b,1);return d},slice:g}});
hAzzle.define("Jiesa",function(){var h=hAzzle.require("util"),e=hAzzle.require("core"),l=hAzzle.require("collection"),m=hAzzle.require("types"),p=hAzzle.require("has"),g=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,a=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,d=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,b=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,r=/^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,q=/^\s*[+~]/,k=/[\n\t\r]/g,n={":enabled":function(a){return!1===a.disabled},":disabled":function(a){return!0===
a.disabled},":checked":function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},":hidden":function(a){var b=a.style;return!b||"none"!==b.display&&"hidden"!==b.visibility?"hidden"===a.type:!0},":visible":function(a){return!n[":hidden"](a)}},c=function(a,b,c){var f=a,e=a.getAttribute("id"),k=e||"__hAzzle__",n=a.parentNode,g=q.test(b);if(g&&!n)return[];e?k=k.replace(/'/g,"\\$&"):a.setAttribute("id",k);g&&n&&(a=a.parentNode);b=b.match(d);for(n=0;n<b.length;n++)b[n]=
"[id='"+k+"'] "+b[n];b=b.join(",");try{return c.call(a,b)}finally{e||f.removeAttribute("id")}},f=function(a,b,f){return f&&9!==f.nodeType?c(f,b,function(b){return a.matches(b)}):a.matches(b)},v=function(a){return a?"string"===typeof a?u(a):!a.nodeType&&m.isArrayLike(a)?a[0]:a:document},u=function(b,f){var d,n,m,r,q=[];f=v(f);if(!b||"string"!==typeof b)return q;if(1!==(n=f.nodeType)&&9!==n&&11!==n)return[];if(e.isHTML){if(d=g.exec(b)){if(b=d[1]){if(9===n)return(m=f.getElementById(b))&&m.id===b?[m]:
[];if(f.ownerDocument&&(m=f.ownerDocument.getElementById(b))&&e.contains(f,m)&&m.id===d)return[m]}else if(b=d[2])r=f.getElementsByClassName(b);else if(b=d[3])r=f.getElementsByTagName(b);return l.slice(r)}if(d=a.exec(b)){n=f.getElementsByTagName(d[1]);var u=d[2],t=d[3];h.each(n,function(a){var b;(b=a.id===u)||(b=p.has("classList")?a.classList.contains(t):0<=(" "+a.className+" ").replace(k," ").indexOf(t));b&&q.push(a)});return q}}if(e.qsa&&(!e.QSABugs||!e.QSABugs.test(b)))try{return r=1===f.nodeType?
c(f,b,f.querySelectorAll):f.querySelectorAll(b),l.slice(r)}catch(y){}},t=function(a,c,d){if(c.nodeType)return a===c;(a.ownerDocument||a)!==document&&e.setDocument(a);c="string"===typeof c?c.replace(b,"='$1']"):c;if(c instanceof hAzzle)return h.some(c.elements,function(b){return t(a,b)});if(a===document)return!1;var k=r.exec(c);if(k)return k[1]&&(k[1]=k[1].toLowerCase()),k[3]&&(k[3]=k[3].split("=")),k[4]&&(k[4]=" "+k[4]+" "),(!k[1]||a.nodeName.toLowerCase()===k[1])&&(!k[2]||a.id===k[2])&&(!k[3]||(k[3][1]?
a.getAttribute(k[3][0])===k[3][1]:a.hasAttribute(k[3][0])))&&(!k[4]||0<=(" "+a.className+" ").indexOf(k[4]));if(k=n[c])return!!k(a);if(!e.matches||!e.isHTML||e.rbuggyMatches&&e.rbuggyMatches.test(c)||e.QSABugs&&e.QSABugs.test(c))hAzzle.err(!0,23," jiesa.js module need to be installed");else try{var g=f(a,c,d);if(g||e.disconMatch||a.document&&11!==a.document.nodeType)return g}catch(l){}};this.find=function(a,b,c){if(!c){if("string"!==typeof a){var f=0,d=this.length,k=this.elements;return hAzzle(h.filter(hAzzle(a).elements,
function(a){for(;f<d;f++)if(e.contains(k[f],a))return!0}))}return h.reduce(this.elements,function(b,c){return hAzzle(b.concat(l.slice(u(a,c))))},[])}return u(a,b)};this.filter=function(a,b){if(void 0===a)return this;if("function"===typeof a){var c=[];this.each(function(b,f){a.call(b,f)&&c.push(b)});return hAzzle(c)}return this.filter(function(){return t(this,a)!==(b||!1)})};return{matchesSelector:f,matches:t,pseudos:n,find:u}});
hAzzle.define("Strings",function(){var h=/[A-Z]/g,e=/([\:\-\_]+(.))/g,l=/^moz([A-Z])/,m=[],p=function(a,d,b,e){return e?b.toUpperCase():b},g=function(a){return"-"+a.charAt(0).toLowerCase()};return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(h,g):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():
a},camelize:function(a){return m[a]?m[a]:m[a]=a.replace(e,p).replace(l,"Moz$1")},trim:function(a){return"string"===typeof a?a.trim():a},lowercase:function(a){return"string"===typeof a?a.toLowerCase():a},uppercase:function(a){return"string"===typeof a?a.toUpperCase():a}}});
hAzzle.define("storage",function(){var h=hAzzle.require("util"),e=hAzzle.require("strings"),l=hAzzle.require("types"),m=hAzzle.require("core"),p=e.camelize,g=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,a=/([A-Z])/g,d=/\S+/g,b=function(b,d,c){if(void 0===c&&1===b.nodeType)if(c="data-"+d.replace(a,"-$1").toLowerCase(),c=b.getAttribute(c),"string"===typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:g.test(c)?JSON.parse(c+""):c}catch(f){}q.set(b,d,c)}else c=void 0;return c},e=function(){this.expando=
m.expando+Math.random()};e.prototype={constructor:e,register:function(a,b){hAzzle.err(!l.isObject(a),22,"no valid DOM element in storage.js");a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperty(a,this.expando,{value:b||{},writable:!0,configurable:!0});return a[this.expando]},cache:function(a,b){if(!a||1!==a.nodeType&&9!==a.nodeType&&+a.nodeType)return{};var c=a[this.expando];return c?c:this.register(a,b)},set:function(a,b,c){if(a){var f;if(a=this.cache(a)){if("string"===typeof b)a[b]=c;
else if(l.isEmptyObject(a))h.mixin(a,b);else for(f in b)a[f]=b[f];return a}}},access:function(a,b,c){if(void 0===b||b&&"string"===typeof b&&void 0===c)return c=this.get(a,b),void 0!==c?c:this.get(a,p(b));this.set(a,b,c);return void 0!==c?c:b},get:function(a,b){var c=this.cache(a);if(c)return void 0!==c&&void 0===b?c:c[b]},release:function(a,b){var c,f,e=this.cache(a);if(void 0===b)this.register(a);else for(l.isArray(b)?f=b.concat(b.map(p)):(c=p(b),b in e?f=[b,c]:(f=c,f=e[f]?[f]:f.match(d)||[])),c=
f.length;c--;)delete e[f[c]]},hasData:function(a){return!l.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var r=new e,q=new e;this.data=function(a,d){var c,f,e,g=this.elements[0],h=g&&g.attributes;if(void 0===a){if(this.length&&(e=q.get(g),1===g.nodeType&&!r.get(g,"hasDataAttrs"))){for(c=h.length;c--;)h[c]&&(f=h[c].name,0===f.indexOf("data-")&&(f=p(f.slice(5)),b(g,f,e[f])));r.set(g,"hasDataAttrs",!0)}return e}if("object"===typeof a)return this.each(function(b){q.set(b,
a)});var l=p(a);if(g&&void 0===d){e=q.get(g,a);if(void 0!==e)return e;e=q.get(g,l);var m=r.get(this,"hasDataAttrs"),x=-1!==a.indexOf("-");if(void 0!==e)return e;e=b(g,l,void 0);if(void 0!==e)return e}else this.each(function(b){var c=q.get(b,l);q.set(b,l,d);x&&void 0!==c&&q.set(b,a,d);x&&void 0===m&&q.set(b,a,d)})};this.removeData=function(a){return this.each(function(b){q.release(b,a)})};return{"private":r,data:q}});
hAzzle.define("css",function(){var h=hAzzle.require("storage"),e=hAzzle.require("has"),l="b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img mapobject q script span sub button input label select textarea".split(" "),m=/^(width|height)$/,p=/^(li)$/i,g=/^(tr)$/i,a=/^(table)$/i,d=/^margin/,b=/^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i,r=function(a){if(a)return void 0===h["private"].get(a,"css")&&h["private"].access(a,"css",{computedStyle:null}),h["private"].get(a,
"css")},q=function(a){var b;if(null===r(a).computedStyle){b=r(a);if(a&&null!==a.ownerDocument){var c=!1;a?(void 0!==a.ownerDocument&&(c=a.ownerDocument.defaultView),a=c&&c.opener?c.getComputedStyle(a,null):window.getComputedStyle(a,null)):a=a.style}else a="";b=b.computedStyle=a}else b=r(a).computedStyle;return b},k=function(a){return parseFloat(a)||0},n=function(b){if(b){b=b.tagName.toLowerCase();if(b in l)return"inline";if(p.test(b))return"list-item";if(g.test(b))return"table-row";if(a.test(b))return"table"}return"block"},
c=function(a,g,h){a=a instanceof hAzzle?a.elements[0]:a;var l=0;m.test(g)&&0===c(a,"display")&&(a.style.display="none",a.style.display=n(a));if(e.has("ie")&&"auto"===g){if("height"===g)return a.offsetHeight;if("width"===g)return a.offsetWidth}if(!h){if("height"===g&&"border-box"!==c(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-k(c(a,"borderTopWidth"))-k(c(a,"borderBottomWidth"))-k(c(a,"paddingTop"))-k(c(a,"paddingBottom"));if("width"===g&&"border-box"!==c(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-
k(c(a,"borderLeftWidth"))-k(c(a,"borderRightWidth"))-k(c(a,"paddingLeft"))-k(c(a,"paddingRight"))}if(h=q(a))if((e.ie||e.has("firefox"))&&"borderColor"===g&&(g="borderTopColor"),l=9===e.ie&&"filter"===g?h.getPropertyValue(g):h[g],""!==l||hAzzle.require("Core").contains(a.ownerDocument,a)||(l=a.style[g]),e.has("mobile")&&e.has("android")&&b.test(l)&&d.test(name)){var p=a.style;a=p.width;g=p.minWidth;h=p.maxWidth;p.minWidth=p.maxWidth=p.width=l;l=r.width;p.width=a;p.minWidth=g;p.maxWidth=h}return void 0!==
l?l+"":l};return{computed:r,display:n,styles:q,css:c}});
hAzzle.define("setters",function(){var h=hAzzle.require("util"),e=hAzzle.require("core"),l=hAzzle.require("types"),m=/\S+/g,p=/\r/g,g="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),a={},d={},b={"class":"className","for":"htmlFor"},r={get:{},set:{}},q={get:{},set:{}},k={get:{},
set:{}},n={get:{},set:{}},c={get:{},set:{}},f=function(a){return a instanceof hAzzle?a.elements:a},v=function(b,c){var e=a[c.toLowerCase()];return e&&d[b.nodeName]&&e},u=function(a,c){a=f(a);var d,e,g=0,k=c&&c.match(m);if(k&&1===a.nodeType)for(;d=k[g++];)e=b[d]||d,v(a,d)?a[e]=!1:a.removeAttribute(d),a.removeAttribute(d)},t=function(a,b,d){var g=(a=f(a))?a.nodeType:void 0,k,h;if(g&&(3!==g||8!==g||2!==g)){if("undefined"===typeof a.getAttribute)return s(a,b,d);1===g&&e.isXML(a)||(b=b.toLowerCase(),k=
q["undefined"===d?"get":"set"][b]||v(a,b)?c["undefined"===d?"get":"set"][b]:n["undefined"===d?"get":"set"][b]);if(void 0===d){if(k&&(h=k.get(a,b))&&null!==h)return h;h=a.getAttribute(b,2);return null==h?void 0:h}if(d){if(k&&void 0!==(h=k.set(a,d,b)))return h;a.setAttribute(b,d+"")}else u(a,b)}return""},s=function(a,c,d){var g=(a=f(a))?a.nodeType:void 0,k,h;if(g&&(3!==g||8!==g||2!==g)){if(1!==g||e.isHTML)c=b[c]||c,k="undefined"===d?r.get[c]:r.set[c];return"undefined"!==typeof d?k&&void 0!==(h=k.set(a,
d,c))?h:a[c]=d:k&&null!==(h=k(a,c))?h:a[c]}return""};this.val=function(a){var b,c,d;c=this.elements[0];if(arguments.length)return d=l.isType("Function")(a),this.each(function(c,e){var f;1===c.nodeType&&(f=d?a.call(c,e,hAzzle(c).val()):a,null==f?f="":"number"===typeof f?f+="":l.isArray(f)&&(f=h.map(f,function(a){return null==a?"":a+""})),b=k.set[c.type]||k.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,f,"value")||(c.value=f))});if(c){if(b=k.get[c.type]||k.get[c.nodeName.toLowerCase()])return b(c,"value");
c=c.value;return"string"===typeof c?c.replace(p,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){h.each(a,function(a,c){s(b,c,a)})});if("undefined"===typeof b)return s(c[0],a);this.each(c,function(c){s(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[b[a]||a]})};this.removeAttr=function(a){return this.each(function(b){u(b,
a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){h.each(a,function(a,c){t(b,c,a)})}):"undefined"===typeof b?t(c[0],a):this.each(function(c){t(c,a,b)})};h.each(g,function(b){a[g[b]]=g[b]});h.each("input select option textarea button form details".split(" "),function(a){d[a.toUpperCase()]=!0});h.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),
function(a){b[a.toLowerCase()]=a});return{attrHooks:q,propHooks:r,valHooks:k,boolHooks:c,nodeHooks:n,propMap:b,boolAttr:a,boolElem:d,removeAttr:u,attr:t,prop:s}});hAzzle.define("boolhooks",function(){var h=hAzzle.require("setters");h.boolHooks.set=function(e,l,m){!1===l?h.removeAttr(e,m):e.setAttribute(m,m);return m};return{}});
hAzzle.define("attrHooks",function(){var h=hAzzle.require("util"),e=hAzzle.require("setters"),l=function(){var e=document.createElement("input");e.type="checkbox";e=document.createElement("input");e.value="t";e.type="radio";return"t"===e.value}();h.mixin(e.attrHooks.set,{type:function(e,p){if(!l&&"radio"===p&&h.nodeName(e,"input")){var g=e.value;e.setAttribute("type",p);g&&(e.value=g);return p}}});return{}});
hAzzle.define("prophooks",function(){var h=hAzzle.require("setters");hAzzle.require("util").mixin(h.propHooks.get,{tabIndex:function(e){return e.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(e.nodeName)||e.href?e.tabIndex:-1}});(function(){document.createElement("select").appendChild(document.createElement("option")).selected||(h.propHooks.get.selected=function(e){(e=e.parentNode)&&e.parentNode&&e.parentNode.selectedIndex;return null})})();return{}});
hAzzle.define("valHooks",function(){var h=hAzzle.require("util"),e=hAzzle.require("strings"),l=hAzzle.require("text"),m=hAzzle.require("types"),p=hAzzle.require("collection"),g=hAzzle.require("setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}();h.mixin(g.valHooks.set,{select:function(a,b){for(var e,g,k=a.options,h=p.makeArray(b),c=k.length;c--;)if(g=k[c],g.selected=h.contains(g.value))e=!0;e||(a.selectedIndex=
-1);return h}});h.mixin(g.valHooks.get,{option:function(a){var b=a.getAttribute(name,2);return null!==b?b:e.trim(l.getText(a))},select:function(a){var b=a.selectedIndex,e="select-one"===a.type;a=a.options;var g=[],k,h,c;if(0>b)return"";c=e?b:0;for(h=e?b+1:a.length;c<h;c++)if(k=a[c],k.selected&&null===k.getAttribute("disabled")&&(!k.parentElement.disabled||"OPTGROUP"!==k.parentElement.tagName)){k=hAzzle(k).val();if(e)return k;g.push(k)}return e&&!g.length&&a.length?a[b].value:g}});h.each(["radio",
"checkbox"],function(a){g.valHooks.set[a]=function(a,d){if(m.isArray(d))return a.checked=d.contains(hAzzle(a).val())}});a||(g.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(h){function e(a){return"string"===typeof a?h.document.createTextNode(a):a}function l(a){var b=h.document.createDocumentFragment(),d=p.call(a,0),g=0,c=a.length;if(1===a.length)return e(a[0]);for(;g<c;g++)try{b.appendChild(e(d[g]))}catch(f){}return b}for(var m=Array.prototype,p=m.slice,g=m.indexOf,m=(h.Element||h.Node||h.HTMLElement).prototype,a=["append",function(){try{this.appendChild(l(arguments))}catch(a){}},"prepend",function(){try{this.firstChild?this.insertBefore(l(arguments),this.firstChild):
this.appendChild(l(arguments))}catch(a){}},"before",function(){var a=this.parentElement;a&&a.insertBefore(l(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(l(arguments),this.nextSibling):this.parentElement.appendChild(l(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(l(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",m.matchesSelector||m.webkitMatchesSelector||
m.mozMatchesSelector||m.msMatchesSelector||function(a){var b=this.parentElement;return!!b&&-1<g.call(b.querySelectorAll(a),this)}],d=a.length;d;d-=2)m[a[d-2]]||(m[a[d-2]]=a[d-1]);try{new h.CustomEvent("?")}catch(b){h.CustomEvent=function(a,b){function d(a,b,e,g){this.initEvent(a,b,e);this.detail=g}return function(e,c){var f=document.createEvent(a);if("string"!==typeof e)throw Error("An event name must be provided");"Event"===a&&(f.initCustomEvent=d);null==c&&(c=b);f.initCustomEvent(e,c.bubbles,c.cancelable,
c.detail);return f}}(h.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}[].contains||Object.defineProperty(Array.prototype,"contains",{enumerable:!1,configurable:!0,writable:!0,value:function(a,b){if(void 0===this||null===this)throw new TypeError("Cannot convert this value to object");var d=Object(this),e=parseInt(d.length)||0;if(1>e)return!1;var c=Math.floor(b||0);if(c>=e||4294967295<c)return!1;0>c&&(c=e+c);if(-Infinity===c||0>c)c=0;0<=c||(c=e+Math.abs(c),0>c&&(c=0));for(;c<
e;){var f=d[c];if(a===f||a!==a&&f!==f)return!0;c+=1}return!1}})})(window);