/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.2d
 * Released under the MIT License.
 *
 * Date: 2014-11-19
 */
 
(function(){var h={},e={},m=function(a,c,b){if(a)throw Error("[hAzzle-"+c+"] "+b);},n=function(a){if(a&&"string"===typeof a)return h[a.toLowerCase()]},p=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},g=function(a,c){if(a){if(!(this instanceof g))return new g(a,c);if(a instanceof g)return a;var b;b=n("Util");"function"===typeof a&&(e.ready?n("ready").ready(a):m(!0,6,"ready.js module not installed"));b="string"===typeof a?e.manipulation&&"<"===a[0]&&">"===a[a.length-1]&&3<=a.length?n("manipulation").create(a,
c&&c.nodeType?c.ownerDocument||c:document):this.find(a,c,!0):Array.isArray(a)?b.unique(b.filter(a,p)):this.isNodeList(a)?b.filter(b.makeArray(a),p):a.nodeType?11===a.nodeType?a.children:[a]:a===window?[a]:[];void 0===b?(this.length=0,this.elements=[]):(this.elements=b,this.length=b.length);return this}};g.err=m;g.installed=e;g.require=n;g.define=function(a,c){"string"!==typeof a||"function"!==typeof c||h[a]||(e[a.toLowerCase()]=!0,h[a.toLowerCase()]=c.call(g.prototype))};g.codename="new-age";g.version=
"1.0.2d";window.hAzzle=g})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var h=navigator.userAgent,e=window,m=e.document,n=m.createElement("div"),p=Object.prototype.toString,g={},a=function(){if(m.documentMode)return m.documentMode;for(var a=7,c;4<a;a--)if(c=m.createElement("div"),c.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e",c.getElementsByTagName("span").length)return a}(),c=function(a){return"function"===typeof g[a]?g[a]=g[a](e,m,n):g[a]},b=function(a,b,l,k){("undefined"===typeof g[a]||k)&&(g[a]=b);return l&&c(a)};b("multiArgs",
function(){var a=document.createElement("div");a.classList.add("a","b");return/(^| )a( |$)/.test(a.className)&&/(^| )b( |$)/.test(a.className)});b("removeStyles",function(){var a=document.createElement("div");a.style.color="red";a.style.color=null;return"red"==a.style.color});b("WrongOrder",function(){document.createElement("div").style.border="1px solid #123abc";return"1px solid #123abc"!=el.style.border});b("mobile",/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(h));b("android",
/^Android/i.test(h));b("opera","[object Opera]"===p.call(window.opera));b("firefox","undefined"!==typeof InstallTrigger);b("chrome",e.chrome);b("webkit","WebkitAppearance"in m.documentElement.style);b("safari",0<p.call(window.HTMLElement).indexOf("Constructor"));b("ie",function(){return!!m.documentMode});b("mac",0<=navigator.appVersion.indexOf("Macintosh"));b("classlist",!!document.documentElement.classList);b("quirks","BackCompat"==document.compatMode);b("xpath",!!m.evaluate);b("air",!!e.runtime);
b("dart",!(!e.startDart&&!m.startDart));b("promise",!!e.Promise);b("touch","ontouchstart"in document||"onpointerdown"in document&&0<navigator.maxTouchPoints||window.navigator.msMaxTouchPoints);b("touchEvents","ontouchstart"in document);b("pointerEvents","onpointerdown"in document);b("MSPointer","msMaxTouchPoints"in navigator);b("qsa",!!document.querySelectorAll);return{has:c,add:b,load:function(a,c,l){a?c([a],l):l()},cache:g,clear:function(a){a.innerHTML="";return a},ie:a}});
hAzzle.define("Types",function(){var h=Object.prototype.toString,e=Array.isArray,m=function(a){return"string"===typeof a},n=function(a){return"number"===typeof a},p=function(a){return a&&a.window===a},g=function(a){return a?function(b){return h.call(b)==="[object "+a+"]"}:function(){}},a=function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b||"[object HTMLFormControlsCollection]"===b)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===
a(0)||a(0)&&a(0).tagName)return!0}catch(e){}return!1};this.isNodeList=a;return{isType:g,isArray:e,isEmpty:function(a){if(null==a)return!0;if(e(a)||m(a)||g("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:p,isObject:function(a){return null!==a&&"object"===typeof a},isPlainObject:function(a){return g("Object")(a)&&!p(a)&&Object.getPrototypeOf(a)==Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},
isNode:function(a){return!!a&&"object"===typeof a&&"nodeType"in a},isElement:function(a){return!(!a||!a.nodeName)},isString:m,isArrayLike:function(a){if(null==a||p(a))return!1;var b=a.length;return 1===a.nodeType&&b?!0:m(a)||e(a)||0===b||"number"===typeof b&&0<b&&b-1 in a},isNumber:n,isBoolean:function(a){return"boolean"===typeof a},isNaN:function(a){return n(a)&&a!=+a},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:a}});
hAzzle.define("text",function(){var h=function(e){var m,n="",p=0;m=e.nodeType;if(!m)for(;m=e[p++];)n+=h(m);else if(1===m||9===m||11===m){if("string"===typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=h(e)}else if(3===m||4===m)return e.nodeValue;return n};return{getText:h}});
hAzzle.define("util",function(){var h=Array.prototype.slice,e=hAzzle.require("types"),m=Object.keys,n=function(a,k,d,f){if(void 0===a||null==a)return a;hAzzle.err("function"!==typeof k,5,"'fn' must be a function in util.each()");var r,b=a.length,c;if("function"===typeof k&&"undefined"===typeof d&&"undefined"===typeof f&&e.isArray(a))for(;++r<b&&(r=f?a.length-r-1:r,!1!==k.call(a[r],a[r],r,a)););if(b===+b)for(r=0;r<b&&(r=f?a.length-r-1:r,!1!==k.call(a[r],a[r],r,a));r++);else if(a)for(c in a)if(!1===
k.call(a[c],a[c],c,a))break;return a},p=function(l,k,d){if("function"===typeof l){if(void 0===k)return l;d=d?d:3;return 1===d?function(a){return l.call(k,a)}:2===d?function(a,d){return l.call(k,a,d)}:3===d?function(a,d,b){return l.call(k,a,d,b)}:4===d?function(a,d,b,c){return l.call(k,a,d,b,c)}:function(){return l.apply(k,arguments)}}if(!l)return a},g=function(l,k,d){return l?"function"===typeof l?p(l,k,d):e.isObject(l)?c(l):t(l):a},a=function(a){return a},c=function(a){var k=b(a),d=k.length;return function(a){if(!a)return!d;
a=Object(a);for(var l=0,b,c;l<d;l++)if(b=k[l],c=b[0],b[1]!==a[c]||!(c in a))return!1;return!0}},b=function(a){for(var k=m(a),d=k.length,f=Array(d),b=0;b<d;b++)f[b]=[k[b],a[k[b]]];return f},t=function(a){return function(k){return k[a]}},q=function(a,k,d){if(null==a)return-1;var f=0,b=a.length;if(d)if("number"===typeof d)f=0>d?Math.max(0,b+d):d;else{d=g(void 0,void 0,1);for(var f=d(k),b=0,c=a.length;b<c;){var e=b+c>>>1;d(a[e])<f?b=e+1:c=e}f=b;return a[f]===k?f:-1}for(;f<b;f++)if(a[f]===k)return f;return-1};
return{map:function(a,k,d){if(a){k=g(k,d);d=a.length!==+a.length&&m(a);for(var f=(d||a).length,b=Array(f),c,e=0;e<f;e++)c=d?d[e]:e,b[e]=k.call(a[c],a[c],c,a);return b}return[]},some:function(a,k,d){if(a){k=g(k,d);d=(f||a).length;var f,b=0,c;for(a.length!==+a.length&&(f=f(a));b<d;b++)if(c=f?f[b]:b,k(a[c],c,a))return!0}return!1},reduce:function(a,k,d,f){a||(a=[]);k=p(k,f,4);var b=a.length!==+a.length&&m(a),c=(b||a).length,e=0,s;3>arguments.length&&(hAzzle.err(!c,7," no collection length exist in collection.reduce()"),
d=a[b?b[e++]:e++]);for(;e<c;e++)s=b?b[e]:e,d=k(d,a[s],s,a);return d},each:n,mixin:function(a){if(e.isObject(a))for(var b,d,f=1,c=arguments.length;f<c;f++)for(d in b=arguments[f],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},makeArray:function(a){if(e.isArray(a))return a;for(var b=-1,d=a.length,f=Array(d);++b<d;)f[b]=a[b];return f},merge:function(a,b){for(var d=+b.length,f=0,c=a.length;f<d;f++)a[c++]=b[f];a.length=c;return a},nodeName:function(a,b){return a&&a.nodeName&&a.nodeName.toLowerCase()===
b.toLowerCase()},unique:function(a,b,d,f){if(!a)return[];e.isBoolean(b)&&(f=d,d=b,b=!1);void 0!==d&&(d=g(d,f));f=[];for(var c=[],h=0,m,s=a.length;h<s;h++)if(m=a[h],b)h&&c===m||f.push(m),c=m;else if(d){var w=d(m,h,a);0>q(c,w)&&(c.push(w),f.push(m))}else 0>q(f,m)&&f.push(m);return f},indexOf:q,filter:function(a,b,d){var f=[];if(!a)return f;b=g(b,d);n(a,function(a,d,c){b(a,d,c)&&f.push(a)});return f},now:Date.now,bind:function(a,b){var d=2<arguments.length?h.call(arguments,2):[],f;"string"===typeof b&&
(f=a[b],b=a,a=f);return"function"!==typeof a||b instanceof RegExp?b:d.length?function(){return arguments.length?a.apply(b||this,d.concat(h.call(arguments,0))):a.apply(b||this,d)}:function(){return arguments.length?a.apply(b||this,arguments):a.call(b||this)}}}});
hAzzle.define("Core",function(){var h=1,e=window.document,m=window.document,n="hAzzle_"+1*new Date,p,g,a=Array.prototype.indexOf,c={},b,t=e.createElement("div").compareDocumentPosition(e.createElement("div"))&1,q,l=function(){return!!q},k=function(a,b){a===b&&(q=!0);return 0},d=n.split("").sort(k).join("")===n,f=function(a,b){var f=b&&a,d=f&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(d)return d;if(f)for(;f=f.nextSibling;)if(f===b)return-1;return a?
1:-1},r=function(a){return/^[^{]+\{\s*\[native \w/.test(""+a)},v=function(a){var b,f,d,k;p=a=a.ownerDocument||a;b=a.documentElement;if(9!==p.nodeType||!p.documentElement)return e;e=a;if(f=b.getAttribute("__hAzzle"))return g=c[f];b.setAttribute("__hAzzle",h);g={id:++h};g.qsa=r(a.querySelectorAll);g.compare=r(b.compareDocumentPosition);g.contains=r(b.contains);g.QSABugs=d=[];g.matchesBugs=k=[];g.qsa&&(f=a.createElement("div"),f.appendChild(a.createElement("select")),(a=a.createElement("option")).setAttribute("selected",
""),f.firstChild.appendChild(a),f.querySelectorAll(":checked").length||d.push(":checked"),g.QSABugs=d.length&&new RegExp(d.join("|")));r(b=b.webkitMatchesSelector||b.mozMatchesSelector||b.oMatchesSelector||b.msMatchesSelector)&&(g.matchesSelector=b,g.disconMatch=b.call(f,"div"),g.matchesBugs=k.length&&new RegExp(k.join("|")));c[h]=g;return c[h]};v(e);var u=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},s=g.compare&&g.contains?function(a,b){var f=9===a.nodeType?
a.documentElement:a,d=b&&b.parentElement;return a===d||!!(d&&1===d.nodeType&&(f.contains?f.contains(d):a.compareDocumentPosition&&a.compareDocumentPosition(d)&16))}:function(a,b){if(b)for(;b=b.parentElement;)if(b===a)return!0;return!1},k=g.compare?function(f,d){if(f===d)return q=!0,0;var c=!f.compareDocumentPosition-!d.compareDocumentPosition;if(c)return c;c=(f.ownerDocument||f)===(d.ownerDocument||d)?f.compareDocumentPosition(d):1;return c&1||!t&&d.compareDocumentPosition(f)===c?f===p||f.ownerDocument===
m&&s(m,f)?-1:d===p||d.ownerDocument===m&&s(m,d)?1:b?a(b,f)-a(b,d):0:c&4?-1:1}:function(d,c){if(d===c)return q=!0,0;var k,e=0,l=d.parentNode,s=c.parentNode,g=[d],h=[c];if(!l||!s)return d===k?-1:c===k?1:l?-1:s?1:b?a(b,d)-a(b,c):0;if(l===s)return f(d,c);for(k=d;k=k.parentNode;)g.unshift(k);for(k=c;k=k.parentNode;)h.unshift(k);for(;g[e]===h[e];)e++;return e?f(g[e],h[e]):g[e]===m?-1:h[e]===m?1:0};return{environment:g,expando:n,addFeature:function(a,b){"string"===typeof a&&b&&(c[h][a]=b)},setDocument:v,
isXML:u,isHTML:!u(e),contains:s,unique:function(a){var f,c=[],e=0,s=0;q=!l;b=!d&&a.slice(0);a.sort(k);if(q){for(;f=a[s++];)f===a[s]&&(e=c.push(s));for(;e--;)a.splice(c[e],1)}b=null;return a},matches:g.matchesSelector,qsa:g.qsa,QSABugs:g.QSABugs,matchesBugs:g.matchesBugs}});
hAzzle.define("Collection",function(){var h=hAzzle.require("util"),e=hAzzle.require("types"),m=Array.prototype,n=m.concat,p=m.push,g=function(a,c,b){"undefined"===typeof c&&(c=0);"undefined"===typeof b&&(b=a?a.length:0);var e=-1;b=b-c||0;for(var g=Array(0>b?0:b);++e<b;)g[e]=a[c+e];return g};this.toJqueryZepto=function(){for(var a=this.length,c=this.elements;a--;)this[a]=c[a];return this};this.get=function(a){return void 0===a?g(a,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=function(a){var c=
this.length;a=+a+(0>a?c:0);return hAzzle(0<=a&&a<c?[this.elements[a]]:[])};this.reduce=function(a,c,b){return h.reduce(this.elements,a,c,b)};this.indexOf=function(a,c,b){return null==c?-1:m.indexOf.call(c,a,b)};this.map=function(a,c){return hAzzle(h.map(this.elements,a,c))};this.each=function(a,c,b){h.each(this.elements,a,c,b);return this};this.slice=function(a,c){return hAzzle(g(this.elements,a,c))};this.concat=function(){var a=h.map(g(arguments),function(a){return a instanceof hAzzle?a.elements:
a});return hAzzle(n.apply(this.elements,a))};this.contents=function(){return this.map(function(){return this.contentDocument||g(this.childNodes)||[]})};this.is=function(a){return a?0<this.length&&0<this.filter(a).length:!1};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var c=this.elements;return a?"string"===typeof a?h.indexOf(hAzzle(a).elements,c[0]):h.indexOf(c,a instanceof hAzzle?a.elements[0]:a):c[0]&&c[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,
c){return this.concat("string"===typeof a?hAzzle(a,c).elements:a)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};h.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,c){this[c]=function(b){return this.map(function(){return this[a]}).filter(b)}}.bind(this));
h.each({prevAll:"previousElementSibling",nextAll:"nextElementSibling"},function(a,c){this[c]=function(){var b=[];this.each(function(c){for(;(c=c[a])&&9!==c.nodeType;)b.push(c)});return hAzzle(b)}}.bind(this));h.each("shift splice unshift join lastIndexOf forEach reduceRight".split(" "),function(a){this[a]=function(){return this.elements[a].apply(this.elements,arguments)}}.bind(this));return{makeArray:function(a,c){var b=c||[];void 0!==a&&(e.isArrayLike(Object(a))?h.merge(b,e.isString(a)?[a]:a):p.call(b,
a));return b},arrayRemove:function(a,c){var b=a.indexOf(c);0<=b&&a.splice(b,1);return c},slice:g}});
hAzzle.define("Jiesa",function(){var h=hAzzle.require("util"),e=hAzzle.require("core"),m=hAzzle.require("collection"),n=hAzzle.require("types"),p=hAzzle.require("has"),g=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,a=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,c=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,b=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,t=/^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,q=/^\s*[+~]/,l=/[\n\t\r]/g,k={":enabled":function(a){return!1===a.disabled},":disabled":function(a){return!0===
a.disabled},":checked":function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},":hidden":function(a){var b=a.style;return!b||"none"!==b.display&&"hidden"!==b.visibility?"hidden"===a.type:!0},":visible":function(a){return!k[":hidden"](a)}},d=function(a,b,f){var d=a,k=a.getAttribute("id"),e=k||"__hAzzle__",l=a.parentNode,g=q.test(b);if(g&&!l)return[];k?e=e.replace(/'/g,"\\$&"):a.setAttribute("id",e);g&&l&&(a=a.parentNode);b=b.match(c);for(l=0;l<b.length;l++)b[l]=
"[id='"+e+"'] "+b[l];b=b.join(",");try{return f.call(a,b)}finally{k||d.removeAttribute("id")}},f=function(a,b,f){return f&&9!==f.nodeType?d(f,b,function(b){return a.matches(b)}):a.matches(b)},r=function(a){return a?"string"===typeof a?v(a):!a.nodeType&&n.isArrayLike(a)?a[0]:a:document},v=function(b,f){var c,k,n,q,t=[];f=r(f);if(!b||"string"!==typeof b)return t;if(1!==(k=f.nodeType)&&9!==k&&11!==k)return[];if(e.isHTML){if(c=g.exec(b)){if(b=c[1]){if(9===k)return(n=f.getElementById(b))&&n.id===b?[n]:
[];if(f.ownerDocument&&(n=f.ownerDocument.getElementById(b))&&e.contains(f,n)&&n.id===c)return[n]}else if(b=c[2])q=f.getElementsByClassName(b);else if(b=c[3])q=f.getElementsByTagName(b);return m.slice(q)}if(c=a.exec(b)){k=f.getElementsByTagName(c[1]);var v=c[2],u=c[3];h.each(k,function(a){var b;(b=a.id===v)||(b=p.has("classList")?a.classList.contains(u):0<=(" "+a.className+" ").replace(l," ").indexOf(u));b&&t.push(a)});return t}}if(e.qsa&&(!e.QSABugs||!e.QSABugs.test(b)))try{return q=1===f.nodeType?
d(f,b,f.querySelectorAll):f.querySelectorAll(b),m.slice(q)}catch(x){}},u=function(a,d,c){if(d.nodeType)return a===d;(a.ownerDocument||a)!==document&&e.setDocument(a);d="string"===typeof d?d.replace(b,"='$1']"):d;if(d instanceof hAzzle)return h.some(d.elements,function(b){return u(a,b)});if(a===document)return!1;var l=t.exec(d);if(l)return l[1]&&(l[1]=l[1].toLowerCase()),l[3]&&(l[3]=l[3].split("=")),l[4]&&(l[4]=" "+l[4]+" "),(!l[1]||a.nodeName.toLowerCase()===l[1])&&(!l[2]||a.id===l[2])&&(!l[3]||(l[3][1]?
a.getAttribute(l[3][0])===l[3][1]:a.hasAttribute(l[3][0])))&&(!l[4]||0<=(" "+a.className+" ").indexOf(l[4]));if(l=k[d])return!!l(a);if(!e.matches||!e.isHTML||e.rbuggyMatches&&e.rbuggyMatches.test(d)||e.QSABugs&&e.QSABugs.test(d))hAzzle.err(!0,23," jiesa.js module need to be installed");else try{var g=f(a,d,c);if(g||e.disconMatch||a.document&&11!==a.document.nodeType)return g}catch(m){}};this.find=function(a,b,f){if(!f){if("string"!==typeof a){var d=0,c=this.length,k=this.elements;return hAzzle(h.filter(hAzzle(a).elements,
function(a){for(;d<c;d++)if(e.contains(k[d],a))return!0}))}return h.reduce(this.elements,function(b,f){return hAzzle(b.concat(m.slice(v(a,f))))},[])}return v(a,b)};this.filter=function(a,b){if(void 0===a)return this;if("function"===typeof a){var f=[];this.each(function(b,d){a.call(b,d)&&f.push(b)});return hAzzle(f)}return this.filter(function(){return u(this,a)!==(b||!1)})};return{matchesSelector:f,matches:u,pseudos:k,find:v}});
hAzzle.define("Strings",function(){var h=/[A-Z]/g,e=/([\:\-\_]+(.))/g,m=/^moz([A-Z])/,n=[],p=function(a,c,b,e){return e?b.toUpperCase():b},g=function(a){return"-"+a.charAt(0).toLowerCase()};return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(h,g):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():
a},camelize:function(a){return n[a]?n[a]:n[a]=a.replace(e,p).replace(m,"Moz$1")},trim:function(a){return"string"===typeof a?a.trim():a},lowercase:function(a){return"string"===typeof a?a.toLowerCase():a},uppercase:function(a){return"string"===typeof a?a.toUpperCase():a}}});
hAzzle.define("storage",function(){var h=hAzzle.require("util"),e=hAzzle.require("strings"),m=hAzzle.require("types"),n=hAzzle.require("core"),p=e.camelize,g=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,a=/([A-Z])/g,c=/\S+/g,b=function(b,c,d){if(void 0===d&&1===b.nodeType)if(d="data-"+c.replace(a,"-$1").toLowerCase(),d=b.getAttribute(d),"string"===typeof d){try{d="true"===d?!0:"false"===d?!1:"null"===d?null:+d+""===d?+d:g.test(d)?JSON.parse(d+""):d}catch(f){}q.set(b,c,d)}else d=void 0;return d},e=function(){this.expando=
n.expando+Math.random()};e.prototype={constructor:e,register:function(a,b){hAzzle.err(!m.isObject(a),22,"no valid DOM element in storage.js");a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperty(a,this.expando,{value:b||{},writable:!0,configurable:!0});return a[this.expando]},cache:function(a,b){if(!a||1!==a.nodeType&&9!==a.nodeType&&+a.nodeType)return{};var d=a[this.expando];return d?d:this.register(a,b)},set:function(a,b,d){if(a){var f;if(a=this.cache(a)){if("string"===typeof b)a[b]=d;
else if(m.isEmptyObject(a))h.mixin(a,b);else for(f in b)a[f]=b[f];return a}}},access:function(a,b,d){if(void 0===b||b&&"string"===typeof b&&void 0===d)return d=this.get(a,b),void 0!==d?d:this.get(a,p(b));this.set(a,b,d);return void 0!==d?d:b},get:function(a,b){var d=this.cache(a);if(d)return void 0!==d&&void 0===b?d:d[b]},release:function(a,b){var d,f,e=this.cache(a);if(void 0===b)this.register(a);else for(m.isArray(b)?f=b.concat(b.map(p)):(d=p(b),b in e?f=[b,d]:(f=d,f=e[f]?[f]:f.match(c)||[])),d=
f.length;d--;)delete e[f[d]]},hasData:function(a){return!m.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var t=new e,q=new e;this.data=function(a,c){var d,f,e,g=this.elements[0],h=g&&g.attributes;if(void 0===a){if(this.length&&(e=q.get(g),1===g.nodeType&&!t.get(g,"hasDataAttrs"))){for(d=h.length;d--;)h[d]&&(f=h[d].name,0===f.indexOf("data-")&&(f=p(f.slice(5)),b(g,f,e[f])));t.set(g,"hasDataAttrs",!0)}return e}if("object"===typeof a)return this.each(function(b){q.set(b,
a)});var m=p(a);if(g&&void 0===c){e=q.get(g,a);if(void 0!==e)return e;e=q.get(g,m);var w=t.get(this,"hasDataAttrs"),n=-1!==a.indexOf("-");if(void 0!==e)return e;e=b(g,m,void 0);if(void 0!==e)return e}else this.each(function(b){var f=q.get(b,m);q.set(b,m,c);n&&void 0!==f&&q.set(b,a,c);n&&void 0===w&&q.set(b,a,c)})};this.removeData=function(a){return this.each(function(b){q.release(b,a)})};return{"private":t,data:q}});
hAzzle.define("css",function(){var h=hAzzle.require("storage"),e=hAzzle.require("has"),m="b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img mapobject q script span sub button input label select textarea".split(" "),n=/^(-?[\d+\.\-]+)([a-z]+|%)$/i,p=document.documentElement,g,a={},c=function(a){if(a&&a.nodeType&&null!==a.ownerDocument){var b=!1;return a||a.elements?a?(void 0!==a.ownerDocument&&(b=a.ownerDocument.defaultView),b&&b.opener?b.getComputedStyle(a,null):window.getComputedStyle(a,
null)):a.style:void 0}return""},b=function(a){if(a)return void 0===h["private"].get(a,"css")&&h["private"].access(a,"css",{computedStyle:null}),h["private"].get(a,"css")},t=function(a){return!a||void 0!==b(a).computedStyle&&null!=b(a).computedStyle?b(a).computedStyle:b(a).computedStyle=c(a)},q=function(a){return parseFloat(a)||0},l=function(a){if(a){a=a.tagName.toLowerCase();if(a in m)return"inline";if("li"===a)return"list-item";if("tr"===a)return"table-row";if("table"===a)return"table"}return"block"},
k=function(a,b,c){if(null!==a&&void 0!==a&&(a=null!=a&&a instanceof hAzzle?a.elements:a.length?a[0]:a,!a||!a.elements)){var h=0,m=["paddingTop","paddingBottom","borderTop","borderBottom"],w=4;"width"!==b&&"height"!==b||0!==k(a,"display")||(a.style.display="none",a.style.display=l(a));if(!c||void 0===c){if("height"===b&&"border-box"!==k(a,"boxSizing"))return a.offsetHeight-q(k(a,"borderTopWidth"))-q(k(a,"borderBottomWidth"))-q(k(a,"paddingTop"))-q(k(a,"paddingBottom"))+"px";if("width"===b&&"border-box"!==
k(a,"boxSizing"))return a.offsetWidth-q(k(a,"borderLeftWidth"))-q(k(a,"borderRightWidth"))-q(k(a,"paddingLeft"))-q(k(a,"paddingRight"))+"px"}c=t(a);"fontSize"===b?h=d(a,"1em","left",1)+"px":c&&((e.ie||e.has("firefox"))&&"borderColor"===b&&(b="borderTopColor"),h=9===e.ie&&"filter"===b?c.getPropertyValue(b):c[b],""!==h||hAzzle.require("Core").contains(a.ownerDocument,a)||(h=a.style[b]));c=(h.match(n)||[])[2];if("%"===c&&g)if("top"===b||"bottom"===b){for(a=(b=a.parentNode||a).offsetHeight;w--;)a-=parseFloat(k(b,
m[w]));h=parseFloat(h)/100*a+"px"}else h=d(a,h);if("auto"===h||c&&"px"!==c)h=0;return void 0!==h?h+"":h}},d=function(b,d,c,e){c=c||"width";var g;g=(d.match(n)||[])[2];var h="px"===g?1:a[g+"toPx"],l=/r?em/i;h||l.test(g)&&!e?(b=h?b:"rem"===g?p:"fontSize"===c?b.parentNode||b:b,h=h||parseFloat(k(b,"fontSize"),!0),b=parseFloat(d)*h):(e=b.style,g=e[c],e[c]=d,b=e[c]?parseFloat(k(b,c,!0)):0,e[c]=void 0!==g?g:null);return b};(function(){var b=[1/25.4,1/2.54,1/72,1/6],e="mm cm pt pc in mozmm".split(" "),k=
e.length,h=document.createElement("div");p.appendChild(h);h.style.marginTop="1%";for(g="1%"===c(h).marginTop;k--;)a[e[k]+"toPx"]=b[k]?b[k]*a.inToPx:d(h,"1"+e[k]);p.removeChild(h)})();return{computed:b,display:l,styles:t,toPx:d,css:k}});
hAzzle.define("setters",function(){var h=hAzzle.require("util"),e=hAzzle.require("core"),m=hAzzle.require("types"),n=/\S+/g,p=/\r/g,g="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),a={},c={},b={"class":"className","for":"htmlFor"},t={get:{},set:{}},q={get:{},set:{}},l={get:{},
set:{}},k={get:{},set:{}},d=function(a){return a instanceof hAzzle?a.elements:a},f={1:1,4:1,5:1,6:1,7:1,9:1,10:1,11:1,12:1},r=function(b,d){var e=a[d.toLowerCase()];return e&&c[b.nodeName]&&e},v=function(a,c){a=d(a);var e,f,k=0,g=c&&c.match(n);if(g&&1===a.nodeType)for(;e=g[k++];)f=b[e]||e,r(a,e)?a[f]=!1:a.removeAttribute(e),a.removeAttribute(e)},u=function(a,b,c){var g=(a=d(a))?a.nodeType:void 0,h,l;if(a&&f[a.nodeType]){if("undefined"===typeof a.getAttribute)return s(a,b,c);1===g&&e.isXML(a)||(b=
b.toLowerCase(),h=q["undefined"===c?"get":"set"][b]||r(a,b)?k["undefined"===c?"get":"set"][b]:!1);if(void 0===c){if(h&&(l=h.get(a,b))&&null!==l)return l;l=a.getAttribute(b,2);return null==l?void 0:l}if(!1===c||null==c)v(a,b);else{if(h&&void 0!==(l=h.set(a,c,b)))return l;a.setAttribute(b,c+"")}}return""},s=function(a,c,k){var g=(a=d(a))?a.nodeType:void 0,h,l;if(a&&f[a.nodeType]){if(1!==g||e.isHTML)c=b[c]||c,h="undefined"===k?t.get[c]:t.set[c];return"undefined"!==typeof k?h&&void 0!==(l=h.set(a,k,c))?
l:a[c]=k:h&&null!==(l=h(a,c))?l:a[c]}return""};this.val=function(a){var b,c,d;c=this.elements[0];if(arguments.length)return d=m.isType("Function")(a),this.each(function(c,e){var f;1===c.nodeType&&(f=d?a.call(c,e,hAzzle(c).val()):a,null==f?f="":"number"===typeof f?f+="":m.isArray(f)&&(f=h.map(f,function(a){return null==a?"":a+""})),b=l.set[c.type]||l.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,f,"value")||(c.value=f))});if(c){if(b=l.get[c.type]||l.get[c.nodeName.toLowerCase()])return b(c,"value");
c=c.value;return"string"===typeof c?c.replace(p,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){h.each(a,function(a,c){s(b,c,a)})});if("undefined"===typeof b)return s(c[0],a);this.each(c,function(c){s(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[b[a]||a]})};this.removeAttr=function(a){return this.each(function(b){v(b,
a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){h.each(a,function(a,c){u(b,c,a)})}):"undefined"===typeof b?u(c[0],a):this.each(function(c){u(c,a,b)})};h.each(g,function(b){a[g[b]]=g[b]});h.each("input select option textarea button form details".split(" "),function(a){c[a.toUpperCase()]=!0});h.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),
function(a){b[a.toLowerCase()]=a});return{attrHooks:q,propHooks:t,valHooks:l,nodeHooks:k,propMap:b,boolAttr:a,boolElem:c,removeAttr:v,attr:u,prop:s}});
hAzzle.define("attrHooks",function(){var h=hAzzle.require("util"),e=hAzzle.require("setters"),m=function(){var e=document.createElement("input");e.type="checkbox";e=document.createElement("input");e.value="t";e.type="radio";return"t"===e.value}();h.mixin(e.attrHooks.set,{type:function(e,p){if(!m&&"radio"===p&&h.nodeName(e,"input")){var g=e.value;e.setAttribute("type",p);g&&(e.value=g);return p}}});return{}});
hAzzle.define("prophooks",function(){var h=hAzzle.require("setters");hAzzle.require("util").mixin(h.propHooks.get,{tabIndex:function(e){return e.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(e.nodeName)||e.href?e.tabIndex:-1}});(function(){document.createElement("select").appendChild(document.createElement("option")).selected||(h.propHooks.get.selected=function(e){(e=e.parentNode)&&e.parentNode&&e.parentNode.selectedIndex;return null})})();return{}});
hAzzle.define("valHooks",function(){var h=hAzzle.require("util"),e=hAzzle.require("strings"),m=hAzzle.require("text"),n=hAzzle.require("types"),p=hAzzle.require("collection"),g=hAzzle.require("setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}();h.mixin(g.valHooks.set,{select:function(a,b){for(var e,h,g=a.options,k=p.makeArray(b),d=g.length;d--;)if(h=g[d],h.selected=k.contains(h.value))e=!0;e||(a.selectedIndex=
-1);return k}});h.mixin(g.valHooks.get,{option:function(a){var b=a.getAttribute(name,2);return null!==b?b:e.trim(m.getText(a))},select:function(a){var b=a.selectedIndex,e="select-one"===a.type;a=a.options;var h=[],g,k,d;if(0>b)return"";d=e?b:0;for(k=e?b+1:a.length;d<k;d++)if(g=a[d],g.selected&&null===g.getAttribute("disabled")&&(!g.parentElement.disabled||"OPTGROUP"!==g.parentElement.tagName)){g=hAzzle(g).val();if(e)return g;h.push(g)}return e&&!h.length&&a.length?a[b].value:h}});h.each(["radio",
"checkbox"],function(a){g.valHooks.set[a]=function(a,c){if(n.isArray(c))return a.checked=c.contains(hAzzle(a).val())}});a||(g.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(h){function e(a){return"string"===typeof a?h.document.createTextNode(a):a}function m(a){var b=h.document.createDocumentFragment(),c=p.call(a,0),g=0,d=a.length;if(1===a.length)return e(a[0]);for(;g<d;g++)try{b.appendChild(e(c[g]))}catch(f){}return b}for(var n=Array.prototype,p=n.slice,g=n.indexOf,n=(h.Element||h.Node||h.HTMLElement).prototype,a=["append",function(){try{this.appendChild(m(arguments))}catch(a){}},"prepend",function(){try{this.firstChild?this.insertBefore(m(arguments),this.firstChild):
this.appendChild(m(arguments))}catch(a){}},"before",function(){var a=this.parentElement;a&&a.insertBefore(m(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(m(arguments),this.nextSibling):this.parentElement.appendChild(m(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(m(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",n.matchesSelector||n.webkitMatchesSelector||
n.mozMatchesSelector||n.msMatchesSelector||function(a){var b=this.parentElement;return!!b&&-1<g.call(b.querySelectorAll(a),this)}],c=a.length;c;c-=2)n[a[c-2]]||(n[a[c-2]]=a[c-1]);try{new h.CustomEvent("?")}catch(b){h.CustomEvent=function(a,b){function c(a,b,e,g){this.initEvent(a,b,e);this.detail=g}return function(e,d){var f=document.createEvent(a);if("string"!==typeof e)throw Error("An event name must be provided");"Event"===a&&(f.initCustomEvent=c);null==d&&(d=b);f.initCustomEvent(e,d.bubbles,d.cancelable,
d.detail);return f}}(h.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}[].contains||Object.defineProperty(Array.prototype,"contains",{enumerable:!1,configurable:!0,writable:!0,value:function(a,b){if(void 0===this||null===this)throw new TypeError("Cannot convert this value to object");var c=Object(this),e=parseInt(c.length)||0;if(1>e)return!1;var d=Math.floor(b||0);if(d>=e||4294967295<d)return!1;0>d&&(d=e+d);if(-Infinity===d||0>d)d=0;0<=d||(d=e+Math.abs(d),0>d&&(d=0));for(;d<
e;){var f=c[d];if(a===f||a!==a&&f!==f)return!0;d+=1}return!1}})})(window);
