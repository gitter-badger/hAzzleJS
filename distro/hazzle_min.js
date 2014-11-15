/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.2a
 * Released under the MIT License.
 *
 * Date: 2014-11-15
 */
 
(function(){var l={},g={},h=function(a,c,b){if(a)throw Error("[hAzzle-"+c+"] "+b);},n=function(a){if(a&&"string"===typeof a)return l[a.toLowerCase()]},q=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},e=function(a,c){if(a){if(!(this instanceof e))return new e(a,c);if(a instanceof e)return a;var b;b=n("Util");"function"===typeof a&&(g.ready?n("ready").ready(a):h(!0,6,"ready.js module not installed"));b="string"===typeof a?g.manipulation&&"<"===a[0]&&">"===a[a.length-1]&&3<=a.length?n("manipulation").create(a,
c&&c.nodeType?c.ownerDocument||c:document):this.find(a,c,!0):Array.isArray(a)?b.unique(b.filter(a,q)):this.isNodeList(a)?b.filter(b.makeArray(a),q):a.nodeType?11===a.nodeType?a.children:[a]:a===window?[a]:[];void 0===b?(this.length=0,this.elements=[]):(this.elements=b,this.length=b.length);return this}};e.err=h;e.installed=g;e.require=n;e.define=function(a,c){"string"!==typeof a||"function"!==typeof c||l[a]||(g[a.toLowerCase()]=!0,l[a.toLowerCase()]=c.call(e.prototype))};e.codename="new-age";e.version=
"1.0.1b";window.hAzzle=e})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var l=navigator.userAgent,g=window,h=g.document,n=h.createElement("div"),q=Object.prototype.toString,e={},a=function(){if(h.documentMode)return h.documentMode;for(var a=7,c;4<a;a--)if(c=h.createElement("div"),c.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e",c.getElementsByTagName("span").length)return a}(),c=function(a){return"function"===typeof e[a]?e[a]=e[a](g,h,n):e[a]},b=function(a,b,k,p){("undefined"===typeof e[a]||p)&&(e[a]=b);return k&&c(a)};b("multiArgs",
function(){var a=document.createElement("div");a.classList.add("a","b");return/(^| )a( |$)/.test(a.className)&&/(^| )b( |$)/.test(a.className)});b("BordersInWrongOrder",function(){var a=document.createElement("div");a.style.border="1px solid #123abc";return"1px solid #123abc"!=a.style.border});b("mobile",/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(l));b("android",/^Android/i.test(l));b("opera","[object Opera]"===q.call(window.opera));b("firefox","undefined"!==typeof InstallTrigger);
b("chrome",g.chrome);b("webkit","WebkitAppearance"in h.documentElement.style);b("safari",0<q.call(window.HTMLElement).indexOf("Constructor"));b("ie",function(){return!!h.documentMode});b("classlist",!!document.documentElement.classList);return{has:c,add:b,load:function(a,c,b){a?c([a],b):b()},cache:e,clear:function(a){a.innerHTML="";return a},ie:a}});
hAzzle.define("Types",function(){var l=Object.prototype.toString,g=Array.isArray,h=function(a){return"string"===typeof a},n=function(a){return"number"===typeof a},q=function(a){return a&&a.window===a},e=function(a){return a?function(b){return l.call(b)==="[object "+a+"]"}:function(){}},a=function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===a(0)||a(0)&&a(0).tagName)return!0}catch(g){}return!1};
this.isNodeList=a;return{isType:e,isArray:g,isEmpty:function(a){if(null==a)return!0;if(g(a)||h(a)||e("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:q,isObject:function(a){return null!==a&&"object"===typeof a},isPlainObject:function(a){return e("Object")(a)&&!q(a)&&Object.getPrototypeOf(a)==Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},isNode:function(a){return!!a&&"object"===typeof a&&
"nodeType"in a},isElement:function(a){return!(!a||!a.nodeName)},isString:h,isArrayLike:function(a){if(null==a||q(a))return!1;var b=a.length;return 1===a.nodeType&&b?!0:h(a)||g(a)||0===b||"number"===typeof b&&0<b&&b-1 in a},isNumber:n,isBoolean:function(a){return"boolean"===typeof a},isNaN:function(a){return n(a)&&a!=+a},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:a}});
hAzzle.define("text",function(){var l=function(g){var h,n="",q=0;h=g.nodeType;if(!h)for(;h=g[q++];)n+=l(h);else if(1===h||9===h||11===h){if("string"===typeof g.textContent)return g.textContent;for(g=g.firstChild;g;g=g.nextSibling)n+=l(g)}else if(3===h||4===h)return g.nodeValue;return n};return{getText:l}});
hAzzle.define("util",function(){var l=Array.prototype.slice,g=hAzzle.require("types"),h=Object.keys,n=function(a,f){return Object.prototype.hasOwnProperty.call(a,f)},q=function(a,f,d,b){if(void 0===a)return a;hAzzle.err("function"!==typeof f,5,"'fn' must be a function in util.each()");var s,c=a.length,m;if("function"===typeof f&&"undefined"===typeof d&&"undefined"===typeof b&&g.isArray(a))for(;++s<c&&(s=b?a.length-s-1:s,!1!==f.call(a[s],a[s],s,a)););if(c===+c)for(s=0;s<c&&(s=b?a.length-s-1:s,!1!==
f.call(a[s],a[s],s,a));s++);else if(a)for(m in a)if(!1===f.call(a[m],a[m],m,a))break;return a},e=function(a,f,d){if("function"===typeof a){if(void 0===f)return a;d=d?d:3;return 1===d?function(d){return a.call(f,d)}:2===d?function(d,b){return a.call(f,d,b)}:3===d?function(d,b,c){return a.call(f,d,b,c)}:4===d?function(d,b,c,m){return a.call(f,d,b,c,m)}:function(){return a.apply(f,arguments)}}if(!a)return c},a=function(a,f,d){return a?"function"===typeof a?e(a,f,d):g.isObject(a)?b(a):r(a):c},c=function(a){return a},
b=function(a){var f=t(a),d=f.length;return function(a){if(!a)return!d;a=Object(a);for(var p=0,b,m;p<d;p++)if(b=f[p],m=b[0],b[1]!==a[m]||!(m in a))return!1;return!0}},t=function(a){for(var f=h(a),d=f.length,b=Array(d),c=0;c<d;c++)b[c]=[f[c],a[f[c]]];return b},r=function(a){return function(f){return f[a]}},k=function(p,f,d){if(null==p)return-1;var b=0,c=p.length;if(d)if("number"===typeof d)b=0>d?Math.max(0,c+d):d;else{d=a(void 0,void 0,1);for(var b=d(f),c=0,k=p.length;c<k;){var m=c+k>>>1;d(p[m])<b?
c=m+1:k=m}b=c;return p[b]===f?b:-1}for(;b<c;b++)if(p[b]===f)return b;return-1};return{map:function(b,f,d){if(b){f=a(f,d);d=b.length!==+b.length&&h(b);for(var c=(d||b).length,k=Array(c),g,m=0;m<c;m++)g=d?d[m]:m,k[m]=f.call(b[g],b[g],g,b);return k}return[]},some:function(b,f,d){if(b){f=a(f,d);d=(c||b).length;var c,k=0,g;for(b.length!==+b.length&&(c=c(b));k<d;k++)if(g=c?c[k]:k,f(b[g],g,b))return!0}return!1},reduce:function(a,b,d,c){a||(a=[]);b=e(b,c,4);var k=a.length!==+a.length&&h(a),g=(k||a).length,
m=0,w;3>arguments.length&&(hAzzle.err(!g,7," no collection length exist in collection.reduce()"),d=a[k?k[m++]:m++]);for(;m<g;m++)w=k?k[m]:m,d=b(d,a[w],w,a);return d},each:q,mixin:function(a){if(g.isObject(a))for(var b,d,c=1,k=arguments.length;c<k;c++)for(d in b=arguments[c],b)n(b,d)&&(a[d]=b[d]);return a},makeArray:function(a){if(g.isArray(a))return a;for(var b=-1,d=a.length,c=Array(d);++b<d;)c[b]=a[b];return c},merge:function(a,b){for(var d=+b.length,c=0,k=a.length;c<d;c++)a[k++]=b[c];a.length=k;
return a},nodeName:function(a,b){return a&&a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},unique:function(b,f,d,c){if(!b)return[];g.isBoolean(f)&&(c=d,d=f,f=!1);void 0!==d&&(d=a(d,c));c=[];for(var h=[],e=0,m,w=b.length;e<w;e++)if(m=b[e],f)e&&h===m||c.push(m),h=m;else if(d){var x=d(m,e,b);0>k(h,x)&&(h.push(x),c.push(m))}else 0>k(c,m)&&c.push(m);return c},indexOf:k,filter:function(b,f,d){var c=[];if(!b)return c;f=a(f,d);q(b,function(a,b,d){f(a,b,d)&&c.push(a)});return c},now:Date.now,has:n,
bind:function(a,b){var d=2<arguments.length?l.call(arguments,2):[],c;"string"===typeof b&&(c=a[b],b=a,a=c);return"function"!==typeof a||b instanceof RegExp?b:d.length?function(){return arguments.length?a.apply(b||this,d.concat(l.call(arguments,0))):a.apply(b||this,d)}:function(){return arguments.length?a.apply(b||this,arguments):a.call(b||this)}}}});
hAzzle.define("Core",function(){var l=1,g=window.document,h=window.document,n="hAzzle_"+1*new Date,q,e,a=Array.prototype.indexOf,c={},b,t=g.createElement("div").compareDocumentPosition(g.createElement("div"))&1,r,k=function(){return!!r},p=function(a,b){a===b&&(r=!0);return 0},f=n.split("").sort(p).join("")===n,d=function(a,b){var d=b&&a,c=d&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(c)return c;if(d)for(;d=d.nextSibling;)if(d===b)return-1;return a?
1:-1},v=function(a){return/^[^{]+\{\s*\[native \w/.test(""+a)},s=function(a){var b,d,f,m;q=a=a.ownerDocument||a;b=a.documentElement;if(9!==q.nodeType||!q.documentElement)return g;g=a;if(d=b.getAttribute("__hAzzle"))return e=c[d];b.setAttribute("__hAzzle",l);e={id:++l};e.qsa=v(a.querySelectorAll);e.compare=v(b.compareDocumentPosition);e.contains=v(b.contains);e.QSABugs=f=[];e.matchesBugs=m=[];e.qsa&&(d=a.createElement("div"),d.appendChild(a.createElement("select")),(a=a.createElement("option")).setAttribute("selected",
""),d.firstChild.appendChild(a),d.querySelectorAll(":checked").length||f.push(":checked"),e.QSABugs=f.length&&new RegExp(f.join("|")));v(b=b.webkitMatchesSelector||b.mozMatchesSelector||b.oMatchesSelector||b.msMatchesSelector)&&(e.matchesSelector=b,e.disconMatch=b.call(d,"div"),e.matchesBugs=m.length&&new RegExp(m.join("|")));c[l]=e;return c[l]};s(g);var u=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},m=e.compare&&e.contains?function(a,b){var d=9===a.nodeType?
a.documentElement:a,c=b&&b.parentElement;return a===c||!!(c&&1===c.nodeType&&(d.contains?d.contains(c):a.compareDocumentPosition&&a.compareDocumentPosition(c)&16))}:function(a,b){if(b)for(;b=b.parentElement;)if(b===a)return!0;return!1},p=e.compare?function(d,c){if(d===c)return r=!0,0;var f=!d.compareDocumentPosition-!c.compareDocumentPosition;if(f)return f;f=(d.ownerDocument||d)===(c.ownerDocument||c)?d.compareDocumentPosition(c):1;return f&1||!t&&c.compareDocumentPosition(d)===f?d===q||d.ownerDocument===
h&&m(h,d)?-1:c===q||c.ownerDocument===h&&m(h,c)?1:b?a(b,d)-a(b,c):0:f&4?-1:1}:function(c,f){if(c===f)return r=!0,0;var m,k=0,g=c.parentNode,p=f.parentNode,e=[c],l=[f];if(!g||!p)return c===m?-1:f===m?1:g?-1:p?1:b?a(b,c)-a(b,f):0;if(g===p)return d(c,f);for(m=c;m=m.parentNode;)e.unshift(m);for(m=f;m=m.parentNode;)l.unshift(m);for(;e[k]===l[k];)k++;return k?d(e[k],l[k]):e[k]===h?-1:l[k]===h?1:0};return{environment:e,expando:n,addFeature:function(a,b){"string"===typeof a&&b&&(c[l][a]=b)},setDocument:s,
isXML:u,isHTML:!u(g),contains:m,unique:function(a){var d,c=[],m=0,g=0;r=!k;b=!f&&a.slice(0);a.sort(p);if(r){for(;d=a[g++];)d===a[g]&&(m=c.push(g));for(;m--;)a.splice(c[m],1)}b=null;return a},matches:e.matchesSelector,qsa:e.qsa,QSABugs:e.QSABugs,matchesBugs:e.matchesBugs}});
hAzzle.define("Collection",function(){var l=hAzzle.require("util"),g=hAzzle.require("types"),h=Array.prototype,n=h.concat,q=h.push,e=function(a,c,b){"undefined"===typeof c&&(c=0);"undefined"===typeof b&&(b=a?a.length:0);var g=-1;b=b-c||0;for(var e=Array(0>b?0:b);++g<b;)e[g]=a[c+g];return e};this.toJqueryZepto=function(){for(var a=this.length,c=this.elements;a--;)this[a]=c[a];return this};this.get=function(a){var c=this.elements;return void 0===a?e(c,0):0>a?c[this.length+a]:c[a]};this.eq=function(a){return hAzzle(-1===
a?e(this.elements,this.length-1):e(this.elements,a,a+1))};this.reduce=function(a,c,b){return l.reduce(this.elements,a,c,b)};this.indexOf=function(a,c,b){return null==c?-1:h.indexOf.call(c,a,b)};this.map=function(a,c){return hAzzle(l.map(this.elements,a,c))};this.each=function(a,c,b){l.each(this.elements,a,c,b);return this};this.slice=function(a,c){return hAzzle(e(this.elements,a,c))};this.concat=function(){var a=l.map(e(arguments),function(a){return a instanceof hAzzle?a.elements:a});return hAzzle(n.apply(this.elements,
a))};this.contents=function(){return this.map(function(){return this.contentDocument||e(this.childNodes)})};this.is=function(a){return 0<this.length&&0<this.filter(a).length};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var c=this.elements;return a?"string"===typeof a?l.indexOf(hAzzle(a).elements,c[0]):l.indexOf(c,a instanceof hAzzle?a.elements[0]:a):c[0]&&c[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,c){var b=a;"string"===typeof a&&(b=hAzzle(a,
c).elements);return this.concat(b)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};l.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,c){this[c]=function(b){return this.map(function(){return this[a]}).filter(b)}}.bind(this));l.each({prevAll:"previousElementSibling",
nextAll:"nextElementSibling"},function(a,c){this[c]=function(){var b=[];this.each(function(c){for(;(c=c[a])&&9!==c.nodeType;)b.push(c)});return hAzzle(b)}}.bind(this));return{makeArray:function(a,c){var b=c||[];void 0!==a&&(g.isArrayLike(Object(a))?l.merge(b,g.isString(a)?[a]:a):q.call(b,a));return b},inArray:function(a,c,b){return void 0===c?-1:h.indexOf.call(c,a,b)},slice:e,includes:function(a,c){return-1!=h.indexOf.call(a,c)},arrayRemove:function(a,c){var b=a.indexOf(c);0<=b&&a.splice(b,1);return c}}});
hAzzle.define("Jiesa",function(){var l=hAzzle.require("util"),g=hAzzle.require("core"),h=hAzzle.require("collection"),n=hAzzle.require("types"),q=hAzzle.require("has"),e=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,a=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,c=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,b=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,t=/^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,r=/^\s*[+~]/,k=/[\n\t\r]/g,p={":enabled":function(a){return!1===a.disabled},":disabled":function(a){return!0===
a.disabled},":checked":function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},":hidden":function(a){var b=a.style;return!b||"none"!==b.display&&"hidden"!==b.visibility?"hidden"===a.type:!0},":visible":function(a){return!p[":hidden"](a)}},f=function(a,b,d){var f=a,k=a.getAttribute("id"),g=k||"__hAzzle__",p=a.parentNode,e=r.test(b);if(e&&!p)return[];k?g=g.replace(/'/g,"\\$&"):a.setAttribute("id",g);e&&p&&(a=a.parentNode);b=b.match(c);for(p=0;p<b.length;p++)b[p]=
"[id='"+g+"'] "+b[p];b=b.join(",");try{return d.call(a,b)}finally{k||f.removeAttribute("id")}},d=function(a,b,d){return d&&9!==d.nodeType?f(d,b,function(b){return a.matches(b)}):a.matches(b)},v=function(a){return a?"string"===typeof a?s(a):!a.nodeType&&n.isArrayLike(a)?a[0]:a:document},s=function(b,d){var c,p,n,t,r=[];d=v(d);if(!b||"string"!==typeof b)return r;if(1!==(p=d.nodeType)&&9!==p&&11!==p)return[];if(g.isHTML){if(c=e.exec(b)){if(b=c[1]){if(9===p)return(n=d.getElementById(b))&&n.id===b?[n]:
[];if(d.ownerDocument&&(n=d.ownerDocument.getElementById(b))&&g.contains(d,n)&&n.id===c)return[n]}else if(b=c[2])t=d.getElementsByClassName(b);else if(b=c[3])t=d.getElementsByTagName(b);return h.slice(t)}if(c=a.exec(b)){p=d.getElementsByTagName(c[1]);var s=c[2],u=c[3];l.each(p,function(a){var b;(b=a.id===s)||(b=q.has("classList")?a.classList.contains(u):0<=(" "+a.className+" ").replace(k," ").indexOf(u));b&&r.push(a)});return r}}if(g.qsa&&(!g.QSABugs||!g.QSABugs.test(b)))try{return t=1===d.nodeType?
f(d,b,d.querySelectorAll):d.querySelectorAll(b),h.slice(t)}catch(y){}},u=function(a,c,f){if(c.nodeType)return a===c;(a.ownerDocument||a)!==document&&g.setDocument(a);c="string"===typeof c?c.replace(b,"='$1']"):c;if(c instanceof hAzzle)return l.some(c.elements,function(b){return u(a,b)});if(a===document)return!1;var k=t.exec(c);if(k)return k[1]&&(k[1]=k[1].toLowerCase()),k[3]&&(k[3]=k[3].split("=")),k[4]&&(k[4]=" "+k[4]+" "),(!k[1]||a.nodeName.toLowerCase()===k[1])&&(!k[2]||a.id===k[2])&&(!k[3]||(k[3][1]?
a.getAttribute(k[3][0])===k[3][1]:a.hasAttribute(k[3][0])))&&(!k[4]||0<=(" "+a.className+" ").indexOf(k[4]));if(k=p[c])return!!k(a);if(!g.matches||!g.isHTML||g.rbuggyMatches&&g.rbuggyMatches.test(c)||g.QSABugs&&g.QSABugs.test(c))hAzzle.err(!0,23," jiesa.js module need to be installed");else try{var e=d(a,c,f);if(e||g.disconMatch||a.document&&11!==a.document.nodeType)return e}catch(h){}};this.find=function(a,b,d){if(!d){if("string"!==typeof a){var c=0,f=this.length,k=this.elements;return hAzzle(l.filter(hAzzle(a).elements,
function(a){for(;c<f;c++)if(g.contains(k[c],a))return!0}))}return l.reduce(this.elements,function(b,d){return hAzzle(b.concat(h.slice(s(a,d))))},[])}return s(a,b)};this.filter=function(a,b){if(void 0===a)return this;if("function"===typeof a){var d=[];this.each(function(b,c){a.call(b,c)&&d.push(b)});return hAzzle(d)}return this.filter(function(){return u(this,a)!==(b||!1)})};return{matchesSelector:d,matches:u,pseudos:p,find:s}});
hAzzle.define("Strings",function(){var l=/[A-Z]/g,g=/([\:\-\_]+(.))/g,h=/^moz([A-Z])/,n=[],q=function(a,c,b,g){return g?b.toUpperCase():b},e=function(a){return"-"+a.charAt(0).toLowerCase()};return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(l,e):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():
a},camelize:function(a){return n[a]?n[a]:n[a]=a.replace(g,q).replace(h,"Moz$1")},trim:function(a){return"string"===typeof a?a.trim():a},lowercase:function(a){return"string"===typeof a?a.toLowerCase():a},uppercase:function(a){return"string"===typeof a?a.toUpperCase():a}}});
hAzzle.define("storage",function(){function l(){this.expando=e.expando+Math.random()}function g(b,g,f){if(void 0===f&&1===b.nodeType)if(f="data-"+g.replace(c,"-$1").toLowerCase(),f=b.getAttribute(f),"string"===typeof f){try{f="true"===f?!0:"false"===f?!1:"null"===f?null:+f+""===f?+f:a.test(f)?JSON.parse(f+""):f}catch(d){}r.set(b,g,f)}else f=void 0;return f}var h=hAzzle.require("util"),n=hAzzle.require("strings"),q=hAzzle.require("types"),e=hAzzle.require("core"),a=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
c=/([A-Z])/g,b=/\S+/g;l.accepts=function(a){if(a)return 1===a.nodeType||9===a.nodeType||!+a.nodeType};l.prototype={register:function(a,b){hAzzle.err(!q.isObject(a),22,"no valid DOM element in storage.js");var c={};c[this.expando]={value:b||{},writable:!0,configurable:!0};a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperties(a,c);return a[this.expando]},cache:function(a,b){if(!l.accepts(a))return{};var c=a[this.expando];return c?c:this.register(a,b)},set:function(a,b,c){if(a){var d;if(a=
this.cache(a)){if("string"===typeof b)a[b]=c;else if(q.isEmptyObject(a))h.mixin(a,b);else for(d in b)a[d]=b[d];return a}}},access:function(a,b,c){if(void 0===b||b&&"string"===typeof b&&void 0===c)return c=this.get(a,b),void 0!==c?c:this.get(a,n.camelize(b));this.set(a,b,c);return void 0!==c?c:b},get:function(a,b){var c=this.cache(a);if(c)return void 0!==c&&void 0===b?c:c[b]},release:function(a,c){var f,d,g=this.cache(a);if(void 0===c)this.register(a);else for(q.isArray(c)?d=c.concat(c.map(n.camelize)):
(f=n.camelize(c),c in g?d=[c,f]:(d=f,d=g[d]?[d]:d.match(b)||[])),f=d.length;f--;)delete g[d[f]]},hasData:function(a){return!q.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var t=new l,r=new l;this.data=function(a,b){var c,d,e,h=this.elements[0],l=h&&h.attributes;if(void 0===a){if(this.length&&(e=r.get(h),1===h.nodeType&&!t.get(h,"hasDataAttrs"))){for(c=l.length;c--;)l[c]&&(d=l[c].name,0===d.indexOf("data-")&&(d=n.camelize(d.slice(5)),g(h,d,e[d])));
t.set(h,"hasDataAttrs",!0)}return e}if("object"===typeof a)return this.each(function(b){r.set(b,a)});var m=n.camelize(a);if(h&&void 0===b){e=r.get(h,a);if(void 0!==e)return e;e=r.get(h,m);var w=t.get(this,"hasDataAttrs"),x=-1!==a.indexOf("-");if(void 0!==e)return e;e=g(h,m,void 0);if(void 0!==e)return e}else this.each(function(c){var d=r.get(c,m);r.set(c,m,b);x&&void 0!==d&&r.set(c,a,b);x&&void 0===w&&r.set(c,a,b)})};this.removeData=function(a){return this.each(function(b){r.release(b,a)})};return{"private":t,
data:r}});
hAzzle.define("css",function(){var l=hAzzle.require("storage"),g=hAzzle.require("has"),h="b big i small abbr acronym cite code dfn em kbd strong samp var a bdo br img mapobject q script span sub button input label select textarea".split(" "),n=/^(width|height)$/,q=/^(li)$/i,e=/^(tr)$/i,a=/^(table)$/i,c=/^margin/,b=/^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i,t=function(a){if(a)return void 0===l["private"].get(a,"css")&&l["private"].access(a,"css",{computedStyle:null}),l["private"].get(a,"css")},
r=function(a){var b;if(null===t(a).computedStyle){b=t(a);if(a&&null!==a.ownerDocument){var c=!1;a?(void 0!==a.ownerDocument&&(c=a.ownerDocument.defaultView),a=c&&c.opener?c.getComputedStyle(a,null):window.getComputedStyle(a,null)):a=a.style}else a="";b=b.computedStyle=a}else b=t(a).computedStyle;return b},k=function(a){return parseFloat(a)||0},p=function(b){if(b){b=b.tagName.toLowerCase();if(b in h)return"inline";if(q.test(b))return"list-item";if(e.test(b))return"table-row";if(a.test(b))return"table"}return"block"},
f=function(a,e,h){a=a instanceof hAzzle?a.elements[0]:a;var l=0;n.test(e)&&0===f(a,"display")&&(a.style.display="none",a.style.display=p(a));if(g.has("ie")&&"auto"===e){if("height"===e)return a.offsetHeight;if("width"===e)return a.offsetWidth}if(!h){if("height"===e&&"border-box"!==f(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-k(f(a,"borderTopWidth"))-k(f(a,"borderBottomWidth"))-k(f(a,"paddingTop"))-k(f(a,"paddingBottom"));if("width"===e&&"border-box"!==f(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-
k(f(a,"borderLeftWidth"))-k(f(a,"borderRightWidth"))-k(f(a,"paddingLeft"))-k(f(a,"paddingRight"))}if(h=r(a))if((g.ie||g.has("firefox"))&&"borderColor"===e&&(e="borderTopColor"),l=9===g.ie&&"filter"===e?h.getPropertyValue(e):h[e],""!==l||hAzzle.require("Core").contains(a.ownerDocument,a)||(l=a.style[e]),g.has("mobile")&&g.has("android")&&b.test(l)&&c.test(name)){var m=a.style;a=m.width;e=m.minWidth;h=m.maxWidth;m.minWidth=m.maxWidth=m.width=l;l=t.width;m.width=a;m.minWidth=e;m.maxWidth=h}return void 0!==
l?l+"":l};return{computed:t,display:p,styles:r,css:f}});
hAzzle.define("setters",function(){var l=hAzzle.require("util"),g=hAzzle.require("core"),h=hAzzle.require("types"),n=/\S+/g,q=/\r/g,e="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),a={},c={},b={"class":"className","for":"htmlFor"},t={get:{},set:{}},r={get:{},set:{}},k={get:{},
set:{}},p={get:{},set:{}},f={get:{},set:{}},d=function(a){return a instanceof hAzzle?a.elements:a},v=function(b,d){var f=a[d.toLowerCase()];return f&&c[b.nodeName]&&f},s=function(a,c){a=d(a);var f,e,g=0,k=c&&c.match(n);if(k&&1===a.nodeType)for(;f=k[g++];)e=b[f]||f,v(a,f)?a[e]=!1:a.removeAttribute(f),a.removeAttribute(f)},u=function(a,b,c){var e=(a=d(a))?a.nodeType:void 0,k,h;if(e&&(3!==e||8!==e||2!==e)){if("undefined"===typeof a.getAttribute)return m(a,b,c);1===e&&g.isXML(a)||(b=b.toLowerCase(),k=
r["undefined"===c?"get":"set"][b]||v(a,b)?f["undefined"===c?"get":"set"][b]:p["undefined"===c?"get":"set"][b]);if(void 0===c){if(k&&(h=k.get(a,b))&&null!==h)return h;h=a.getAttribute(b,2);return null==h?void 0:h}if(c){if(k&&void 0!==(h=k.set(a,c,b)))return h;a.setAttribute(b,c+"")}else s(a,b)}return""},m=function(a,c,f){var e=(a=d(a))?a.nodeType:void 0,k,h;if(e&&(3!==e||8!==e||2!==e)){if(1!==e||g.isHTML)c=b[c]||c,k="undefined"===f?t.get[c]:t.set[c];return"undefined"!==typeof f?k&&void 0!==(h=k.set(a,
f,c))?h:a[c]=f:k&&null!==(h=k(a,c))?h:a[c]}return""};this.val=function(a){var b,c,d;c=this.elements[0];if(arguments.length)return d=h.isType("Function")(a),this.each(function(c,f){var e;1===c.nodeType&&(e=d?a.call(c,f,hAzzle(c).val()):a,null==e?e="":"number"===typeof e?e+="":h.isArray(e)&&(e=l.map(e,function(a){return null==a?"":a+""})),b=k.set[c.type]||k.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,e,"value")||(c.value=e))});if(c){if(b=k.get[c.type]||k.get[c.nodeName.toLowerCase()])return b(c,"value");
c=c.value;return"string"===typeof c?c.replace(q,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){l.each(a,function(a,c){m(b,c,a)})});if("undefined"===typeof b)return m(c[0],a);this.each(c,function(c){m(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[b[a]||a]})};this.removeAttr=function(a){return this.each(function(b){s(b,
a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){l.each(a,function(a,c){u(b,c,a)})}):"undefined"===typeof b?u(c[0],a):this.each(function(c){u(c,a,b)})};l.each(e,function(b){a[e[b]]=e[b]});l.each("input select option textarea button form details".split(" "),function(a){c[a.toUpperCase()]=!0});l.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),
function(a){b[a.toLowerCase()]=a});return{attrHooks:r,propHooks:t,valHooks:k,boolHooks:f,nodeHooks:p,propMap:b,boolAttr:a,boolElem:c,removeAttr:s,attr:u,prop:m}});hAzzle.define("boolhooks",function(){var l=hAzzle.require("setters");l.boolHooks.set=function(g,h,n){!1===h?l.removeAttr(g,n):g.setAttribute(n,n);return n};return{}});
hAzzle.define("attrHooks",function(){var l=hAzzle.require("util"),g=hAzzle.require("setters"),h=function(){var g=document.createElement("input");g.type="checkbox";g=document.createElement("input");g.value="t";g.type="radio";return"t"===g.value}();l.mixin(g.attrHooks.set,{type:function(g,q){if(!h&&"radio"===q&&l.nodeName(g,"input")){var e=g.value;g.setAttribute("type",q);e&&(g.value=e);return q}}});return{}});
hAzzle.define("prophooks",function(){var l=hAzzle.require("util"),g=hAzzle.require("setters");l.mixin(g.propHooks.get,{tabIndex:function(g){return g.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(g.nodeName)||g.href?g.tabIndex:-1}});document.createElement("select").appendChild(document.createElement("option")).selected||(g.propHooks.get.selected=function(g){(g=g.parentNode)&&g.parentNode&&g.parentNode.selectedIndex;return null});return{}});
hAzzle.define("valHooks",function(){var l=hAzzle.require("util"),g=hAzzle.require("strings"),h=hAzzle.require("text"),n=hAzzle.require("types"),q=hAzzle.require("collection"),e=hAzzle.require("setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}(),c=function(a,c,e){var g=a.length;for(e=0>e?Math.max(0,g+e):e||0;e<g;e++)if(a[e]===c)return e;return-1};l.mixin(e.valHooks.set,{select:function(a,e){for(var g,
k,h=a.options,f=q.makeArray(e),d=h.length;d--;)if(k=h[d],k.selected=0<=c(f,k.value))g=!0;g||(a.selectedIndex=-1);return f}});l.mixin(e.valHooks.get,{option:function(a){var c=a.getAttribute(name,2);return null!==c?c:g.trim(h.getText(a))},select:function(a){var c=a.selectedIndex,e="select-one"===a.type;a=a.options;var g=[],h,f,d;if(0>c)return"";d=e?c:0;for(f=e?c+1:a.length;d<f;d++)if(h=a[d],h.selected&&null===h.getAttribute("disabled")&&(!h.parentElement.disabled||"OPTGROUP"!==h.parentElement.tagName)){h=
hAzzle(h).val();if(e)return h;g.push(h)}return e&&!g.length&&a.length?a[c].value:g}});l.each(["radio","checkbox"],function(a){e.valHooks.set[a]=function(a,b){if(n.isArray(b))return a.checked=0<=c(b,hAzzle(a).val())}});a||(e.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(l){function g(a){return"string"===typeof a?l.document.createTextNode(a):a}function h(a){var b=l.document.createDocumentFragment(),c=q.call(a,0),e=0,f=a.length;if(1===a.length)return g(a[0]);for(;e<f;e++)try{b.appendChild(g(c[e]))}catch(d){}return b}for(var n=Array.prototype,q=n.slice,e=n.indexOf,n=(l.Element||l.Node||l.HTMLElement).prototype,a=["append",function(){try{this.appendChild(h(arguments))}catch(a){}},"prepend",function(){try{this.firstChild?this.insertBefore(h(arguments),this.firstChild):
this.appendChild(h(arguments))}catch(a){}},"before",function(){var a=this.parentElement;a&&a.insertBefore(h(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(h(arguments),this.nextSibling):this.parentElement.appendChild(h(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(h(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",n.matchesSelector||n.webkitMatchesSelector||
n.mozMatchesSelector||n.msMatchesSelector||function(a){var b=this.parentElement;return!!b&&-1<e.call(b.querySelectorAll(a),this)}],c=a.length;c;c-=2)n[a[c-2]]||(n[a[c-2]]=a[c-1]);try{new l.CustomEvent("?")}catch(b){l.CustomEvent=function(a,b){function c(a,b,d,e){this.initEvent(a,b,d);this.detail=e}return function(e,f){var d=document.createEvent(a);if("string"!==typeof e)throw Error("An event name must be provided");"Event"===a&&(d.initCustomEvent=c);null==f&&(f=b);d.initCustomEvent(e,f.bubbles,f.cancelable,
f.detail);return d}}(l.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}[].contains||Object.defineProperty(Array.prototype,"contains",{enumerable:!1,configurable:!0,writable:!0,value:function(a,b){if(void 0===this||null===this)throw new TypeError("Cannot convert this value to object");var c=Object(this),e=parseInt(c.length)||0;if(0===e)return!1;var f=void 0!==b?parseInt(b):0;if(f>=e)return!1;0<=f||(f=e+Math.abs(f),0>f&&(f=0));for(;f<e;){var d=c[f];if(a===d||a!==a&&d!==d)return!0;
f+=1}return!1}})})(window);