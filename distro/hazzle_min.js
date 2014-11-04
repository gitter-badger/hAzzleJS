/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.0d Release Candidate
 * Released under the MIT License.
 *
 * Date: 2014-11-04
 */
(function(){var g=/^#([\w\-]*)$/,m={},p={},r=function(a,c,k){if(a)throw a=Error("[hAzzle-"+c+"] "+k),a.code=c,a;},t=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},q=function(a,c){if(a){if(!(this instanceof q))return new q(a,c);if(a instanceof q)return a;var k,e,b=q.require("Util"),s=q.require("Ready");"function"===typeof a&&(p.Ready?s.ready(a):r(!0,6,"ready.js module not installed"));if("string"===typeof a){if((k=g.exec(a))&&!c&&(e=[document.getElementById(k[1])]),null===e||void 0===e)e=
this.find(a,c,!0)}else e=a instanceof Array?b.unique(b.filter(a,t)):this.isNodeList(a)?b.filter(b.makeArray(a),t):a.nodeType?11===a.nodeType?a.children:[a]:a===window?[a]:[];void 0===e?(this.length=0,this.elements=[]):(this.elements=e,this.length=e.length);return this}};q.err=r;q.installed=p;q.require=function(a){return m[a]};q.define=function(a,c){r("string"!==typeof a,1,'id must be a string "'+a+'"');r(m[a],2,'module already included "'+a+'"');r("function"!==typeof c,3,'function body for "'+a+'" must be an function "'+
c+'"');p[a]=!0;m[a]=c.call(q.prototype)};q.codename="new-age";q.version="1.0.0a-rc";window.hAzzle=q})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("has",function(){var g=navigator.userAgent,m=window,p=m.document,r=p&&p.createElement("div"),t=Object.prototype.toString,q={},a=function(){if(p.documentMode)return p.documentMode;for(var a=7;4<a;a--){var e=p.createElement("div");e.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e";if(e.getElementsByTagName("span").length)return a}}(),c=function(a,e,b){q[a]=b?e(m,p,r):e};c("xpath",function(){return!!p.evaluate});c("air",function(){return!!m.runtime});c("dart",function(){return!(!m.startDart&&
!p.startDart)});c("promise",function(){return!!m.Promise});c("mobile",function(){return/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(g)});c("android",function(){return/^Android/i.test(g)});c("opera",function(){return"[object Opera]"===t.call(window.opera)});c("firefox",function(){return"undefined"!==typeof InstallTrigger});c("chrome",function(){return m.chrome});c("webkit",function(){return"WebkitAppearance"in p.documentElement.style});c("safari",function(){return 0<t.call(window.HTMLElement).indexOf("Constructor")});
c("ie",function(){return!!p.documentMode});c("touch",function(){return"ontouchstart"in document||"onpointerdown"in document&&0<navigator.maxTouchPoints||window.navigator.msMaxTouchPoints});c("touchEvents",function(){return"ontouchstart"in document});c("pointerEvents",function(){return"onpointerdown"in document});c("MSPointer",function(){return"msMaxTouchPoints"in navigator});c("ComputedStyle",function(){return!!document.defaultView.getComputedStyle});c("qsa",function(){return!!document.querySelectorAll});
c("classlist",function(){return!!document.documentElement.classList});c("multiArgs",function(){var a=document.createElement("div");a.classList.add("a","b");return/(^| )a( |$)/.test(a.className)&&/(^| )b( |$)/.test(a.className)});return{has:function(a){"function"==typeof q[a]&&(q[a]=q[a](m,p,r));return q[a]},add:c,clearElement:function(a){if(a)for(;a.lastChild;)a.removeChild(a.lastChild);return a},ie:a}});
hAzzle.define("Types",function(){var g,m=Object.prototype.toString,p=Array.isArray,r={},t="Arguments Array Boolean Date Error Function Map Number Object RegExp Set StringWeakMap ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32ArrayUint8Array Uint8ClampedArray Uint16Array Uint32Array".split(" ");for(g=t.length;g--;)r["[object "+t[g]+"]"]=!0;t="ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32Array Uint8Array Uint8ClampedArray Uint16Array Uint32Array".split(" ");for(g=
t.length;g--;)r["[object "+t[g]+"]"]=!1;var q=function(a){return"string"===typeof a},a=function(a){return"number"===typeof a},c=function(a){return a&&a.window===a},k=function(a){return a?function(b){return m.call(b)==="[object "+a+"]"}:function(){}};this.isNodeList=g=function(a){var b=Object.prototype.toString.call(a);if("[object HTMLCollection]"===b||"[object NodeList]"===b)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===a(0)||a(0)&&a(0).tagName)return!0}catch(c){}return!1};return{isType:k,
isArray:p,isEmpty:function(a){if(null==a)return!0;if(p(a)||q(a)||k("Arguments")(a))return 0===a.length;for(var b in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},isWindow:c,isObject:function(a){var b=typeof a;return"function"===b||a&&"object"===b||!1},isPlainObject:function(a){return"object"!==k(a)&&!c(a)&&Object.getPrototypeOf(a)==Object.prototype},isEmptyObject:function(a){for(var b in a)return!1;return!0},isNode:function(a){return!!a&&"object"===typeof a&&"nodeType"in
a},isElement:function(a){return a&&"object"===typeof a&&a.ELEMENT_NODE&&-1<m.call(a).indexOf("Element")||!1},isString:q,isArrayLike:function(a){return a&&"object"===typeof a&&"number"===typeof a.length&&r[m.call(a)]||!1},isNumber:a,isBoolean:function(a){return"boolean"===typeof a},isNumeric:function(a){return!p(a)&&0<=a-parseFloat(a)+1},isNaN:function(c){return a(c)&&c!=+c},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:g,isHostMethod:function(a,
b){var c=typeof a[b];return"function"===c||!("object"!=c||!a[b])||"unknown"==c}}});hAzzle.define("Text",function(){var g=function(m){if(m){var p,r="",t=0,q=m.length;p=m.nodeType;if(!p)for(;t<q;t++)p=m[t++],8!==p.nodeType&&(r+=g(p));else if(1===p||9===p||11===p){t=m.textContent;if("string"===typeof t)return m.textContent;for(m=m.firstChild;m;m=m.nextSibling)r+=g(m)}else if(3===p||4===p)return m.nodeValue;return r}};return{getText:g}});
hAzzle.define("Util",function(){var g=hAzzle.require("Types"),m=Object.prototype.hasOwnProperty,p=Array.prototype.slice,r=Object.keys,t=function(h,a){return m.call(h,a)},q=function(h,u,n,v){if(void 0===h)return h;"function"!==typeof u&&hAzzle.err(!0,5,"'fn' must be a function in util.each()");var l,d=h.length,b;if("function"==typeof u&&"undefined"===typeof n&&"undefined"===typeof v&&g.isArray(h))for(;++l<d&&!1!==u(h[l],l,h););u=a(u,n);if(d===+d)for(u=a(u,n),l=0;l<d&&(l=v?h.length-l-1:l,!1!==u(h[l],
l,h));l++);else if(h)for(b in h)if(!1===u(h[b],b,h))break;return h},a=function(h,a,n){if("function"===typeof h){if(void 0===a)return h;n=n?n:3;return 1===n?function(n){return h.call(a,n)}:2===n?function(n,l){return h.call(a,n,l)}:3===n?function(n,l,d){return h.call(a,n,l,d)}:4===n?function(n,l,d,b){return h.call(a,n,l,d,b)}:function(){return h.apply(a,arguments)}}if(!h)return k},c=function(h,u,n){return h?g.isType("Function")(h)?a(h,u,n):g.isObject(h)?e(h):s(h):k},k=function(h){return h},e=function(h){var a=
b(h),n=a.length;return function(h){if(!h)return!n;h=Object(h);for(var l=0,d,b;l<n;l++)if(d=a[l],b=d[0],d[1]!==h[b]||!(b in h))return!1;return!0}},b=function(h){for(var a=r(h),n=a.length,d=Array(n),l=0;l<n;l++)d[l]=[a[l],h[a[l]]];return d},s=function(h){return function(a){return a[h]}},d=function(a,d,n){if(null==a)return-1;var b=0,l=a.length;if(n)if("number"===typeof n)b=0>n?Math.max(0,l+n):n;else{n=c(void 0,void 0,1);for(var b=n(d),l=0,f=a.length;l<f;){var s=l+f>>>1;n(a[s])<b?l=s+1:f=s}b=l;return a[b]===
d?b:-1}for(;b<l;b++)if(a[b]===d)return b;return-1},f=function(a,d,n){for(var b in d)n&&(g.isPlainObject(d[b])||g.isArray(d[b]))?(g.isPlainObject(d[b])&&!g.isPlainObject(a[b])&&(a[b]={}),g.isArray(d[b])&&!g.isArray(a[b])&&(a[b]=[]),f(a[b],d[b],n)):void 0!==d[b]&&(a[b]=d[b])};return{each:q,mixin:function(a){if(g.isObject(a))for(var b,n,d=1,l=arguments.length;d<l;d++)for(n in b=arguments[d],b)t(b,n)&&(a[n]=b[n]);return a},makeArray:function(a){if(a instanceof Array)return a;for(var b=-1,n=a.length,d=
Array(n);++b<n;)d[b]=a[b];return d},merge:function(a,b){for(var d=+b.length,c=0,l=a.length;c<d;c++)a[l++]=b[c];a.length=l;return a},nodeName:function(a,b){return a&&a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},unique:function(a,b,n,f){if(!a)return[];g.isBoolean(b)&&(f=n,n=b,b=!1);void 0!==n&&(n=c(n,f));f=[];for(var l=[],s=0,k=a.length;s<k;s++){var e=a[s];if(b)s&&l===e||f.push(e),l=e;else if(n){var m=n(e,s,a);0>d(l,m)&&(l.push(m),f.push(e))}else 0>d(f,e)&&f.push(e)}return f},indexOf:d,instanceOf:function(a,
b){if(null==a)return!1;for(var d=a.$constructor||a.constructor;d;){if(d===b)return!0;d=d.parent}return a instanceof b},filter:function(a,b,d){var f=[];if(!a)return f;b=c(b,d);q(a,function(a,h,d){b(a,h,d)&&f.push(a)});return f},map:function(a,b,d){if(a){b=c(b,d);d=a.length!==+a.length&&r(a);for(var f=(d||a).length,l=Array(f),s,e=0;e<f;e++)s=d?d[e]:e,l[e]=b(a[s],s,a);return l}return[]},some:function(a,b,d){if(a){b=c(b,d);var f=a.length!==+a.length&&f(a);d=(f||a).length;var l,s;for(l=0;l<d;l++)if(s=
f?f[l]:l,b(a[s],s,a))return!0}return!1},reduce:function(b,d,n,f){b||(b=[]);d=a(d,f,4);var l=b.length!==+b.length&&r(b),c=(l||b).length,s=0,e;3>arguments.length&&(c||hAzzle.err(!0,7," no collection length exist in collection.reduce()"),n=b[l?l[s++]:s++]);for(;s<c;s++)e=l?l[s]:s,n=d(n,b[e],e,b);return n},now:Date.now,bind:function(a,b){var d=2<arguments.length?p.call(arguments,2):[],f;"string"===typeof b&&(f=a[b],b=a,a=f);return"function"!==typeof a||b instanceof RegExp?b:d.length?function(){return arguments.length?
a.apply(b||this,d.concat(p.call(arguments,0))):a.apply(b||this,d)}:function(){return arguments.length?a.apply(b||this,arguments):a.call(b||this)}},has:t,noop:function(){},extend:f,isInDocument:function(a){if(a){for(var b=document.body.parentNode;a;){if(a===b)return!0;a=a.parentNode}return!1}}}});
hAzzle.define("Core",function(){var g=window.document,m={},p={},r=Array.prototype.indexOf,t="hAzzle-"+String(Math.random()).replace(/\D/g,""),q,a=document.createElement("div").compareDocumentPosition(document.createElement("div"))&1,c,k=function(){return!!c},e=function(a,b){a===b&&(c=!0);return 0},b=t.split("").sort(e).join("")===t,s=function(a,b){var h=b&&a,c=h&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(c)return c;if(h)for(;h=h.nextSibling;)if(h===
b)return-1;return a?1:-1};m.isNativeCode=function(a){return/\{\s*\[native code\]\s*\}/.test(""+a)};m.expando=t;m.isXML=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1};m.uidx=1;m.uidk="hAzzle-uniqueid";m.getUIDXML=function(a){var b=a.getAttribute(this.uidk);b||(b=this.uidx++,a.setAttribute(this.uidk,b));return b};m.getUIDHTML=function(a){return a.uniqueNumber||(a.uniqueNumber=this.uidx++)};m.setDocument=function(b){var f=b?b.ownerDocument||b:g;if(9!==f.nodeType||
!f.documentElement)return document;if(this.document!==f){this.document=f;b=f.documentElement;var h=this.getUIDXML(b),e=p[h],n;if(!e){e=p[h]={};e.root=b;e.isXMLDocument=this.isXML(document);e.brokenStarGEBTN=e.matches=e.starSelectsClosedQSA=e.idGetsName=e.ioASaf=e.disconnectedMatch=e.brokenMixedCaseQSA=e.brokenGEBCN=e.brokenCheckedQSA=e.brokenEmptyAttributeQSA=e.isHTMLDocument=e.nativeMatchesSelector=!1;var k=document.createElement("div"),l=document.body||document.getElementsByTagName("body")[0]||
b;l.appendChild(k);try{k.innerHTML='<a id="hAzzle_uniqueid"></a>',e.isHTMLDocument=!!document.getElementById("hAzzle_uniqueid")}catch(m){}if(e.isHTMLDocument){k.appendChild(document.createComment(""));k.getElementsByTagName("*");try{k.innerHTML='<a name="hAzzle_uniqueid"></a><b id="hAzzle_uniqueid"></b>',e.getById=document.getElementById("hAzzle_uniqueid")===k.firstChild}catch(x){}if(k.querySelectorAll){k.innerHTML='<select><option selected="selected">a</option></select>';e.brokenCheckedQSA=!k.querySelectorAll(":checked").length;
k.innerHTML="<select msallowcapture=''><option id='d\f]' selected=''></option></select>";e.ioASaf=!k.querySelectorAll("[id~=d]").length;try{k.innerHTML='<a class=""></a>',e.brokenEmptyAttributeQSA=0!=k.querySelectorAll('[class*=""]').length}catch(y){}}if(e.nativeMatchesSelector=this.isNativeCode(h=b.matches||b.webkitMatchesSelector||b.mozMatchesSelector||b.oMatchesSelector||b.msMatchesSelector))try{e.disconnectedMatch=h.call(k,"div"),h.call(b,":hAzzle"),h=null}catch(t){}e.matches=h}try{b.hAzzle_expando=
1,delete b.hAzzle_expando,e.getUID=this.getUIDHTML}catch(z){e.getUID=this.getUIDXML}l.removeChild(k);k=l=null;h=b&&this.isNativeCode(b.contains);k=document&&this.isNativeCode(b.compareDocumentPosition);e.contains=h&&k?function(a,b){var l=9===a.nodeType?a.documentElement:a,d=b&&b.parentElement;return a===d||!!(d&&1===d.nodeType&&(l.contains?l.contains(d):a.compareDocumentPosition&&a.compareDocumentPosition(d)&16))}:function(a,b){if(b)for(;b=b.parentElement;)if(b===a)return!0;return!1};e.documentSorter=
b.compareDocumentPosition?function(b,l){if(b===l)return c=!0,0;var d=!b.compareDocumentPosition-!l.compareDocumentPosition;if(d)return d;d=(b.ownerDocument||b)===(l.ownerDocument||l)?b.compareDocumentPosition(l):1;return d&1||!a&&l.compareDocumentPosition(b)===d?b===f||b.ownerDocument===g&&e.contains(g,b)?-1:l===f||l.ownerDocument===g&&e.contains(g,l)?1:q?r(q,b)-r(q,l):0:d&4?-1:1}:function(a,b){if(a===b)return c=!0,0;var l,d=0;l=a.parentNode;var h=b.parentNode,n=[a],e=[b];if(!l||!h)return a===f?-1:
b===f?1:l?-1:h?1:q?r(q,a)-r(q,b):0;if(l===h)return s(a,b);for(l=a;l=l.parentNode;)n.unshift(l);for(l=b;l=l.parentNode;)e.unshift(l);for(;n[d]===e[d];)d++;return d?s(n[d],e[d]):n[d]===g?-1:e[d]===g?1:0};b=null}for(n in e)this[n]=e[n]}};m.setDocument(g);return{root:m.root,isXML:m.isXML,isHTML:!m.isXML(g),expando:m.expando,uniqueSort:function(a){var f,h=[],s=0,n=0;c=!k;q=!b&&a.slice(0);a.sort(e);if(c){for(;f=a[n++];)f===a[n]&&(s=h.push(n));for(;s--;)a.splice(h[s],1)}q=null;return a},contains:m.contains,
matches:m.matches,disconnectedMatch:m.disconnectedMatch,nativeMatches:m.nativeMatchesSelector}});
hAzzle.define("Collection",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Types"),p=Array.prototype,r=p.concat,t=p.push,q=function(a,c,k){"undefined"===typeof c&&(c=0);"undefined"===typeof k&&(k=a?a.length:0);var e=-1;k=k-c||0;for(var b=Array(0>k?0:k);++e<k;)b[e]=a[c+e];return b};this.toJqueryZepto=function(){for(var a=this.length,c=this.elements;a--;)this[a]=c[a];return this};this.get=function(a){return void 0===a?q(this.elements,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=
function(a){return hAzzle(-1===a?q(this.elements,this.length-1):q(this.elements,a,a+1))};this.reduce=function(a,c,k){return g.reduce(this.elements,a,c,k)};this.indexOf=function(a,c,k){return null==c?-1:p.indexOf.call(c,a,k)};this.map=function(a,c){return hAzzle(g.map(this.elements,a,c))};this.each=function(a,c,k){g.each(this.elements,a,c,k);return this};this.slice=function(a,c){return new hAzzle(q(this.elements,a,c))};this.concat=function(){var a=g.map(q(arguments),function(a){return a instanceof
hAzzle?a.elements:a});return hAzzle(r.apply(this.elements,a))};this.is=function(a){return 0<this.length&&0<this.filter(a).length};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var c=this.elements;return a?"string"===typeof a?g.indexOf(hAzzle(a).elements,c[0]):g.indexOf(c,a instanceof hAzzle?a.elements[0]:a):c[0]&&c[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,c){var k=a;"string"===typeof a&&(k=hAzzle(a,c).elements);return this.concat(k)};this.first=
function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};g.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,c){this[c]=function(c){return this.map(function(e){return e[a]}).filter(c)}}.bind(this));g.each({prevAll:"previousElementSibling",nextAll:"nextElementSibling"},function(a,
c){this[c]=function(){var c=[];this.each(function(e){for(;(e=e[a])&&9!==e.nodeType;)c.push(e)});return hAzzle(c)}}.bind(this));return{makeArray:function(a,c){var k=c||[];void 0!==a&&(m.isArrayLike(Object(a))?g.merge(k,m.isString(a)?[a]:a):t.call(k,a));return k},inArray:function(a,c,k){return void 0===c?-1:p.indexOf.call(c,a,k)},slice:q}});
hAzzle.define("Jiesa",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Core"),p=hAzzle.require("Collection"),r=hAzzle.require("Types"),t=hAzzle.require("has"),q=hAzzle.require("selector"),a=/^\s*[+~]/,c=/[\n\t\r]/g,k=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,e=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,b=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,s=/=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,d=function(l,d,h){var n=l,e=l.getAttribute("id"),f=e||"__hAzzle__",c=l.parentNode,s=a.test(d);
if(s&&!c)return[];e?f=f.replace(/'/g,"\\$&"):l.setAttribute("id",f);s&&c&&(l=l.parentNode);d=d.match(b);for(c=0;c<d.length;c++)d[c]="[id='"+f+"'] "+d[c];d=d.join(",");try{return h.call(l,d)}finally{e||n.removeAttribute("id")}},f=function(a,b,h){return h&&9!==h.nodeType?d(h,b,function(b){return a.matches(b)}):a.matches(b)},h=function(a){return a?"string"===typeof a?u(a):!a.nodeType&&r.isArrayLike(a)?a[0]:a:document},u=function(a,b){var d,f,s,r=[];b=h(b);if(!a||"string"!==typeof a)return r;if(1!==(f=
b.nodeType)&&9!==f&&11!==f)return[];if(-1!==g.indexOf(a,",")&&(d=a.split(",")))return g.each(d,function(a){g.each(u(a),function(a){m.contains(r,a)||r.push(a)})}),r;if(m.isHTML){if(d=k.exec(a))if(a=d[1]){if(9===f)return(s=b.getElementById(a))&&s.id===a?[s]:[];if(b.ownerDocument&&(s=b.ownerDocument.getElementById(a))&&m.contains(b,s)&&s.id===d)return[s]}else{if(a=d[2])return p.slice(b.getElementsByClassName(a));if(a=d[3])return p.slice(b.getElementsByTagName(a))}else if(d=e.exec(a)){f=b.getElementsByTagName(d[1]);
var v=d[2],w=d[3];g.each(f,function(a){var b;(b=a.id===v)||(b=t.has("classList")?a.classList.contains(w):0<=(" "+a.className+" ").replace(c," ").indexOf(w));b&&r.push(a)});return r}if(!(hAzzle.installed.selector||!t.has("qsa")||m.brokenCheckedQSA&&m.ioASaf&&m.brokenEmptyAttributeQSA))return n(a,b)}hAzzle.err(!hAzzle.installed.selector,22," the selector.js module need to be installed");return q.find(a,b)},n=function(a,b){var h;h=1===b.nodeType&&"object"!==b.nodeName.toLowerCase()?d(b,a,b.querySelectorAll):
b.querySelectorAll(a);return p.slice(h)},v=function(a,b,d){if(b.nodeType)return a===b;(a.ownerDocument||a)!==document&&m.setDocument(a);b="string"===typeof b?b.replace(s,"='$1']"):b;if(b instanceof hAzzle)return g.some(b.elements,function(b){return v(a,b)});if(a===document)return!1;if(m.nativeMatches&&m.isHTML)try{var h=f(a,b,d);if(h||m.disconnectedMatch||a.document&&11!==a.document.nodeType)return h}catch(n){}};this.find=function(a,b,d){if(d)return u(a,b);if("string"===typeof a)return 1===this.length?
hAzzle(u(a,this.elements[0])):g.reduce(this.elements,function(b,d){return hAzzle(b.concat(p.slice(u(a,d))))},[]);var h,n=this.length,f=this.elements;return hAzzle(g.filter(hAzzle(a).elements,function(a){for(h=0;h<n;h++)if(m.contains(f[h],a))return!0}))};this.filter=function(a,b){if(void 0===a)return this;if("function"===typeof a){var d=[];this.each(function(b,h){a.call(b,h)&&d.push(b)});return hAzzle(d)}return this.filter(function(){return f(this,a)!=(b||!1)})};return{matchesSelector:f,matches:v,
qsa:n,find:u}});
hAzzle.define("Strings",function(){var g=String.prototype.trim,m=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/[A-Z]/g,r=/^#x([\da-fA-F]+)$/,t=/^#(\d+)$/,q=/[&<>"']/g,a=/^-ms-/,c=/-([\da-z])/gi,k=[],e={lt:"<",gt:">",quot:'"',apos:"'",amp:"&"},b={},s=function(a,b){return b.toUpperCase()},d=function(a){return"-"+a.charAt(0).toLowerCase()},f;for(f in e)b[e[f]]=f;b["'"]="#39";return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&"string"===
typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(p,d):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():a},camelize:function(b){return b&&"string"===typeof b?k[b]?k[b]:k[b]=b.replace(a,"ms-").replace(c,s):"number"===typeof b||"boolean"===typeof b?""+b:b},trim:function(a){return null==a?"":g?"string"===typeof a?a.trim():a:(a+"").replace(m,"")},escapeHTML:function(a){return a.replace(q,function(a){return"&"+b[a]+";"})},unescapeHTML:function(a){return a.replace(/\&([^;]+);/g,
function(a,b){var d;return b in e?e[b]:(d=b.match(r))?String.fromCharCode(parseInt(d[1],16)):(d=b.match(t))?String.fromCharCode(~~d[1]):a})}}});
hAzzle.define("Storage",function(){function g(){this.expando=q.expando+Math.random()}function m(e,d,f){if(void 0===f&&1===e.nodeType)if(f="data-"+d.replace(c,"-$1").toLowerCase(),f=e.getAttribute(f),"string"===typeof f){try{f="true"===f?!0:"false"===f?!1:"null"===f?null:+f+""===f?+f:a.test(f)?JSON.parse(f+""):f}catch(h){}b.set(e,d,f)}else f=void 0;return f}var p=hAzzle.require("Util"),r=hAzzle.require("Strings"),t=hAzzle.require("Types"),q=hAzzle.require("Core"),a=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
c=/([A-Z])/g,k=/\S+/g;g.accepts=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};g.prototype={register:function(a,b){var f={};f[this.expando]={value:b||{},writable:!0,configurable:!0};a.nodeType?a[this.expando]={value:b||{}}:Object.defineProperties(a,f);return a[this.expando]},cache:function(a,b){if(!g.accepts(a))return{};var f=a[this.expando];return f?f:this.register(a,b)},set:function(a,b,f){if(a){var e;a=this.cache(a);if("string"===typeof b)a[b]=f;else if(t.isEmptyObject(a))p.mixin(a,
b);else for(e in b)a[e]=b[e];return a}},access:function(a,b,e){if(void 0===b||b&&"string"===typeof b&&void 0===e)return e=this.get(a,b),void 0!==e?e:this.get(a,r.camelize(b));this.set(a,b,e);return void 0!==e?e:b},get:function(a,b){var e=this.cache(a);return void 0!==e&&void 0===b?e:e[b]},release:function(a,b){var e,c,g=this.cache(a);if(void 0===b)this.register(a);else for(t.isArray(b)?c=b.concat(b.map(r.camelize)):(e=r.camelize(b),b in g?c=[b,e]:(c=e,c=g[c]?[c]:c.match(k)||[])),e=c.length;e--;)delete g[c[e]]},
hasData:function(a){return!t.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var e=new g,b=new g;this.data=function(a,d){var c,h,k,n=this.elements[0],g=n&&n.attributes;if(void 0===a){if(this.length&&(k=b.get(n),1===n.nodeType&&!e.get(n,"hasDataAttrs"))){for(c=g.length;c--;)g[c]&&(h=g[c].name,0===h.indexOf("data-")&&(h=r.camelize(h.slice(5)),m(n,h,k[h])));e.set(n,"hasDataAttrs",!0)}return k}if("object"===typeof a)return this.each(function(d){b.set(d,
a)});var l=r.camelize(a);if(n&&void 0===d){k=b.get(n,a);if(void 0!==k)return k;k=b.get(n,l);var p=e.get(this,"hasDataAttrs"),q=-1!==a.indexOf("-");if(void 0!==k)return k;k=m(n,l,void 0);if(void 0!==k)return k}else this.each(function(e){var c=b.get(e,l);b.set(e,l,d);q&&void 0!==c&&b.set(e,a,d);q&&void 0===p&&b.set(e,a,d)})};this.removeData=function(a){return this.each(function(e){b.release(e,a)})};return{"private":e,data:b}});
hAzzle.define("curCSS",function(){var g=hAzzle.require("has"),m=hAzzle.require("Core"),p=hAzzle.require("Types"),r=hAzzle.require("Util"),t=hAzzle.require("Storage"),q=window.document.documentElement,a=g.has("ComputedStyle")&&g.has("webkit")?function(a){var e;if(1===a.nodeType){var d=a.ownerDocument.defaultView;e=d.getComputedStyle(a,null);!e&&a.style&&(a.style.display="",e=d.getComputedStyle(a,null))}return e||{}}:function(a){if(a&&null!==a.ownerDocument){var e=!1;if(a)return void 0!==a.ownerDocument&&
(e=a.ownerDocument.defaultView),g.has("ComputedStyle")?e&&e.opener?e.getComputedStyle(a,null):window.getComputedStyle(a,null):a.style}return""},c=function(a){if(a)return void 0===t["private"].get(a,"computed")&&t["private"].access(a,"computed",{computedStyle:null}),t["private"].get(a,"computed")},k=function(b){return null===c(b).computedStyle?c(b).computedStyle=a(b):c(b).computedStyle},e=function(a,c,d){"object"===typeof a&&a instanceof hAzzle&&(a=a.elements[0]);var f=0;if(!d){if("height"===c&&"border-box"!==
e(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-(parseFloat(e(a,"borderTopWidth"))||0)-(parseFloat(e(a,"borderBottomWidth"))||0)-(parseFloat(e(a,"paddingTop"))||0)-(parseFloat(e(a,"paddingBottom"))||0);if("width"===c&&"border-box"!==e(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-(parseFloat(e(a,"borderLeftWidth"))||0)-(parseFloat(e(a,"borderRightWidth"))||0)-(parseFloat(e(a,"paddingLeft"))||0)-(parseFloat(e(a,"paddingRight"))||0)}if(f=k(a))return(g.ie||g.has("firefox"))&&
"borderColor"===c&&(c="borderTopColor"),f=9===g.ie&&"filter"===c?f.getPropertyValue(c):f[c],""!==f||m.contains(a.ownerDocument,a)||(f=a.style[c]),"auto"!==f||"top"!==c&&"right"!==c&&"bottom"!==c&&"left"!==c||(d=e(a,"position"),"fixed"!==d&&("absolute"!==d||"left"!==c&&"top"!==c))||(f=hAzzle(a).position()[c]+"px"),void 0!==f?f+"":f};this.offset=function(a){if(arguments.length)return void 0===a?this.elements:this.each(function(c,d){var l=a,f,k,h,g=e(c,"position"),m=hAzzle(c),s={};"static"===g&&(c.style.position=
"relative");h=m.offset();k=e(c,"top");f=e(c,"left");("absolute"===g||"fixed"===g)&&-1<(k+f).indexOf("auto")?(f=m.position(),k=f.top,f=f.left):(k=parseFloat(k)||0,f=parseFloat(f)||0);p.isType("function")(l)&&(l=l.call(c,d,h));null!=l.top&&(s.top=l.top-h.top+k);null!=l.left&&(s.left=l.left-h.left+f);"using"in l?l.using.call(c,s):m.css(s)});var c,d=this.elements[0],f=d&&d.ownerDocument;if(f){c=f.documentElement;if(!m.contains(c,d))return{top:0,left:0};var k=d.getBoundingClientRect(),g="fixed"===e(d,
"position"),f=p.isWindow(f)?f:9===f.nodeType&&f.defaultView;return{top:k.top+d.parentNode.scrollTop+(g?0:f.pageYOffset)-c.clientTop,left:k.left+d.parentNode.scrollLeft+(g?0:f.pageXOffset)-c.clientLeft}}};this.position=function(a){var c=this.offset(),d=this.elements[0],f=0,k=0,g={top:0,left:0};if(this.elements[0])return d=d.parentNode,r.nodeName(d,"html")||(f+=d.scrollLeft,k+=d.scrollTop),g={top:c.top-f,left:c.left-k},a&&(a=hAzzle(a))?(c=a.getPosition(),{top:g.top-c.top-parseInt(e(a,"borderLeftWidth"))||
0,left:g.left-c.left-parseInt(e(a,"borderTopWidth"))||0}):g};this.offsetParent=function(){return this.map(function(){for(var a=this.offsetParent||q;a&&!r.nodeName(a,"html")&&"static"===e(a,"position");)a=a.offsetParent;return a||q})};return{computed:c,styles:k,css:e}});
hAzzle.define("Units",function(){var g=hAzzle.require("curCSS"),m=/^(left$|right$|margin|padding)/,p=/^(relative|absolute|fixed)$/,r=/^(top|bottom)$/,t=function(q,a,c,k){if(""===a||"px"===a)return q;if("%"===a){m.test(k)?k="width":r.test(k)&&(k="height");if(c=p.test(g.css(c,"position"))?c.offsetParent:c.parentNode)if(k=parseFloat(g.css(c,k)),0!==k)return q/k*100;return 0}if("em"===a)return q/parseFloat(g.css(c,"fontSize"));void 0===t.unity&&(c=t.unity={},k=document.createElement("div"),k.style.width=
"100cm",document.body.appendChild(k),c.mm=k.offsetWidth/1E3,document.body.removeChild(k),c.cm=10*c.mm,c["in"]=2.54*c.cm,c.pt=1*c["in"]/72,c.pc=12*c.pt);return(a=t.unity[a])?q/a:q};return{units:t}});
hAzzle.define("Setters",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Core"),p=hAzzle.require("Types"),r=/\S+/g,t=/\r/g,q="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),a={},c={},k={"class":"className","for":"htmlFor"},e={get:{},set:{}},b={get:{},set:{}},s={get:{},
set:{}},d=function(a){return a instanceof hAzzle?a.elements:a},f=function(b,e){b=d(b);var f,h,g=0,m=e&&e.match(r);if(m&&1===b.nodeType)for(;f=m[g++];){h=k[f]||f;var p=b,s=a[f.toLowerCase()];s&&c[p.nodeName]&&s?b[h]=!1:b.removeAttribute(f);b.removeAttribute(f)}},h=function(a,c,e){var k=(a=d(a))?a.nodeType:void 0,h,g;if(k&&(3!==k||8!==k||2!==k)){if("undefined"===typeof a.getAttribute)return u(a,c,e);if(k=1!==k||!m.isXML(a))c=c.toLowerCase(),h=b["undefined"===e?"get":"set"][c]||null;if(void 0===e){if(h&&
(g=h.get(a,c))&&null!==g)return g;g=a.getAttribute(c,2);return null==g?void 0:g}if(e){if(h&&void 0!==(g=h.set(a,e,c)))return g;a.setAttribute(c,e+"")}else f(a,c)}return""},u=function(a,b,c){var f=(a=d(a))?a.nodeType:void 0,h,g;if(f&&(3!==f||8!==f||2!==f)){if(1!==f||m.isHTML)b=k[b]||b,h="undefined"===c?e.get[b]:e.set[b];return"undefined"!==typeof c?h&&void 0!==(g=h.set(a,c,b))?g:a[b]=c:h&&null!==(g=h(a,b))?g:a[b]}return""};this.val=function(a){var b,c,e;c=this.elements[0];if(arguments.length)return e=
p.isType("Function")(a),this.each(function(c,d){var f;1===c.nodeType&&(f=e?a.call(c,d,hAzzle(c).val()):a,null==f?f="":"number"===typeof f?f+="":p.isArray(f)&&(f=g.map(f,function(a){return null==a?"":a+""})),b=s.set[c.type]||s.set[c.nodeName.toLowerCase()],b&&void 0!==b(c,f,"value")||(c.value=f))});if(c){if(b=s.get[c.type]||s.get[c.nodeName.toLowerCase()])return b(c,"value");c=c.value;return"string"===typeof c?c.replace(t,""):null==c?"":c}};this.prop=function(a,b){var c=this.elements;if("object"===
typeof a)return this.each(function(b){g.each(a,function(a,c){u(b,c,a)})});if("undefined"===typeof b)return u(c[0],a);this.each(c,function(c){u(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[k[a]||a]})};this.removeAttr=function(a){return this.each(function(b){f(b,a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){g.each(a,function(a,c){h(b,
c,a)})}):"undefined"===typeof b?h(c[0],a):this.each(function(c){h(c,a,b)})};g.each(q,function(b){a[q[b]]=q[b]});g.each("input select option textarea button form details".split(" "),function(a){c[a.toUpperCase()]=!0});g.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),function(a){k[a.toLowerCase()]=
a});return{attrHooks:b,propHooks:e,valHooks:s,propMap:k,boolAttr:a,boolElem:c,removeAttr:f,attr:h,prop:u}});
hAzzle.define("attrHooks",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Support"),p=hAzzle.require("Setters");(function(){var g=document.createElement("input");g.type="checkbox";g=document.createElement("input");g.value="t";g.type="radio";return"t"===g.value})();g.mixin(p.attrHooks.set,{type:function(p,t){if(!m.radioValue&&"radio"===t&&g.nodeName(p,"input")){var q=p.value;p.setAttribute("type",t);q&&(p.value=q);return t}}});return{}});
hAzzle.define("propHooks",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Setters");g.mixin(m.propHooks.get,{tabIndex:function(g){return g.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(g.nodeName)||g.href?g.tabIndex:-1}});document.createElement("select").appendChild(document.createElement("option")).selected||(m.propHooks.get.selected=function(g){(g=g.parentNode)&&g.parentNode&&g.parentNode.selectedIndex;return null});return{}});
hAzzle.define("valHooks",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Strings"),p=hAzzle.require("Text"),r=hAzzle.require("Types"),t=hAzzle.require("Collection"),q=hAzzle.require("Setters"),a=function(){var a=document.createElement("input");a.type="checkbox";a.checked=!0;a=a.getAttributeNode("checked");return!a||!a.specified}(),c=function(a,c,b){var g=a.length;for(b=0>b?Math.max(0,g+b):b||0;b<g;b++)if(a[b]===c)return b;return-1};g.mixin(q.valHooks.set,{select:function(a,e){for(var b,
g,d=a.options,f=t.makeArray(e),h=d.length;h--;)if(g=d[h],g.selected=0<=c(f,g.value))b=!0;b||(a.selectedIndex=-1);return f}});g.mixin(q.valHooks.get,{option:function(a){var c=a.getAttribute(name,2);return null!==c?c:m.trim(p.getText(a))},select:function(a){var c=a.selectedIndex,b="select-one"===a.type;a=a.options;var g=[],d,f,h;if(0>c)return"";h=b?c:0;for(f=b?c+1:a.length;h<f;h++)if(d=a[h],d.selected&&null===d.getAttribute("disabled")&&(!d.parentElement.disabled||"OPTGROUP"!==d.parentElement.tagName)){d=
hAzzle(d).val();if(b)return d;g.push(d)}return b&&!g.length&&a.length?a[c].value:g}});g.each(["radio","checkbox"],function(a){q.valHooks.set[a]=function(a,b){if(r.isArray(b))return a.checked=0<=c(b,hAzzle(a).val())}});a||(q.valHooks.get[val]=function(a){return null===a.getAttribute("value")?"on":a.value});return{}});
(function(g){function m(a){return"string"===typeof a?g.document.createTextNode(a):a}function p(a){var b=g.document.createDocumentFragment(),c=t.call(a,0),d=0,f=a.length;if(1===a.length)return m(a[0]);for(;d<f;d++)try{b.appendChild(m(c[d]))}catch(h){}return b}for(var r=Array.prototype,t=r.slice,q=r.indexOf,r=(g.Element||g.Node||g.HTMLElement).prototype,a=["append",function(){this.appendChild(p(arguments))},"prepend",function(){this.firstChild?this.insertBefore(p(arguments),this.firstChild):this.appendChild(p(arguments))},
"before",function(){var a=this.parentElement;a&&a.insertBefore(p(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(p(arguments),this.nextSibling):this.parentElement.appendChild(p(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(p(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",r.matchesSelector||r.webkitMatchesSelector||r.mozMatchesSelector||r.msMatchesSelector||
function(a){var b=this.parentElement;return!!b&&-1<q.call(b.querySelectorAll(a),this)}],c=a.length;c;c-=2)r[a[c-2]]||(r[a[c-2]]=a[c-1]);try{new g.CustomEvent("?")}catch(k){g.CustomEvent=function(a,b){function c(a,b,e,g){this.initEvent(a,b,e);this.detail=g}return function(d,f){var g=document.createEvent(a);if("string"!==typeof d)throw Error("An event name must be provided");"Event"===a&&(g.initCustomEvent=c);null==f&&(f=b);g.initCustomEvent(d,f.bubbles,f.cancelable,f.detail);return g}}(g.CustomEvent?
"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}})(window);