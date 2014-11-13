/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.2a
 * Released under the MIT License.
 *
 * Date: 2014-11-14
 */
 
(function(){var f={},h={},l=function(a,c,b){if(a)throw Error("[hAzzle-"+c+"] "+b);},m=function(a){if(a&&"string"===typeof a)return f[a.toLowerCase()]},n=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},d=function(a,c){if(a){if(!(this instanceof d))return new d(a,c);if(a instanceof d)return a;var b;b=m("Util");"function"===typeof a&&(h.ready?m("ready").ready(a):l(!0,6,"ready.js module not installed"));b="string"===typeof a?h.manipulation&&"<"===a[0]&&">"===a[a.length-1]&&3<=a.length?m("manipulation").create(a,
c&&c.nodeType?c.ownerDocument||c:document):this.find(a,c,!0):Array.isArray(a)?b.unique(b.filter(a,n)):this.isNodeList(a)?b.filter(b.makeArray(a),n):a.nodeType?11===a.nodeType?a.children:[a]:a===window?[a]:[];void 0===b?(this.length=0,this.elements=[]):(this.elements=b,this.length=b.length);return this}};d.err=l;d.installed=h;d.require=m;d.define=function(a,c){"string"!==typeof a||"function"!==typeof c||f[a]||(h[a.toLowerCase()]=!0,f[a.toLowerCase()]=c.call(d.prototype))};d.codename="new-age";d.version=
"1.0.1b";window.hAzzle=d})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var f=navigator.userAgent,h=window,l=h.document,m=l.createElement("div"),n=Object.prototype.toString,d={},a=function(){if(l.documentMode)return l.documentMode;for(var a=7,c;4<a;a--)if(c=l.createElement("div"),c.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e",c.getElementsByTagName("span").length)return a}(),c=function(a){return"function"===typeof d[a]?d[a]=d[a](h,l,m):d[a]},b=function(a,b,k,q){("undefined"===typeof d[a]||q)&&(d[a]=b);return k&&c(a)};b("multiArgs",
function(){var a=document.createElement("div");a.classList.add("a","b");return/(^| )a( |$)/.test(a.className)&&/(^| )b( |$)/.test(a.className)});b("mobile",/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(f));b("android",/^Android/i.test(f));b("opera","[object Opera]"===n.call(window.opera));b("firefox","undefined"!==typeof InstallTrigger);b("chrome",h.chrome);b("webkit","WebkitAppearance"in l.documentElement.style);b("safari",0<n.call(window.HTMLElement).indexOf("Constructor"));
b("ie",function(){return!!l.documentMode});b("classlist",!!document.documentElement.classList);return{has:c,add:b,load:function(a,c,b){a?c([a],b):b()},cache:d,clear:function(a){a.innerHTML="";return a},ie:a}});
hAzzle.define("Types",function(){var f=Object.prototype.toString,h=Array.isArray,l=function(a){return"string"===typeof a},m=function(a){return"number"===typeof a},n=function(a){return a&&a.window===a},d=function(a){return a?function(b){return f.call(b)==="[object "+a+"]"}:function(){}},a=function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===a(0)||a(0)&&a(0).tagName)return!0}catch(h){}return!1};
this.isNodeList=a;return{isType:d,isArray:h,isEmpty:function(a){if(null==a)return!0;if(h(a)||l(a)||d("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:n,isObject:function(a){return null!==a&&"object"===typeof a},isPlainObject:function(a){return d("Object")(a)&&!n(a)&&Object.getPrototypeOf(a)==Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},isNode:function(a){return!!a&&"object"===typeof a&&
"nodeType"in a},isElement:function(a){return!(!a||!a.nodeName)},isString:l,isArrayLike:function(a){if(null==a||n(a))return!1;var b=a.length;return 1===a.nodeType&&b?!0:l(a)||h(a)||0===b||"number"===typeof b&&0<b&&b-1 in a},isNumber:m,isBoolean:function(a){return"boolean"===typeof a},isNaN:function(a){return m(a)&&a!=+a},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:a}});
hAzzle.define("text",function(){var f=function(h){var l,m="",n=0;l=h.nodeType;if(!l)for(;l=h[n++];)m+=f(l);else if(1===l||9===l||11===l){if("string"===typeof h.textContent)return h.textContent;for(h=h.firstChild;h;h=h.nextSibling)m+=f(h)}else if(3===l||4===l)return h.nodeValue;return m};return{getText:f}});
hAzzle.define("util",function(){var f=Array.prototype.slice,h=hAzzle.require("types"),l=Object.keys,m=function(a,g){return Object.prototype.hasOwnProperty.call(a,g)},n=function(a,g,e,b){if(void 0===a)return a;hAzzle.err("function"!==typeof g,5,"'fn' must be a function in util.each()");var s,c=a.length,k;if("function"===typeof g&&"undefined"===typeof e&&"undefined"===typeof b&&h.isArray(a))for(;++s<c&&(s=b?a.length-s-1:s,!1!==g.call(a[s],a[s],s,a)););if(c===+c)for(s=0;s<c&&(s=b?a.length-s-1:s,!1!==
g.call(a[s],a[s],s,a));s++);else if(a)for(k in a)if(!1===g.call(a[k],a[k],k,a))break;return a},d=function(a,g,e){if("function"===typeof a){if(void 0===g)return a;e=e?e:3;return 1===e?function(e){return a.call(g,e)}:2===e?function(e,b){return a.call(g,e,b)}:3===e?function(e,b,c){return a.call(g,e,b,c)}:4===e?function(e,b,c,k){return a.call(g,e,b,c,k)}:function(){return a.apply(g,arguments)}}if(!a)return c},a=function(a,g,e){return a?"function"===typeof a?d(a,g,e):h.isObject(a)?b(a):p(a):c},c=function(a){return a},
b=function(a){var g=r(a),e=g.length;return function(a){if(!a)return!e;a=Object(a);for(var q=0,b,c;q<e;q++)if(b=g[q],c=b[0],b[1]!==a[c]||!(c in a))return!1;return!0}},r=function(a){for(var g=l(a),e=g.length,b=Array(e),c=0;c<e;c++)b[c]=[g[c],a[g[c]]];return b},p=function(a){return function(g){return g[a]}},k=function(q,g,e){if(null==q)return-1;var b=0,c=q.length;if(e)if("number"===typeof e)b=0>e?Math.max(0,c+e):e;else{e=a(void 0,void 0,1);for(var b=e(g),c=0,k=q.length;c<k;){var h=c+k>>>1;e(q[h])<b?
c=h+1:k=h}b=c;return q[b]===g?b:-1}for(;b<c;b++)if(q[b]===g)return b;return-1};return{map:function(b,g,e){if(b){g=a(g,e);e=b.length!==+b.length&&l(b);for(var c=(e||b).length,k=Array(c),h,d=0;d<c;d++)h=e?e[d]:d,k[d]=g.call(b[h],b[h],h,b);return k}return[]},some:function(b,g,e){if(b){g=a(g,e);e=(c||b).length;var c,k=0,h;for(b.length!==+b.length&&(c=c(b));k<e;k++)if(h=c?c[k]:k,g(b[h],h,b))return!0}return!1},reduce:function(a,b,e,c){a||(a=[]);b=d(b,c,4);var k=a.length!==+a.length&&l(a),h=(k||a).length,
f=0,w;3>arguments.length&&(hAzzle.err(!h,7," no collection length exist in collection.reduce()"),e=a[k?k[f++]:f++]);for(;f<h;f++)w=k?k[f]:f,e=b(e,a[w],w,a);return e},each:n,mixin:function(a){if(h.isObject(a))for(var b,e,c=1,k=arguments.length;c<k;c++)for(e in b=arguments[c],b)m(b,e)&&(a[e]=b[e]);return a},makeArray:function(a){if(h.isArray(a))return a;for(var b=-1,e=a.length,c=Array(e);++b<e;)c[b]=a[b];return c},merge:function(a,b){for(var e=+b.length,c=0,k=a.length;c<e;c++)a[k++]=b[c];a.length=k;
return a},nodeName:function(a,b){return a&&a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},unique:function(b,g,e,c){if(!b)return[];h.isBoolean(g)&&(c=e,e=g,g=!1);void 0!==e&&(e=a(e,c));c=[];for(var d=[],f=0,l,w=b.length;f<w;f++)if(l=b[f],g)f&&d===l||c.push(l),d=l;else if(e){var x=e(l,f,b);0>k(d,x)&&(d.push(x),c.push(l))}else 0>k(c,l)&&c.push(l);return c},indexOf:k,filter:function(b,c,e){var k=[];if(!b)return k;c=a(c,e);n(b,function(a,b,e){c(a,b,e)&&k.push(a)});return k},now:Date.now,has:m,
bind:function(a,b){var e=2<arguments.length?f.call(arguments,2):[],c;"string"===typeof b&&(c=a[b],b=a,a=c);return"function"!==typeof a||b instanceof RegExp?b:e.length?function(){return arguments.length?a.apply(b||this,e.concat(f.call(arguments,0))):a.apply(b||this,e)}:function(){return arguments.length?a.apply(b||this,arguments):a.call(b||this)}}}});
hAzzle.define("Core",function(){var f=1,h=window.document,l=window.document,m="hAzzle_"+1*new Date,n,d,a=Array.prototype.indexOf,c={},b,r=h.createElement("div").compareDocumentPosition(h.createElement("div"))&1,p,k=function(){return!!p},q=function(a,b){a===b&&(p=!0);return 0},g=m.split("").sort(q).join("")===m,e=function(a,b){var e=b&&a,c=e&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(c)return c;if(e)for(;e=e.nextSibling;)if(e===b)return-1;return a?
1:-1},v=function(a){return/^[^{]+\{\s*\[native \w/.test(""+a)},s=function(a){var b,e,g,k;n=a=a.ownerDocument||a;b=a.documentElement;if(9!==n.nodeType||!n.documentElement)return h;h=a;if(e=b.getAttribute("__hAzzle"))return d=c[e];b.setAttribute("__hAzzle",f);d={id:++f};d.qsa=v(a.querySelectorAll);d.compare=v(b.compareDocumentPosition);d.contains=v(b.contains);d.QSABugs=g=[];d.matchesBugs=k=[];d.qsa&&(e=a.createElement("div"),e.appendChild(a.createElement("select")),(a=a.createElement("option")).setAttribute("selected",
""),e.firstChild.appendChild(a),e.querySelectorAll(":checked").length||g.push(":checked"),d.QSABugs=g.length&&new RegExp(g.join("|")));v(b=b.webkitMatchesSelector||b.mozMatchesSelector||b.oMatchesSelector||b.msMatchesSelector)&&(d.matchesSelector=b,d.disconMatch=b.call(e,"div"),d.matchesBugs=k.length&&new RegExp(k.join("|")));c[f]=d;return c[f]};s(h);var t=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},u=d.compare&&d.contains?function(a,b){var e=9===a.nodeType?
a.documentElement:a,c=b&&b.parentElement;return a===c||!!(c&&1===c.nodeType&&(e.contains?e.contains(c):a.compareDocumentPosition&&a.compareDocumentPosition(c)&16))}:function(a,b){if(b)for(;b=b.parentElement;)if(b===a)return!0;return!1},q=d.compare?function(e,c){if(e===c)return p=!0,0;var g=!e.compareDocumentPosition-!c.compareDocumentPosition;if(g)return g;g=(e.ownerDocument||e)===(c.ownerDocument||c)?e.compareDocumentPosition(c):1;return g&1||!r&&c.compareDocumentPosition(e)===g?e===n||e.ownerDocument===
l&&u(l,e)?-1:c===n||c.ownerDocument===l&&u(l,c)?1:b?a(b,e)-a(b,c):0:g&4?-1:1}:function(c,g){if(c===g)return p=!0,0;var k,h=0,d=c.parentNode,f=g.parentNode,q=[c],m=[g];if(!d||!f)return c===k?-1:g===k?1:d?-1:f?1:b?a(b,c)-a(b,g):0;if(d===f)return e(c,g);for(k=c;k=k.parentNode;)q.unshift(k);for(k=g;k=k.parentNode;)m.unshift(k);for(;q[h]===m[h];)h++;return h?e(q[h],m[h]):q[h]===l?-1:m[h]===l?1:0};return{environment:d,expando:m,addFeature:function(a,b){"string"===typeof a&&b&&(c[f][a]=b)},setDocument:s,
isXML:t,isHTML:!t(h),contains:u,unique:function(a){var e,c=[],h=0,d=0;p=!k;b=!g&&a.slice(0);a.sort(q);if(p){for(;e=a[d++];)e===a[d]&&(h=c.push(d));for(;h--;)a.splice(c[h],1)}b=null;return a},matches:d.matchesSelector,qsa:d.qsa,QSABugs:d.QSABugs,matchesBugs:d.matchesBugs}});
hAzzle.define("Collection",function(){var f=hAzzle.require("util"),h=hAzzle.require("types"),l=Array.prototype,m=l.concat,n=l.push,d=function(a,c,b){"undefined"===typeof c&&(c=0);"undefined"===typeof b&&(b=a?a.length:0);var h=-1;b=b-c||0;for(var d=Array(0>b?0:b);++h<b;)d[h]=a[c+h];return d};this.toJqueryZepto=function(){for(var a=this.length,c=this.elements;a--;)this[a]=c[a];return this};this.get=function(a){var c=this.elements;return void 0===a?d(c,0):0>a?c[this.length+a]:c[a]};this.eq=function(a){return hAzzle(-1===
a?d(this.elements,this.length-1):d(this.elements,a,a+1))};this.reduce=function(a,c,b){return f.reduce(this.elements,a,c,b)};this.indexOf=function(a,c,b){return null==c?-1:l.indexOf.call(c,a,b)};this.map=function(a,c){return hAzzle(f.map(this.elements,a,c))};this.each=function(a,c,b){f.each(this.elements,a,c,b);return this};this.slice=function(a,c){return hAzzle(d(this.elements,a,c))};this.concat=function(){var a=f.map(d(arguments),function(a){return a instanceof hAzzle?a.elements:a});return hAzzle(m.apply(this.elements,
a))};this.contents=function(){return this.map(function(){return this.contentDocument||d(this.childNodes)})};this.is=function(a){return 0<this.length&&0<this.filter(a).length};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var c=this.elements;return a?"string"===typeof a?f.indexOf(hAzzle(a).elements,c[0]):f.indexOf(c,a instanceof hAzzle?a.elements[0]:a):c[0]&&c[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,c){var b=a;"string"===typeof a&&(b=hAzzle(a,
c).elements);return this.concat(b)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};f.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,c){this[c]=function(b){return this.map(function(){return this[a]}).filter(b)}}.bind(this));f.each({prevAll:"previousElementSibling",
nextAll:"nextElementSibling"},function(a,c){this[c]=function(){var b=[];this.each(function(c){for(;(c=c[a])&&9!==c.nodeType;)b.push(c)});return hAzzle(b)}}.bind(this));return{makeArray:function(a,c){var b=c||[];void 0!==a&&(h.isArrayLike(Object(a))?f.merge(b,h.isString(a)?[a]:a):n.call(b,a));return b},inArray:function(a,c,b){return void 0===c?-1:l.indexOf.call(c,a,b)},slice:d,includes:function(a,c){return-1!=l.indexOf.call(a,c)},arrayRemove:function(a,c){var b=a.indexOf(c);0<=b&&a.splice(b,1);return c}}});
hAzzle.define("Jiesa",function(){var f=hAzzle.require("util"),h=hAzzle.require("core"),l=hAzzle.require("collection"),m=hAzzle.require("types"),n=hAzzle.require("has"),d=hAzzle.require("selector"),a=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,c=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,b=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,r=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,p=/^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,k=/^\s*[+~]/,q=/[\n\t\r]/g,g={":enabled":function(a){return!1===
a.disabled},":disabled":function(a){return!0===a.disabled},":checked":function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},":hidden":function(a){var b=a.style;return!b||"none"!==b.display&&"hidden"!==b.visibility?"hidden"===a.type:!0},":visible":function(a){return!g[":hidden"](a)}},e=function(a,e,c){var g=a,h=a.getAttribute("id"),d=h||"__hAzzle__",f=a.parentNode,q=k.test(e);if(q&&!f)return[];h?d=d.replace(/'/g,"\\$&"):a.setAttribute("id",d);q&&f&&
(a=a.parentNode);e=e.match(b);for(f=0;f<e.length;f++)e[f]="[id='"+d+"'] "+e[f];e=e.join(",");try{return c.call(a,e)}finally{h||g.removeAttribute("id")}},v=function(a,b,c){return c&&9!==c.nodeType?e(c,b,function(b){return a.matches(b)}):a.matches(b)},s=function(a){return a?"string"===typeof a?t(a):!a.nodeType&&m.isArrayLike(a)?a[0]:a:document},t=function(b,g){var k,m,r,p,v=[];g=s(g);if(!b||"string"!==typeof b)return v;if(1!==(m=g.nodeType)&&9!==m&&11!==m)return[];if(h.isHTML){if(k=a.exec(b)){if(b=
k[1]){if(9===m)return(r=g.getElementById(b))&&r.id===b?[r]:[];if(g.ownerDocument&&(r=g.ownerDocument.getElementById(b))&&h.contains(g,r)&&r.id===k)return[r]}else if(b=k[2])p=g.getElementsByClassName(b);else if(b=k[3])p=g.getElementsByTagName(b);return l.slice(p)}if(k=c.exec(b)){m=g.getElementsByTagName(k[1]);var u=k[2],t=k[3];f.each(m,function(a){var b;(b=a.id===u)||(b=n.has("classList")?a.classList.contains(t):0<=(" "+a.className+" ").replace(q," ").indexOf(t));b&&v.push(a)});return v}if(hAzzle.installed.selector&&
h.qsa&&(!h.QSABugs||!h.QSABugs.test(b)))try{return p=1===g.nodeType?e(g,b,g.querySelectorAll):g.querySelectorAll(b),l.slice(p)}catch(y){}}hAzzle.err(!hAzzle.installed.selector,22," the selector.js module need to be installed");return d.find(b,g)},u=function(a,b,e){if(b.nodeType)return a===b;(a.ownerDocument||a)!==document&&h.setDocument(a);b="string"===typeof b?b.replace(r,"='$1']"):b;if(b instanceof hAzzle)return f.some(b.elements,function(b){return u(a,b)});if(a===document)return!1;var c=p.exec(b);
if(c)return c[1]&&(c[1]=c[1].toLowerCase()),c[3]&&(c[3]=c[3].split("=")),c[4]&&(c[4]=" "+c[4]+" "),(!c[1]||a.nodeName.toLowerCase()===c[1])&&(!c[2]||a.id===c[2])&&(!c[3]||(c[3][1]?a.getAttribute(c[3][0])===c[3][1]:a.hasAttribute(c[3][0])))&&(!c[4]||0<=(" "+a.className+" ").indexOf(c[4]));if(c=g[b])return!!c(a);if(!h.matches||!h.isHTML||h.rbuggyMatches&&h.rbuggyMatches.test(b)||h.QSABugs&&h.QSABugs.test(b))return hAzzle.err(!hAzzle.installed.selector,22," the selector.js module need to be installed"),
d.matches(b,a,b);try{var k=v(a,b,e);if(k||h.disconMatch||a.document&&11!==a.document.nodeType)return k}catch(q){}};this.find=function(a,b,e){if(!e){if("string"!==typeof a){var c=0,g=this.length,k=this.elements;return hAzzle(f.filter(hAzzle(a).elements,function(a){for(;c<g;c++)if(h.contains(k[c],a))return!0}))}return f.reduce(this.elements,function(b,e){return hAzzle(b.concat(l.slice(t(a,e))))},[])}return t(a,b)};this.filter=function(a,b){if(void 0===a)return this;if("function"===typeof a){var e=[];
this.each(function(b,c){a.call(b,c)&&e.push(b)});return hAzzle(e)}return this.filter(function(){return u(this,a)!==(b||!1)})};return{matchesSelector:v,matches:u,pseudos:g,find:t}});
hAzzle.define("Strings",function(){var f=/[A-Z]/g,h=/([\:\-\_]+(.))/g,l=/^moz([A-Z])/,m=[],n=function(a,c,b,h){return h?b.toUpperCase():b},d=function(a){return"-"+a.charAt(0).toLowerCase()};return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(f,d):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():
a},camelize:function(a){return m[a]?m[a]:m[a]=a.replace(h,n).replace(l,"Moz$1")},trim:function(a){return"string"===typeof a?a.trim():a},lowercase:function(a){return"string"===typeof a?a.toLowerCase():a},uppercase:function(a){return"string"===typeof a?a.toUpperCase():a}}});
hAzzle.define("storage",function(){function f(){this.expando=d.expando+Math.random()}function h(b,h,g){if(void 0===g&&1===b.nodeType)if(g="data-"+h.replace(c,"-$1").toLowerCase(),g=b.getAttribute(g),"string"===typeof g){try{g="true"===g?!0:"false"===g?!1:"null"===g?null:+g+""===g?+g:a.test(g)?JSON.parse(g+""):g}catch(e){}p.set(b,h,g)}else g=void 0;return g}var l=hAzzle.require("util"),m=hAzzle.require("strings"),n=hAzzle.require("types"),d=hAzzle.require("core"),a=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
c=/([A-Z])/g,b=/\S+/g;f.accepts=function(a){if(a)return 1===a.nodeType||9===a.nodeType||!+a.nodeType};f.prototype={register:function(a,b){hAzzle.err(!n.isObject(a),22,"no valid DOM element in storage.js");var c={};c[this.expando]={value:b||{},writable:!0,configurable:!0};a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperties(a,c);return a[this.expando]},cache:function(a,b){if(!f.accepts(a))return{};var c=a[this.expando];return c?c:this.register(a,b)},set:function(a,b,c){if(a){var e;if(a=
this.cache(a)){if("string"===typeof b)a[b]=c;else if(n.isEmptyObject(a))l.mixin(a,b);else for(e in b)a[e]=b[e];return a}}},access:function(a,b,c){if(void 0===b||b&&"string"===typeof b&&void 0===c)return c=this.get(a,b),void 0!==c?c:this.get(a,m.camelize(b));this.set(a,b,c);return void 0!==c?c:b},get:function(a,b){var c=this.cache(a);if(c)return void 0!==c&&void 0===b?c:c[b]},release:function(a,c){var g,e,h=this.cache(a);if(void 0===c)this.register(a);else for(n.isArray(c)?e=c.concat(c.map(m.camelize)):
(g=m.camelize(c),c in h?e=[c,g]:(e=g,e=h[e]?[e]:e.match(b)||[])),g=e.length;g--;)delete h[e[g]]},hasData:function(a){return!n.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var r=new f,p=new f;this.data=function(a,b){var c,e,d,f=this.elements[0],l=f&&f.attributes;if(void 0===a){if(this.length&&(d=p.get(f),1===f.nodeType&&!r.get(f,"hasDataAttrs"))){for(c=l.length;c--;)l[c]&&(e=l[c].name,0===e.indexOf("data-")&&(e=m.camelize(e.slice(5)),h(f,e,d[e])));
r.set(f,"hasDataAttrs",!0)}return d}if("object"===typeof a)return this.each(function(b){p.set(b,a)});var n=m.camelize(a);if(f&&void 0===b){d=p.get(f,a);if(void 0!==d)return d;d=p.get(f,n);var w=r.get(this,"hasDataAttrs"),x=-1!==a.indexOf("-");if(void 0!==d)return d;d=h(f,n,void 0);if(void 0!==d)return d}else this.each(function(c){var e=p.get(c,n);p.set(c,n,b);x&&void 0!==e&&p.set(c,a,b);x&&void 0===w&&p.set(c,a,b)})};this.removeData=function(a){return this.each(function(b){p.release(b,a)})};return{"private":r,
data:p}});
hAzzle.define("css",function(){var f=hAzzle.require("storage"),h=hAzzle.require("has"),l="b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img mapobject q script span sub button input label select textarea".split(" "),m=/^(width|height)$/,n=/^(li)$/i,d=/^(tr)$/i,a=/^(table)$/i,c=/^margin/,b=/^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i,r=function(a){if(a)return void 0===f["private"].get(a,"css")&&f["private"].access(a,"css",{computedStyle:null}),f["private"].get(a,"css")},
p=function(a){var b;if(null===r(a).computedStyle){b=r(a);if(a&&null!==a.ownerDocument){var c=!1;a?(void 0!==a.ownerDocument&&(c=a.ownerDocument.defaultView),a=c&&c.opener?c.getComputedStyle(a,null):window.getComputedStyle(a,null)):a=a.style}else a="";b=b.computedStyle=a}else b=r(a).computedStyle;return b},k=function(a){return parseFloat(a)||0},q=function(b){if(b){b=b.tagName.toLowerCase();if(b in l)return"inline";if(n.test(b))return"list-item";if(d.test(b))return"table-row";if(a.test(b))return"table"}return"block"},
g=function(a,d,f){a=a instanceof hAzzle?a.elements[0]:a;var l=0;m.test(d)&&0===g(a,"display")&&(a.style.display="none",a.style.display=q(a));if(h.has("ie")&&"auto"===d){if("height"===d)return a.offsetHeight;if("width"===d)return a.offsetWidth}if(!f){if("height"===d&&"border-box"!==g(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-k(g(a,"borderTopWidth"))-k(g(a,"borderBottomWidth"))-k(g(a,"paddingTop"))-k(g(a,"paddingBottom"));if("width"===d&&"border-box"!==g(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-
k(g(a,"borderLeftWidth"))-k(g(a,"borderRightWidth"))-k(g(a,"paddingLeft"))-k(g(a,"paddingRight"))}if(f=p(a))if((h.ie||h.has("firefox"))&&"borderColor"===d&&(d="borderTopColor"),l=9===h.ie&&"filter"===d?f.getPropertyValue(d):f[d],""!==l||hAzzle.require("Core").contains(a.ownerDocument,a)||(l=a.style[d]),h.has("mobile")&&h.has("android")&&b.test(l)&&c.test(name)){var n=a.style;a=n.width;d=n.minWidth;f=n.maxWidth;n.minWidth=n.maxWidth=n.width=l;l=r.width;n.width=a;n.minWidth=d;n.maxWidth=f}return void 0!==
l?l+"":l};return{computed:r,display:q,styles:p,css:g}});
hAzzle.define("setters",function(){var f=hAzzle.require("util"),h=hAzzle.require("core"),l=hAzzle.require("types"),m=/\S+/g,n=/\r/g,d="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),a={},c={},b={"class":"className","for":"htmlFor"},r={get:{},set:{}},p={get:{},set:{}},k={get:{},
set:{}},q={get:{},set:{}},g={get:{},set:{}},e=function(a){return a instanceof hAzzle?a.elements:a},v=function(b,e){var g=a[e.toLowerCase()];return g&&c[b.nodeName]&&g},s=function(a,c){a=e(a);var g,d,h=0,f=c&&c.match(m);if(f&&1===a.nodeType)for(;g=f[h++];)d=b[g]||g,v(a,g)?a[d]=!1:a.removeAttribute(g),a.removeAttribute(g)},t=function(a,b,c){var d=(a=e(a))?a.nodeType:void 0,f,k;if(d&&(3!==d||8!==d||2!==d)){if("undefined"===typeof a.getAttribute)return u(a,b,c);1===d&&h.isXML(a)||(b=b.toLowerCase(),f=
p["undefined"===c?"get":"set"][b]||v(a,b)?g["undefined"===c?"get":"set"][b]:q["undefined"===c?"get":"set"][b]);if(void 0===c){if(f&&(k=f.get(a,b))&&null!==k)return k;k=a.getAttribute(b,2);return null==k?void 0:k}if(c){if(f&&void 0!==(k=f.set(a,c,b)))return k;a.setAttribute(b,c+"")}else s(a,b)}return""},u=function(a,c,g){var d=(a=e(a))?a.nodeType:void 0,f,k;if(d&&(3!==d||8!==d||2!==d)){if(1!==d||h.isHTML)c=b[c]||c,f="undefined"===g?r.get[c]:r.set[c];return"undefined"!==typeof g?f&&void 0!==(k=f.set(a,
g,c))?k:a[c]=g:f&&null!==(k=f(a,c))?k:a[c]}return""};this.val=function(a){var b,c,e;c=this.elements[0];if(arguments.length)return e=l.isType("Function")(a),this.each(function(c,g){var d;1===c.nodeType&&(d=e?a.call(c,g,hAzzle(c).val()):a,null==d?d="":"number"===typeof d?d+="":l.isArray(d)&&(d=f.map(d,function(a){return null==a?"":a+""})),b=k.set[c.type]||k.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,d,"value")||(c.value=d))});if(c){if(b=k.get[c.type]||k.get[c.nodeName.toLowerCase()])return b(c,"value");
c=c.value;return"string"===typeof c?c.replace(n,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){f.each(a,function(a,c){u(b,c,a)})});if("undefined"===typeof b)return u(c[0],a);this.each(c,function(c){u(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[b[a]||a]})};this.removeAttr=function(a){return this.each(function(b){s(b,
a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){f.each(a,function(a,c){t(b,c,a)})}):"undefined"===typeof b?t(c[0],a):this.each(function(c){t(c,a,b)})};f.each(d,function(b){a[d[b]]=d[b]});f.each("input select option textarea button form details".split(" "),function(a){c[a.toUpperCase()]=!0});f.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),
function(a){b[a.toLowerCase()]=a});return{attrHooks:p,propHooks:r,valHooks:k,boolHooks:g,nodeHooks:q,propMap:b,boolAttr:a,boolElem:c,removeAttr:s,attr:t,prop:u}});hAzzle.define("boolhooks",function(){var f=hAzzle.require("setters");f.boolHooks.set=function(h,l,m){!1===l?f.removeAttr(h,m):h.setAttribute(m,m);return m};return{}});
hAzzle.define("attrHooks",function(){var f=hAzzle.require("util"),h=hAzzle.require("setters"),l=function(){var f=document.createElement("input");f.type="checkbox";f=document.createElement("input");f.value="t";f.type="radio";return"t"===f.value}();f.mixin(h.attrHooks.set,{type:function(h,n){if(!l&&"radio"===n&&f.nodeName(h,"input")){var d=h.value;h.setAttribute("type",n);d&&(h.value=d);return n}}});return{}});
hAzzle.define("prophooks",function(){var f=hAzzle.require("util"),h=hAzzle.require("setters");f.mixin(h.propHooks.get,{tabIndex:function(f){return f.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(f.nodeName)||f.href?f.tabIndex:-1}});document.createElement("select").appendChild(document.createElement("option")).selected||(h.propHooks.get.selected=function(f){(f=f.parentNode)&&f.parentNode&&f.parentNode.selectedIndex;return null});return{}});
hAzzle.define("valHooks",function(){var f=hAzzle.require("util"),h=hAzzle.require("strings"),l=hAzzle.require("text"),m=hAzzle.require("types"),n=hAzzle.require("collection"),d=hAzzle.require("setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}(),c=function(a,c,d){var f=a.length;for(d=0>d?Math.max(0,f+d):d||0;d<f;d++)if(a[d]===c)return d;return-1};f.mixin(d.valHooks.set,{select:function(a,d){for(var f,
h,l=a.options,g=n.makeArray(d),e=l.length;e--;)if(h=l[e],h.selected=0<=c(g,h.value))f=!0;f||(a.selectedIndex=-1);return g}});f.mixin(d.valHooks.get,{option:function(a){var c=a.getAttribute(name,2);return null!==c?c:h.trim(l.getText(a))},select:function(a){var c=a.selectedIndex,d="select-one"===a.type;a=a.options;var f=[],h,g,e;if(0>c)return"";e=d?c:0;for(g=d?c+1:a.length;e<g;e++)if(h=a[e],h.selected&&null===h.getAttribute("disabled")&&(!h.parentElement.disabled||"OPTGROUP"!==h.parentElement.tagName)){h=
hAzzle(h).val();if(d)return h;f.push(h)}return d&&!f.length&&a.length?a[c].value:f}});f.each(["radio","checkbox"],function(a){d.valHooks.set[a]=function(a,b){if(m.isArray(b))return a.checked=0<=c(b,hAzzle(a).val())}});a||(d.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(f){function h(a){return"string"===typeof a?f.document.createTextNode(a):a}function l(a){var b=f.document.createDocumentFragment(),c=n.call(a,0),d=0,g=a.length;if(1===a.length)return h(a[0]);for(;d<g;d++)try{b.appendChild(h(c[d]))}catch(e){}return b}for(var m=Array.prototype,n=m.slice,d=m.indexOf,m=(f.Element||f.Node||f.HTMLElement).prototype,a=["append",function(){try{this.appendChild(l(arguments))}catch(a){}},"prepend",function(){try{this.firstChild?this.insertBefore(l(arguments),this.firstChild):
this.appendChild(l(arguments))}catch(a){}},"before",function(){var a=this.parentElement;a&&a.insertBefore(l(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(l(arguments),this.nextSibling):this.parentElement.appendChild(l(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(l(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",m.matchesSelector||m.webkitMatchesSelector||
m.mozMatchesSelector||m.msMatchesSelector||function(a){var b=this.parentElement;return!!b&&-1<d.call(b.querySelectorAll(a),this)}],c=a.length;c;c-=2)m[a[c-2]]||(m[a[c-2]]=a[c-1]);try{new f.CustomEvent("?")}catch(b){f.CustomEvent=function(a,b){function c(a,b,d,f){this.initEvent(a,b,d);this.detail=f}return function(d,f){var e=document.createEvent(a);if("string"!==typeof d)throw Error("An event name must be provided");"Event"===a&&(e.initCustomEvent=c);null==f&&(f=b);e.initCustomEvent(d,f.bubbles,f.cancelable,
f.detail);return e}}(f.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}})(window);