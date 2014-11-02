/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.0d Release Candidate
 * Released under the MIT License.
 *
 * Date: 2014-11-02
 */
(function(){var g=/^#([\w\-]*)$/,m={},h={},n=function(a,d,l){if(a)throw a=Error("[hAzzle-"+d+"] "+l),a.code=d,a;},r=function(a){return a&&(a.ELEMENT_NODE||a.DOCUMENT_NODE)},p=function(a,d){if(a){if(!(this instanceof p))return new p(a,d);if(a instanceof p)return a;var l,e,q=p.require("Util"),f=p.require("Ready");"function"===typeof a&&(h.Ready?f.ready(a):n(!0,6,"ready.js module not installed"));if("string"===typeof a){if((l=g.exec(a))&&!d&&(e=[document.getElementById(l[1])]),null===e||void 0===e)e=
this.find(a,d,!0)}else e=a instanceof Array?q.unique(q.filter(a,r)):this.isNodeList(a)?q.filter(q.makeArray(a),r):a.nodeType?11===a.nodeType?a.children:[a]:a===window?[a]:[];void 0===e?(this.length=0,this.elements=[]):(this.elements=e,this.length=e.length);return this}};p.err=n;p.installed=h;p.require=function(a){return m[a]};p.define=function(a,d){n("string"!==typeof a,1,'id must be a string "'+a+'"');n(m[a],2,'module already included "'+a+'"');n("function"!==typeof d,3,'function body for "'+a+'" must be an function "'+
d+'"');h[a]=!0;m[a]=d.call(p.prototype)};p.codename="new-age";p.version="1.0.0a-rc";window.hAzzle=p})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("Support",function(){var g,m,h,n,r,p=function(e){var a=document.createElement("fieldset");try{return!!e(a)}catch(f){return!1}finally{a.parentNode&&a.parentNode.removeChild(a)}},a,d;h=document.createElement("input");a=document.createElement("select").appendChild(document.createElement("option"));h.type="checkbox";a=a.selected;h=document.createElement("input");h.value="t";h.type="radio";d="t"===h.value;var l;l="function"===typeof document.implementation.createHTMLDocument?!0:!1;p(function(e){e.classList.add("a",
"b");g=!!document.documentElement.classList;m=/(^| )a( |$)/.test(e.className)&&/(^| )b( |$)/.test(e.className)});h=p(function(e){return e.compareDocumentPosition(document.createElement("div"))&1});p(function(e){e=document.createDocumentFragment().appendChild(e);var a=document.createElement("input");a.setAttribute("type","radio");a.setAttribute("checked","checked");a.setAttribute("name","t");e.appendChild(a);e.innerHTML="<textarea>x</textarea>";n=!!e.cloneNode(!0).lastChild.defaultValue});p(function(e){r=
null!=e.style.borderRadius});return{assert:p,optSelected:a,radioValue:d,imcHTML:l,classList:g,multipleArgs:m,sortDetached:h,noCloneChecked:n,cS:!!document.defaultView.getComputedStyle,borderRadius:r}});
hAzzle.define("has",function(){var g=navigator.userAgent,m=window,h=m.document,n=h&&h.createElement("div"),r=Object.prototype.toString,p={},a=function(){if(h.documentMode)return h.documentMode;for(var a=7;4<a;a--){var e=h.createElement("div");e.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e";if(e.getElementsByTagName("span").length)return a}}(),d=function(a,e,d){p[a]=d?e(m,h,n):e};d("xpath",function(){return!!h.evaluate});d("air",function(){return!!m.runtime});d("dart",function(){return!(!m.startDart&&
!h.startDart)});d("promise",function(){return!!m.Promise});d("mobile",function(){return/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(g)});d("android",function(){return/^Android/i.test(g)});d("opera",function(){return"[object Opera]"===r.call(window.opera)});d("firefox",function(){return"undefined"!==typeof InstallTrigger});d("chrome",function(){return m.chrome});d("webkit",function(){return"WebkitAppearance"in h.documentElement.style});d("safari",function(){return 0<r.call(window.HTMLElement).indexOf("Constructor")});
d("ie",function(){return!!h.documentMode});d("touch",function(){return"ontouchstart"in document||"onpointerdown"in document&&0<navigator.maxTouchPoints||window.navigator.msMaxTouchPoints});d("touchEvents",function(){return"ontouchstart"in document});d("pointerEvents",function(){return"onpointerdown"in document});d("MSPointer",function(){return"msMaxTouchPoints"in navigator});return{has:function(a){"function"==typeof p[a]&&(p[a]=p[a](m,h,n));return p[a]},add:d,clearElement:function(a){if(a)for(;a.lastChild;)a.removeChild(a.lastChild);
return a},ie:a}});
hAzzle.define("Types",function(){var g,m=Object.prototype.toString,h=Array.isArray,n={},r="Arguments Array Boolean Date Error Function Map Number Object RegExp Set StringWeakMap ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32ArrayUint8Array Uint8ClampedArray Uint16Array Uint32Array".split(" ");for(g=r.length;g--;)n["[object "+r[g]+"]"]=!0;r="ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32Array Uint8Array Uint8ClampedArray Uint16Array Uint32Array".split(" ");for(g=
r.length;g--;)n["[object "+r[g]+"]"]=!1;var p=function(e){return"string"===typeof e},a=function(e){return"number"===typeof e},d=function(e){return e&&e.window===e},l=function(e){return e?function(a){return m.call(a)==="[object "+e+"]"}:function(){}};this.isNodeList=g=function(a){var d=Object.prototype.toString.call(a);if("[object HTMLCollection]"===d||"[object NodeList]"===d)return!0;if(!("length"in a&&"item"in a))return!1;try{if(null===a(0)||a(0)&&a(0).tagName)return!0}catch(f){}return!1};return{isType:l,
isArray:h,isEmpty:function(a){if(null==a)return!0;if(h(a)||p(a)||l("Arguments")(a))return 0===a.length;for(var d in a)if(null!=a&&Object.prototype.hasOwnProperty.call(a,d))return!1;return!0},isWindow:d,isObject:function(a){var d=typeof a;return"function"===d||a&&"object"===d||!1},isPlainObject:function(a){return"object"!==l(a)&&!d(a)&&Object.getPrototypeOf(a)==Object.prototype},isEmptyObject:function(a){for(var d in a)return!1;return!0},isNode:function(a){return!!a&&"object"===typeof a&&"nodeType"in
a},isElement:function(a){return a&&"object"===typeof a&&a.ELEMENT_NODE&&-1<m.call(a).indexOf("Element")||!1},isString:p,isArrayLike:function(a){return a&&"object"===typeof a&&"number"===typeof a.length&&n[m.call(a)]||!1},isNumber:a,isBoolean:function(a){return"boolean"===typeof a},isNumeric:function(a){return!h(a)&&0<=a-parseFloat(a)+1},isNaN:function(e){return a(e)&&e!=+e},isDefined:function(a){return"undefined"!==typeof a},isUndefined:function(a){return"undefined"===typeof a},isNodeList:g,isHostMethod:function(a,
d){var f=typeof a[d];return"function"===f||!("object"!=f||!a[d])||"unknown"==f}}});hAzzle.define("Text",function(){var g=function(m){if(m){var h,n="",r=0,p=m.length;h=m.nodeType;if(!h)for(;r<p;r++)h=m[r++],8!==h.nodeType&&(n+=g(h));else if(1===h||9===h||11===h){r=m.textContent;if("string"===typeof r)return m.textContent;for(m=m.firstChild;m;m=m.nextSibling)n+=g(m)}else if(3===h||4===h)return m.nodeValue;return n}};return{getText:g}});
hAzzle.define("Util",function(){var g=hAzzle.require("Types"),m=Object.prototype.hasOwnProperty,h=Array.prototype.slice,n=Object.keys,r=function(k,a){return m.call(k,a)},p=function(k,c,b,t){if(void 0===k)return k;"function"!==typeof c&&hAzzle.err(!0,5,"'fn' must be a function in util.each()");var f,d=k.length,e;if("function"==typeof c&&"undefined"===typeof b&&"undefined"===typeof t&&g.isArray(k))for(;++f<d&&!1!==c(k[f],f,k););c=a(c,b);if(d===+d)for(c=a(c,b),f=0;f<d&&(f=t?k.length-f-1:f,!1!==c(k[f],
f,k));f++);else if(k)for(e in k)if(!1===c(k[e],e,k))break;return k},a=function(k,a,c){if("function"===typeof k){if(void 0===a)return k;c=c?c:3;return 1===c?function(c){return k.call(a,c)}:2===c?function(c,b){return k.call(a,c,b)}:3===c?function(c,b,f){return k.call(a,c,b,f)}:4===c?function(c,b,f,d){return k.call(a,c,b,f,d)}:function(){return k.apply(a,arguments)}}if(!k)return l},d=function(k,c,b){return k?g.isType("Function")(k)?a(k,c,b):g.isObject(k)?e(k):f(k):l},l=function(k){return k},e=function(k){var a=
q(k),c=a.length;return function(k){if(!k)return!c;k=Object(k);for(var b=0,f,d;b<c;b++)if(f=a[b],d=f[0],f[1]!==k[d]||!(d in k))return!1;return!0}},q=function(k){for(var a=n(k),c=a.length,b=Array(c),f=0;f<c;f++)b[f]=[a[f],k[a[f]]];return b},f=function(k){return function(a){return a[k]}},c=function(k,a,c){if(null==k)return-1;var b=0,f=k.length;if(c)if("number"===typeof c)b=0>c?Math.max(0,f+c):c;else{c=d(void 0,void 0,1);for(var b=c(a),f=0,e=k.length;f<e;){var g=f+e>>>1;c(k[g])<b?f=g+1:e=g}b=f;return k[b]===
a?b:-1}for(;b<f;b++)if(k[b]===a)return b;return-1},b=function(k,a,c){for(var f in a)c&&(g.isPlainObject(a[f])||g.isArray(a[f]))?(g.isPlainObject(a[f])&&!g.isPlainObject(k[f])&&(k[f]={}),g.isArray(a[f])&&!g.isArray(k[f])&&(k[f]=[]),b(k[f],a[f],c)):void 0!==a[f]&&(k[f]=a[f])};return{each:p,mixin:function(k){if(g.isObject(k))for(var a,c,f=1,b=arguments.length;f<b;f++)for(c in a=arguments[f],a)r(a,c)&&(k[c]=a[c]);return k},makeArray:function(a){if(a instanceof Array)return a;for(var c=-1,f=a.length,b=
Array(f);++c<f;)b[c]=a[c];return b},merge:function(a,c){for(var f=+c.length,b=0,d=a.length;b<f;b++)a[d++]=c[b];a.length=d;return a},nodeName:function(a,c){return a&&a.nodeName&&a.nodeName.toLowerCase()===c.toLowerCase()},unique:function(a,f,b,e){if(!a)return[];g.isBoolean(f)&&(e=b,b=f,f=!1);void 0!==b&&(b=d(b,e));e=[];for(var l=[],v=0,h=a.length;v<h;v++){var n=a[v];if(f)v&&l===n||e.push(n),l=n;else if(b){var w=b(n,v,a);0>c(l,w)&&(l.push(w),e.push(n))}else 0>c(e,n)&&e.push(n)}return e},indexOf:c,instanceOf:function(a,
c){if(null==a)return!1;for(var b=a.$constructor||a.constructor;b;){if(b===c)return!0;b=b.parent}return a instanceof c},filter:function(a,c,b){var f=[];if(!a)return f;c=d(c,b);p(a,function(a,k,b){c(a,k,b)&&f.push(a)});return f},map:function(a,c,b){if(a){c=d(c,b);b=a.length!==+a.length&&n(a);for(var f=(b||a).length,e=Array(f),g,l=0;l<f;l++)g=b?b[l]:l,e[l]=c(a[g],g,a);return e}return[]},some:function(a,c,b){if(a){c=d(c,b);var f=a.length!==+a.length&&f(a);b=(f||a).length;var e,g;for(e=0;e<b;e++)if(g=
f?f[e]:e,c(a[g],g,a))return!0}return!1},reduce:function(c,b,f,e){c||(c=[]);b=a(b,e,4);var d=c.length!==+c.length&&n(c),g=(d||c).length,l=0,h;3>arguments.length&&(g||hAzzle.err(!0,7," no collection length exist in collection.reduce()"),f=c[d?d[l++]:l++]);for(;l<g;l++)h=d?d[l]:l,f=b(f,c[h],h,c);return f},now:Date.now,bind:function(a,c){var b=2<arguments.length?h.call(arguments,2):[],f;"string"===typeof c&&(f=a[c],c=a,a=f);return"function"!==typeof a||c instanceof RegExp?c:b.length?function(){return arguments.length?
a.apply(c||this,b.concat(h.call(arguments,0))):a.apply(c||this,b)}:function(){return arguments.length?a.apply(c||this,arguments):a.call(c||this)}},has:r,noop:function(){},extend:b,isInDocument:function(a){if(a){for(var c=document.body.parentNode;a;){if(a===c)return!0;a=a.parentNode}return!1}}}});
hAzzle.define("Core",function(){var g=window.document,m=g.documentElement,h=hAzzle.require("Support"),n=Array.prototype.indexOf,r=/^[^{]+\{\s*\[native \w/,p,a={},d,l,e=function(a,b){a===b&&(d=!0);return 0},q=function(a,b){var f=b&&a,e=f&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(e)return e;if(f)for(;f=f.nextSibling;)if(f===b)return-1;return a?1:-1},f={uidX:1,uidK:"hAzzle_id",expando:"hAzzle-"+String(Math.random()).replace(/\D/g,""),isXML:function(a){return(a=
a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1},xmlID:function(a){var b=a.getAttribute(this.uidK);b||(b=this.uidX++,a.setAttribute(this.uidK,b));return b},htmlID:function(a){return a.uniqueNumber||(a.uniqueNumber=this.uidX++)},"native":r.test(m.compareDocumentPosition),setDocument:function(c){var b=c.nodeType,k=c?c.ownerDocument||c:g;if(9!==b)if(b)k=c.ownerDocument;else if(c.navigator)k=c.document;else return;if(this.document!==k){this.document=c=k;var b=c.documentElement,u=this.xmlID(b),
s=a[u],t;if(!s){s=a[u]={};s.root=b;s.isXMLDocument=this.isXML(c);s.detectDuplicates=!!d;s.sortStable=f.expando.split("").sort(e).join("")===f.expando;h.assert(function(a){a.innerHTML='<a id="hAzzle_id"></a>';s.isHTMLDocument=!!c.getElementById("hAzzle_id")});if(!f.isXML(b)){s.getElementsByTagName=h.assert(function(a){a.appendChild(k.createComment(""));return!a.getElementsByTagName("*").length});s.getById=h.assert(function(a){a.innerHTML='<a name="hAzzle_id"></a><b id="hAzzle_id"></b>';return c.getElementById("hAzzle_id")===
a.firstChild});var b=f.rbuggyMatches=[],x=f.rbuggyQSA=[];(h.qsa=r.test(k.querySelectorAll))&&h.assert(function(a){a.innerHTML="<select msallowcapture=''><option selected=''></option></select>";a.querySelectorAll(":checked").length||x.push(":checked")});(s._matchesSelector=r.test(p=m._matches||m.webkitMatchesSelector||m.mozMatchesSelector||m.oMatchesSelector||m.msMatchesSelector))&&h.assert(function(a){f.disconnectedMatch=p.call(a,"div")});x=x.length&&new RegExp(x.join("|"));b=b.length&&new RegExp(b.join("|"))}s.contains=
f["native"]||f["native"].test(m.contains)?function(a,c){var b=9===a.nodeType?a.documentElement:a,f=c&&c.parentNode;return a===f||!!(f&&1===f.nodeType&&(b.contains?b.contains(f):a.compareDocumentPosition&&a.compareDocumentPosition(f)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f.sortOrder=f["native"]?function(a,c){if(a===c)return d=!0,0;var b=!a.compareDocumentPosition-!c.compareDocumentPosition;if(b)return b;b=(a.ownerDocument||a)===(c.ownerDocument||c)?a.compareDocumentPosition(c):
1;return b&1||!h.sortDetached&&c.compareDocumentPosition(a)===b?a===k||a.ownerDocument===g&&f.contains(g,a)?-1:c===k||c.ownerDocument===g&&f.contains(g,c)?1:l?n.call(l,a)-n.call(l,c):0:b&4?-1:1}:function(a,c){if(a===c)return d=!0,0;var b,f=0;b=a.parentNode;var e=c.parentNode,h=[a],t=[c];if(!b||!e)return a===k?-1:c===k?1:b?-1:e?1:l?n.call(l,a)-n.call(l,c):0;if(b===e)return q(a,c);for(b=a;b=b.parentNode;)h.unshift(b);for(b=c;b=b.parentNode;)t.unshift(b);for(;h[f]===t[f];)f++;return f?q(h[f],t[f]):h[f]===
g?-1:t[f]===g?1:0};b=null}for(t in s)this[t]=s[t]}}},e=f.sortOrder;f.setDocument(g);return{root:f.root,isXML:f.isXML,isHTML:!f.isXML(g),expando:f.expando,uniqueSort:function(a){var b,k=[],g=0,h=0;d=!f.detectDuplicates;l=!f.sortStable&&a.slice(0);a.sort(e);if(d){for(;b=a[h++];)b===a[h]&&(g=k.push(h));for(;g--;)a.splice(k[g],1)}l=null;return a},contains:f.contains,rbuggyQSA:f.rbuggyQSA}});
hAzzle.define("Collection",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Types"),h=Array.prototype,n=h.concat,r=h.push,p=function(a,d,g){"undefined"===typeof d&&(d=0);"undefined"===typeof g&&(g=a?a.length:0);var e=-1;g=g-d||0;for(var h=Array(0>g?0:g);++e<g;)h[e]=a[d+e];return h};this.toJqueryZepto=function(){for(var a=this.length,d=this.elements;a--;)this[a]=d[a];return this};this.get=function(a){return void 0===a?p(this.elements,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=
function(a){return hAzzle(-1===a?p(this.elements,this.length-1):p(this.elements,a,a+1))};this.reduce=function(a,d,h){return g.reduce(this.elements,a,d,h)};this.indexOf=function(a,d,g){return null==d?-1:h.indexOf.call(d,a,g)};this.map=function(a,d){return hAzzle(g.map(this.elements,a,d))};this.each=function(a,d,h){g.each(this.elements,a,d,h);return this};this.slice=function(a,d){return new hAzzle(p(this.elements,a,d))};this.concat=function(){var a=g.map(p(arguments),function(a){return a instanceof
hAzzle?a.elements:a});return hAzzle(n.apply(this.elements,a))};this.is=function(a){return 0<this.length&&0<this.filter(a).length};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var d=this.elements;return a?"string"===typeof a?g.indexOf(hAzzle(a).elements,d[0]):g.indexOf(d,a instanceof hAzzle?a.elements[0]:a):d[0]&&d[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,d){var g=a;"string"===typeof a&&(g=hAzzle(a,d).elements);return this.concat(g)};this.first=
function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===a%2})};g.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,d){this[d]=function(d){return this.map(function(e){return e[a]}).filter(d)}}.bind(this));g.each({prevAll:"previousElementSibling",nextAll:"nextElementSibling"},function(a,
d){this[d]=function(){var d=[];this.each(function(e){for(;(e=e[a])&&9!==e.nodeType;)d.push(e)});return hAzzle(d)}}.bind(this));return{makeArray:function(a,d){var h=d||[];void 0!==a&&(m.isArrayLike(Object(a))?g.merge(h,m.isString(a)?[a]:a):r.call(h,a));return h},slice:p}});
hAzzle.define("Jiesa",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Core"),h=hAzzle.require("Collection"),n=hAzzle.require("Support"),r=/^\s*[+~]/,p=/[\n\t\r]/g,a=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,d=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,l=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,e=RegExp("=[\\x20\\t\\r\\n\\f]*([^\\]'\"]*?)[\\x20\\t\\r\\n\\f]*\\]","g"),q=window.document.documentElement,f=q.matches||q.webkitMatchesSelector||q.mozMatchesSelector||q.oMatchesSelector||q.msMatchesSelector,
c=function(a,c,b){var f=a,k=a.getAttribute("id"),e=k||"__hAzzle__",d=a.parentNode,g=r.test(c);if(g&&!d)return[];k?e=e.replace(/'/g,"\\$&"):a.setAttribute("id",e);g&&d&&(a=a.parentNode);c=c.match(l);for(d=0;d<c.length;d++)c[d]="[id='"+e+"'] "+c[d];c=c.join(",");try{return b.call(a,c)}finally{k||f.removeAttribute("id")}},b=function(a,b,k){return k&&9!==k.nodeType?c(k,b,function(c){return f(a,c)}):f.call(a,b)},k=function(a){return a?"string"===typeof a?u(a):!a.nodeType&&arrayLike(a)?a[0]:a:document},
u=function(b,f){var e,l,q,w=[];f=k(f);if(!b||"string"!==typeof b)return w;if(1!==(l=f.nodeType)&&9!==l&&11!==l)return[];if(-1!==g.indexOf(b,",")&&(e=b.split(",")))return g.each(e,function(a){g.each(u(a),function(a){m.contains(w,a)||w.push(a)})}),w;if(m.isHTML)if(e=a.exec(b))if(b=e[1]){if(9===l)return(q=f.getElementById(b))&&q.id===b?[q]:[];if(f.ownerDocument&&(q=f.ownerDocument.getElementById(b))&&m.contains(f,q)&&q.id===e)return[q]}else{if(b=e[2])return h.slice(f.getElementsByClassName(b));if(b=
e[3])return h.slice(f.getElementsByTagName(b))}else{if(e=d.exec(b)){l=f.getElementsByTagName(e[1]);var A=e[2],r=e[3];g.each(l,function(a){var c;(c=a.id===A)||(c=n.classList?a.classList.contains(r):0<=(" "+a.className+" ").replace(p," ").indexOf(r));c&&w.push(a)});return w}if(n.qsa&&m.rbuggyQSA.length)return 1===f.nodeType&&"object"!==f.nodeName.toLowerCase()?h.slice(c(f,b,f.querySelectorAll)):h.slice(f.querySelectorAll(b))}},s=function(a,c,f){if(c.nodeType)return a===c;(a.ownerDocument||a)!==document&&
m.setDocument(a);c="string"===typeof c?c.replace(e,"='$1']"):c;if(c instanceof hAzzle)return g.some(c.elements,function(c){return s(a,c)});if(a===document)return!1;if(m&&m.isHTML)try{var k=b(a,c,f);if(k||m.disconnectedMatch||a.document&&11!==a.document.nodeType)return k}catch(d){}};this.find=function(a,c,b){if(b)return u(a,c);if("string"===typeof a)return 1===this.length?hAzzle(u(a,this.elements[0])):g.reduce(this.elements,function(c,b){return hAzzle(c.concat(h.slice(u(a,b))))},[]);var f,k=this.length,
e=this.elements;return hAzzle(g.filter(hAzzle(a).elements,function(a){for(f=0;f<k;f++)if(m.contains(e[f],a))return!0}))};this.filter=function(a,c){if(void 0===a)return this;if("function"===typeof a){var f=[];this.each(function(c,b){a.call(c,b)&&f.push(c)});return hAzzle(f)}return this.filter(function(){return b(this,a)!=(c||!1)})};return{matchesSelector:b,matches:s,find:u}});
hAzzle.define("Strings",function(){var g=String.prototype.trim,m=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,h=/[A-Z]/g,n=/^#x([\da-fA-F]+)$/,r=/^#(\d+)$/,p=/[&<>"']/g,a=/^-ms-/,d=/-([\da-z])/gi,l=[],e={lt:"<",gt:">",quot:'"',apos:"'",amp:"&"},q={},f=function(a,c){return c.toUpperCase()},c=function(a){return"-"+a.charAt(0).toLowerCase()},b;for(b in e)q[e[b]]=b;q["'"]="#39";return{capitalize:function(a){return a&&"string"===typeof a?a.charAt(0).toUpperCase()+a.slice(1):""},unCapitalize:function(a){return a&&
"string"===typeof a?a.charAt(0).toLowerCase()+a.slice(1):""},hyphenate:function(a){return"string"===typeof a?a?a.replace(h,c):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():a},camelize:function(c){return c&&"string"===typeof c?l[c]?l[c]:l[c]=c.replace(a,"ms-").replace(d,f):"number"===typeof c||"boolean"===typeof c?""+c:c},trim:function(a){return null==a?"":g?"string"===typeof a?a.trim():a:(a+"").replace(m,"")},escapeHTML:function(a){return a.replace(p,function(a){return"&"+q[a]+";"})},
unescapeHTML:function(a){return a.replace(/\&([^;]+);/g,function(a,c){var b;return c in e?e[c]:(b=c.match(n))?String.fromCharCode(parseInt(b[1],16)):(b=c.match(r))?String.fromCharCode(~~b[1]):a})}}});
hAzzle.define("Storage",function(){function g(){this.expando=p.expando+Math.random()}function m(f,c,b){if(void 0===b&&1===f.nodeType)if(b="data-"+c.replace(d,"-$1").toLowerCase(),b=f.getAttribute(b),"string"===typeof b){try{b="true"===b?!0:"false"===b?!1:"null"===b?null:+b+""===b?+b:a.test(b)?JSON.parse(b+""):b}catch(e){}q.set(f,c,b)}else b=void 0;return b}var h=hAzzle.require("Util"),n=hAzzle.require("Strings"),r=hAzzle.require("Types"),p=hAzzle.require("Core"),a=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
d=/([A-Z])/g,l=/\S+/g;g.accepts=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};g.prototype={register:function(a,c){var b={};b[this.expando]={value:c||{},writable:!0,configurable:!0};a.nodeType?a[this.expando]={value:c||{}}:Object.defineProperties(a,b);return a[this.expando]},cache:function(a,c){if(!g.accepts(a))return{};var b=a[this.expando];return b?b:this.register(a,c)},set:function(a,c,b){if(a){var e;a=this.cache(a);if("string"===typeof c)a[c]=b;else if(r.isEmptyObject(a))h.mixin(a,
c);else for(e in c)a[e]=c[e];return a}},access:function(a,c,b){if(void 0===c||c&&"string"===typeof c&&void 0===b)return b=this.get(a,c),void 0!==b?b:this.get(a,n.camelize(c));this.set(a,c,b);return void 0!==b?b:c},get:function(a,c){var b=this.cache(a);return void 0!==b&&void 0===c?b:b[c]},release:function(a,c){var b,e,d=this.cache(a);if(void 0===c)this.register(a);else for(r.isArray(c)?e=c.concat(c.map(n.camelize)):(b=n.camelize(c),c in d?e=[c,b]:(e=b,e=d[e]?[e]:e.match(l)||[])),b=e.length;b--;)delete d[e[b]]},
hasData:function(a){return!r.isEmptyObject(a[this.expando]||{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var e=new g,q=new g;this.data=function(a,c){var b,d,g,h=this.elements[0],l=h&&h.attributes;if(void 0===a){if(this.length&&(g=q.get(h),1===h.nodeType&&!e.get(h,"hasDataAttrs"))){for(b=l.length;b--;)l[b]&&(d=l[b].name,0===d.indexOf("data-")&&(d=n.camelize(d.slice(5)),m(h,d,g[d])));e.set(h,"hasDataAttrs",!0)}return g}if("object"===typeof a)return this.each(function(c){q.set(c,
a)});var p=n.camelize(a);if(h&&void 0===c){g=q.get(h,a);if(void 0!==g)return g;g=q.get(h,p);var r=e.get(this,"hasDataAttrs"),y=-1!==a.indexOf("-");if(void 0!==g)return g;g=m(h,p,void 0);if(void 0!==g)return g}else this.each(function(b){var e=q.get(b,p);q.set(b,p,c);y&&void 0!==e&&q.set(b,a,c);y&&void 0===r&&q.set(b,a,c)})};this.removeData=function(a){return this.each(function(c){q.release(c,a)})};return{"private":e,data:q}});
hAzzle.define("curCSS",function(){var g=hAzzle.require("has"),m=hAzzle.require("Core"),h=hAzzle.require("Types"),n=hAzzle.require("Util"),r=hAzzle.require("Support"),p=hAzzle.require("Storage"),a=window.document.documentElement,d=!!document.defaultView.getComputedStyle,l=r.computedStyle&&g.has("webkit")?function(a){var b;if(1===a.nodeType){var f=a.ownerDocument.defaultView;b=f.getComputedStyle(a,null);!b&&a.style&&(a.style.display="",b=f.getComputedStyle(a,null))}return b||{}}:function(a){if(a&&null!==
a.ownerDocument){var b=!1;if(a)return void 0!==a.ownerDocument&&(b=a.ownerDocument.defaultView),r.cS?b&&d?b.opener?b.getComputedStyle(a,null):window.getComputedStyle(a,null):a.style:a.style}return""},e=function(a){if(a)return void 0===p["private"].get(a,"computed")&&p["private"].access(a,"computed",{computedStyle:null}),p["private"].get(a,"computed")},q=function(a){return null===e(a).computedStyle?e(a).computedStyle=l(a):e(a).computedStyle},f=function(a,b,e){"object"===typeof a&&a instanceof hAzzle&&
(a=a.elements[0]);var d=0;if(!e){if("height"===b&&"border-box"!==f(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-(parseFloat(f(a,"borderTopWidth"))||0)-(parseFloat(f(a,"borderBottomWidth"))||0)-(parseFloat(f(a,"paddingTop"))||0)-(parseFloat(f(a,"paddingBottom"))||0);if("width"===b&&"border-box"!==f(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-(parseFloat(f(a,"borderLeftWidth"))||0)-(parseFloat(f(a,"borderRightWidth"))||0)-(parseFloat(f(a,"paddingLeft"))||0)-(parseFloat(f(a,
"paddingRight"))||0)}if(d=q(a))return(g.ie||g.has("firefox"))&&"borderColor"===b&&(b="borderTopColor"),d=9===g.ie&&"filter"===b?d.getPropertyValue(b):d[b],""!==d||m.contains(a.ownerDocument,a)||(d=a.style[b]),"auto"!==d||"top"!==b&&"right"!==b&&"bottom"!==b&&"left"!==b||(e=f(a,"position"),"fixed"!==e&&("absolute"!==e||"left"!==b&&"top"!==b))||(d=hAzzle(a).position()[b]+"px"),void 0!==d?d+"":d};this.offset=function(a){if(arguments.length)return void 0===a?this.elements:this.each(function(b,e){var d=
a,g,k,l,n=f(b,"position"),q=hAzzle(b),m={};"static"===n&&(b.style.position="relative");l=q.offset();k=f(b,"top");g=f(b,"left");("absolute"===n||"fixed"===n)&&-1<(k+g).indexOf("auto")?(g=q.position(),k=g.top,g=g.left):(k=parseFloat(k)||0,g=parseFloat(g)||0);h.isType("function")(d)&&(d=d.call(b,e,l));null!=d.top&&(m.top=d.top-l.top+k);null!=d.left&&(m.left=d.left-l.left+g);"using"in d?d.using.call(b,m):q.css(m)});var b,e=this.elements[0],d=e&&e.ownerDocument;if(d){b=d.documentElement;if(!m.contains(b,
e))return{top:0,left:0};var g=e.getBoundingClientRect(),l="fixed"===f(e,"position"),d=h.isWindow(d)?d:9===d.nodeType&&d.defaultView;return{top:g.top+e.parentNode.scrollTop+(l?0:d.pageYOffset)-b.clientTop,left:g.left+e.parentNode.scrollLeft+(l?0:d.pageXOffset)-b.clientLeft}}};this.position=function(a){var b=this.offset(),e=this.elements[0],d=0,g=0,h={top:0,left:0};if(this.elements[0])return e=e.parentNode,n.nodeName(e,"html")||(d+=e.scrollLeft,g+=e.scrollTop),h={top:b.top-d,left:b.left-g},a&&(a=hAzzle(a))?
(b=a.getPosition(),{top:h.top-b.top-parseInt(f(a,"borderLeftWidth"))||0,left:h.left-b.left-parseInt(f(a,"borderTopWidth"))||0}):h};this.offsetParent=function(){return this.map(function(){for(var c=this.offsetParent||a;c&&!n.nodeName(c,"html")&&"static"===f(c,"position");)c=c.offsetParent;return c||a})};return{computed:e,styles:q,css:f}});
hAzzle.define("Units",function(){var g=hAzzle.require("curCSS"),m=hAzzle.require("Support"),h=/^(left$|right$|margin|padding)/,n=/^(relative|absolute|fixed)$/,r=/^(top|bottom)$/,p=function(a,d,l,e){if(""===d||"px"===d)return a;if("%"===d){h.test(e)?e="width":r.test(e)&&(e="height");if(l=n.test(g.css(l,"position"))?l.offsetParent:l.parentNode)if(e=parseFloat(g.css(l,e)),0!==e)return a/e*100;return 0}if("em"===d)return a/parseFloat(g.css(l,"fontSize"));if(void 0===p.unity){var q=p.unity={};m.assert(function(a){a.style.width=
"100cm";document.body.appendChild(a);q.mm=a.offsetWidth/1E3});q.cm=10*q.mm;q["in"]=2.54*q.cm;q.pt=1*q["in"]/72;q.pc=12*q.pt}return(d=p.unity[d])?a/d:a};return{units:p}});
hAzzle.define("Setters",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Core"),h=hAzzle.require("Types"),n=hAzzle.require("has"),r=Array.prototype.concat,p=/\S+/g,a=/\r/g,d="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),l={},e={},q={"class":"className","for":"htmlFor"},
f={innerHTML:1,textContent:1,className:1,htmlFor:n.has("ie"),value:1},c={get:{},set:{}},b={get:{},set:{}},k={get:{},set:{}},u={get:{},set:{}},s={get:{},set:{}},t=function(a){return a instanceof hAzzle?a.elements:a},x=function(a,b){var c=l[b.toLowerCase()];return c&&e[a.nodeName]&&c},v=function(a,b){a=t(a);for(var c,e,f=0,d="string"===typeof b?b.match(p):r(b),g=d.length;f<g;f++)c=d[f],e=q[c]||c,x(a,c)?a[e]=!1:a.removeAttribute(c)},y=function(a,b,e){var d=(a=t(a))?a.nodeType:void 0,g,l,n=f[b];if(!d||
3===d||8===d||2===d)return"";if("undefined"===typeof a.getAttribute)return z(a,b,e);1===d&&m.isXML(a)||(b=b.toLowerCase(),g=c["undefined"===e?"get":"set"][b]||x(a,b)?u["undefined"===e?"get":"set"][b]:k["undefined"===e?"get":"set"][b]);if(void 0===e){if(g&&(l=g.get(a,b))&&null!==l)return l;if("textContent"==b)return z(a,b);l=a.getAttribute(b,2);return null==l?void 0:l}if(e){if(g&&void 0!==(l=g.set(a,e,b)))return l;if(n||"boolean"==typeof e||h.isType("Function")(e))return z(a,b,e);a.setAttribute(b,
e+"")}else v(a,b)},z=function(a,c,e){var f=(a=t(a))?a.nodeType:void 0,d,g;if(!f||3===f||8===f||2===f)return"";if(1!==f||m.isHTML)c=q[c]||c,d="undefined"===e?b.get[c]:b.set[c];return"undefined"!==typeof e?d&&void 0!==(g=d.set(a,e,c))?g:a[c]=e:d&&null!==(g=d(a,c))?g:a[c]};this.val=function(b){var c,e,f;e=this.elements[0];if(arguments.length)return f=h.isType("Function")(b),this.each(function(a,e){var d;1===a.nodeType&&(d=f?b.call(a,e,hAzzle(a).val()):b,null==d?d="":"number"===typeof d?d+="":h.isArray(d)&&
(d=g.map(d,function(a){return null==a?"":a+""})),c=s.set[a.type]||s.set[a.nodeName.toLowerCase()],c&&void 0!==c(a,d,"value")||(a.value=d))});if(e){if(c=s.get[e.type]||s.get[e.nodeName.toLowerCase()])return c(e,"value");e=e.value;return"string"===typeof e?e.replace(a,""):null==e?"":e}};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.prop=function(a,b){var c=this.elements;if("object"===typeof a)return this.each(function(b){g.each(a,function(a,c){z(b,c,a)})});
if("undefined"===typeof b)return z(c[0],a);this.each(c,function(c){z(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[q[a]||a]})};this.removeAttr=function(a){return this.each(function(b){v(b,a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){g.each(a,function(a,c){y(b,c,a)})}):"undefined"===typeof b?y(c[0],a):this.each(function(c){y(c,
a,b)})};g.each(d,function(a){l[d[a]]=d[a]});g.each("input select option textarea button form details".split(" "),function(a){e[a.toUpperCase()]=!0});g.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),function(a){q[a.toLowerCase()]=a});return{attrHooks:c,propHooks:b,boolHooks:u,nodeHooks:k,valHooks:s,
propMap:q,boolAttr:l,boolElem:e,attr:y,prop:z,removeAttr:v,getBooleanAttrName:x}});hAzzle.define("attrHooks",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Support"),h=hAzzle.require("Setters");g.mixin(h.attrHooks.set,{type:function(h,r){if(!m.radioValue&&"radio"===r&&g.nodeName(h,"input")){var p=h.value;h.setAttribute("type",r);p&&(h.value=p);return r}}});return{}});
hAzzle.define("propHooks",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Support"),h=hAzzle.require("Setters");g.mixin(h.propHooks.get,{tabIndex:function(g){return g.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(g.nodeName)||g.href?g.tabIndex:-1}});m.optSelected||(h.propHooks.get.selected=function(g){(g=g.parentNode)&&g.parentNode&&g.parentNode.selectedIndex;return null});return{}});
hAzzle.define("boolHooks",function(){var g=hAzzle.require("Setters");g.boolHooks.set=function(m,h,n){!1===h?g.removeAttr(m,n):m.setAttribute(n,n);return n};return{}});
hAzzle.define("valHooks",function(){var g=hAzzle.require("Util"),m=hAzzle.require("Strings"),h=hAzzle.require("Text"),n=hAzzle.require("Types"),r=hAzzle.require("Collection"),p=hAzzle.require("Support"),a=hAzzle.require("Setters"),d=function(a,e,d){var f=a.length;for(d=0>d?Math.max(0,f+d):d||0;d<f;d++)if(a[d]===e)return d;return-1};g.mixin(a.valHooks.set,{select:function(a,e){for(var g,f,c=a.options,b=r.makeArray(e),h=c.length;h--;)if(f=c[h],f.selected=0<=d(b,f.value))g=!0;g||(a.selectedIndex=-1);
return b}});g.mixin(a.valHooks.get,{option:function(a){var e=a.getAttribute(name,2);return null!==e?e:m.trim(h.getText(a))},select:function(a){var e=a.selectedIndex,d="select-one"===a.type;a=a.options;var f=[],c,b,g;if(0>e)return"";g=d?e:0;for(b=d?e+1:a.length;g<b;g++)if(c=a[g],c.selected&&(p.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentElement.disabled||"OPTGROUP"!==c.parentElement.tagName)){c=hAzzle(c).val();if(d)return c;f.push(c)}return d&&!f.length&&a.length?a[e].value:
f}});g.each(["radio","checkbox"],function(g){a.valHooks.set[g]=function(a,g){if(n.isArray(g))return a.checked=0<=d(g,hAzzle(a).val())}})});
(function(g){function m(a){return"string"===typeof a?g.document.createTextNode(a):a}function h(a){var d=g.document.createDocumentFragment(),f=r.call(a,0),c=0,b=a.length;if(1===a.length)return m(a[0]);for(;c<b;c++)try{d.appendChild(m(f[c]))}catch(h){}return d}for(var n=Array.prototype,r=n.slice,p=n.indexOf,n=(g.Element||g.Node||g.HTMLElement).prototype,a=["append",function(){this.appendChild(h(arguments))},"prepend",function(){this.firstChild?this.insertBefore(h(arguments),this.firstChild):this.appendChild(h(arguments))},
"before",function(){var a=this.parentElement;a&&a.insertBefore(h(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(h(arguments),this.nextSibling):this.parentElement.appendChild(h(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(h(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",n.matchesSelector||n.webkitMatchesSelector||n.mozMatchesSelector||n.msMatchesSelector||
function(a){var d=this.parentElement;return!!d&&-1<p.call(d.querySelectorAll(a),this)}],d=a.length;d;d-=2)n[a[d-2]]||(n[a[d-2]]=a[d-1]);try{new g.CustomEvent("?")}catch(l){g.CustomEvent=function(a,d){function f(a,b,d,e){this.initEvent(a,b,d);this.detail=e}return function(c,b){var g=document.createEvent(a);if("string"!==typeof c)throw Error("An event name must be provided");"Event"===a&&(g.initCustomEvent=f);null==b&&(b=d);g.initCustomEvent(c,b.bubbles,b.cancelable,b.detail);return g}}(g.CustomEvent?
"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}})(window);