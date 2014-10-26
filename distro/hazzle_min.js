/*!
 * hAzzle.js
 * Copyright (c) 2014 Kenny Flashlight
 * Version: 1.0.0b Release Candidate
 * Released under the MIT License.
 *
 * Date: 2014-10-25
 */
(function(){var d=/^#([\w\-]*)$/,l={},h={},p=function(b,f,a){if(b)throw b=Error("[hAzzle-"+f+"] "+a),b.code=f,b;},k=function(b){return b&&(b.ELEMENT_NODE||b.DOCUMENT_NODE)},n=function(b,f){if(b){if(!(this instanceof n))return new n(b,f);if(b instanceof n)return b;var a;a=n.require("Util");var c=n.require("Ready");"function"===typeof b&&(h.Ready?c.ready(b):p(!0,6,"ready.js module not installed"));if("string"===typeof b){if((a=d.exec(b))&&!f&&(this.elements=[document.getElementById(a[1])]),null===this.elements||
void 0===this.elements)this.elements=this.find(b,f,!0)}else b instanceof Array?this.elements=a.unique(a.filter(b,k)):this.isNodeList(b)?this.elements=a.filter(a.makeArray(b),k):this.elements=b.nodeType?11===b.nodeType?b.children:[b]:b===window?[b]:[];void 0===this.elements?(this.length=0,this.elements=[]):this.length=this.elements.length;return this}};n.version="1.0.0a-rc";n.err=p;n.installed=h;n.require=function(b){return l[b]};n.define=function(b,f){p("string"!==typeof b,1,'id must be a string "'+
b+'"');p(l[b],2,'module already included "'+b+'"');p("function"!==typeof f,3,'function body for "'+b+'" must be an function "'+f+'"');h[b]=!0;l[b]=f.call(n.prototype)};window.hAzzle=n})(window);var hAzzle=window.hAzzle||(window.hAzzle={});
hAzzle.define("Support",function(){var d,l,h,p,k=function(a){var c=document.createElement("fieldset");try{return!!a(c)}catch(b){return!1}finally{c.parentNode&&c.parentNode.removeChild(c)}},n,b;h=document.createElement("input");n=document.createElement("select").appendChild(document.createElement("option"));h.type="checkbox";n=n.selected;h=document.createElement("input");h.value="t";h.type="radio";b="t"===h.value;var f;f="function"===typeof document.implementation.createHTMLDocument?!0:!1;k(function(a){a.classList.add("a",
"b");d=!!document.documentElement.classList;l=/(^| )a( |$)/.test(a.className)&&/(^| )b( |$)/.test(a.className)});h=k(function(a){return a.compareDocumentPosition(document.createElement("div"))&1});k(function(a){a=document.createDocumentFragment().appendChild(a);var c=document.createElement("input");c.setAttribute("type","radio");c.setAttribute("checked","checked");c.setAttribute("name","t");a.appendChild(c);a.innerHTML="<textarea>x</textarea>";p=!!a.cloneNode(!0).lastChild.defaultValue});return{assert:k,
optSelected:n,radioValue:b,imcHTML:f,classList:d,multipleArgs:l,sortDetached:h,noCloneChecked:p,cS:!!document.defaultView.getComputedStyle}});
hAzzle.define("has",function(){var d=navigator.userAgent,l=window,h=l.document,p=h&&h.createElement("div"),k={},n=function(){if(h.documentMode)return h.documentMode;for(var a=7;4<a;a--){var c=h.createElement("div");c.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e";if(c.getElementsByTagName("span").length)return a}}(),b=function(a){return"function"===typeof k[a]?k[a]=k[a](l,h,p):k[a]},f=function(a,c,f,m){("undefined"===typeof k[a]||m)&&(k[a]=c);return f&&b(a)};f("xpath",function(){return!!h.evaluate});
f("air",function(){return!!l.runtime});f("dart",function(){return!(!l.startDart&&!h.startDart)});f("promise",function(){return!!l.Promise});f("mobile",function(){return/^Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(d)});f("android",function(){return/^Android/i.test(d)});f("opera",function(){return!!l.opera||0<=d.indexOf(" OPR/")});f("firefox",function(){return"undefined"!==typeof InstallTrigger});f("chrome",function(){return l.chrome});f("webkit",function(){return"WebkitAppearance"in
h.documentElement.style});f("safari",function(){return 0<Object.prototype.toString.call(l.HTMLElement).indexOf("Constructor")});f("ie",function(){return!!h.documentMode});f("touch",function(){return"ontouchstart"in document||"onpointerdown"in document&&0<navigator.maxTouchPoints||window.navigator.msMaxTouchPoints});f("touchEvents",function(){return"ontouchstart"in document});f("pointerEvents",function(){return"onpointerdown"in document});f("MSPointer",function(){return"msMaxTouchPoints"in navigator});
return{has:b,add:f,clearElement:function(a){if(a)for(;a.lastChild;)a.removeChild(a.lastChild);return a},ie:n}});
hAzzle.define("Types",function(){var d,l=Object.prototype.toString,h=Array.isArray,p={},k="Arguments Array Boolean Date Error Function Map Number Object RegExp Set StringWeakMap ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32ArrayUint8Array Uint8ClampedArray Uint16Array Uint32Array".split(" ");for(d=k.length;d--;)p["[object "+k[d]+"]"]=!0;k="ArrayBuffer Float32Array Float64Array Int8Array Int16Array Int32Array Uint8Array Uint8ClampedArray Uint16Array Uint32Array".split(" ");for(d=
k.length;d--;)p["[object "+k[d]+"]"]=!1;var n=function(c){return"number"===typeof c},b=function(c){return c&&c.window===c},f=function(c){return c?function(a){return l.call(a)==="[object "+c+"]"}:function(){}},a=function(c){var a=typeof c;return"function"===a||c&&"object"===a||!1};this.isNodeList=d=function(c){var a=Object.prototype.toString.call(c);if("[object HTMLCollection]"===a||"[object NodeList]"===a)return!0;if(!("length"in c&&"item"in c))return!1;try{if(null===c(0)||c(0)&&c(0).tagName)return!0}catch(b){}return!1};
return{isType:f,isFunction:f("Function"),isArray:h,isEmpty:function(c){if(c instanceof hAzzle&&0<c.length)return!1;var b=0;if(h(c))c=0===c.length;else if(a(c)){for(var m in c){b++;break}c=0===b}else c=""===c;return c},isWindow:b,isObject:a,isPlainObject:function(c){return"object"!==f(c)&&!b(c)&&Object.getPrototypeOf(c)==Object.prototype},isEmptyObject:function(c){for(var a in c)return!1;return!0},isNode:function(c){return!!c&&"object"===typeof c&&"nodeType"in c},isElement:function(c){return c&&"object"===
typeof c&&c.ELEMENT_NODE&&-1<l.call(c).indexOf("Element")||!1},isString:function(c){return"string"===typeof c},isArrayLike:function(c){return c&&"object"===typeof c&&"number"===typeof c.length&&p[l.call(c)]||!1},isNumber:n,isBoolean:function(c){return"boolean"===typeof c},isNumeric:function(c){return!h(c)&&0<=c-parseFloat(c)+1},isNaN:function(c){return n(c)&&c!=+c},isDefined:function(c){return"undefined"!==typeof c},isUndefined:function(c){return"undefined"===typeof c},isNodeList:d,isHostMethod:function(c,
a){var b=typeof c[a];return"function"===b||!("object"!=b||!c[a])||"unknown"==b}}});hAzzle.define("Text",function(){var d=function(l){if(l){var h,p="",k=0,n=l.length;h=l.nodeType;if(!h)for(;k<n;k++)h=l[k++],8!==h.nodeType&&(p+=d(h));else if(1===h||9===h||11===h){k=l.textContent;if("string"===typeof k)return l.textContent;for(l=l.firstChild;l;l=l.nextSibling)p+=d(l)}else if(3===h||4===h)return l.nodeValue;return p}};return{getText:d}});
hAzzle.define("Util",function(){var d=hAzzle.require("Types"),l=Object.prototype.hasOwnProperty,h=Array.prototype.slice,p=Object.keys,k=function(q,a){return l.call(q,a)},n=function(q,a,c,e){if(void 0===q)return q;"function"!==typeof a&&hAzzle.err(!0,5,"'fn' must be a function in util.each()");a=b(a,c);var s;c=q.length;if(c===+c)for(s=0;s<c&&(s=e?q.length-s-1:s,!1!==a(q[s],s,q));s++);else if(q)for(s in q)if(!1===a(q[s],s,q))break;return q},b=function(q,c,e){if("function"===typeof q){if(void 0===c)return q;
e=e?e:3;return 1===e?function(a){return q.call(c,a)}:2===e?function(a,e){return q.call(c,a,e)}:3===e?function(a,e,b){return q.call(c,a,e,b)}:4===e?function(a,e,b,w){return q.call(c,a,e,b,w)}:function(){return q.apply(c,arguments)}}if(!q)return a},f=function(q,e,w){return q?d.isFunction(q)?b(q,e,w):d.isObject(q)?c(q):m(q):a},a=function(a){return a},c=function(a){var c=r(a),e=c.length;return function(a){if(!a)return!e;a=Object(a);for(var q=0,b,g;q<e;q++)if(b=c[q],g=b[0],b[1]!==a[g]||!(g in a))return!1;
return!0}},r=function(a){for(var c=p(a),e=c.length,b=Array(e),s=0;s<e;s++)b[s]=[c[s],a[c[s]]];return b},m=function(a){return function(c){return c[a]}},e=function(a,c,e){if(null==a)return-1;var b=0,s=a.length;if(e)if("number"===typeof e)b=0>e?Math.max(0,s+e):e;else return b=g(a,c),a[b]===c?b:-1;for(;b<s;b++)if(a[b]===c)return b;return-1},g=function(a,c,e,b){e=f(e,b,1);c=e(c);b=0;for(var s=a.length;b<s;){var g=b+s>>>1;e(a[g])<c?b=g+1:s=g}return b},u=function(a,c,e){for(var b in c)e&&(d.isPlainObject(c[b])||
d.isArray(c[b]))?(d.isPlainObject(c[b])&&!d.isPlainObject(a[b])&&(a[b]={}),d.isArray(c[b])&&!d.isArray(a[b])&&(a[b]=[]),u(a[b],c[b],e)):void 0!==c[b]&&(a[b]=c[b])};return{each:n,mixin:function(a){if(!d.isObject(a))return a;for(var c,e,b=1,g=arguments.length;b<g;b++)for(e in c=arguments[b],c)k(c,e)&&(a[e]=c[e]);return a},makeArray:function(a){if(a instanceof Array)return a;for(var c=-1,e=a.length,b=Array(e);++c<e;)b[c]=a[c];return b},merge:function(a,c){for(var e=+c.length,b=0,g=a.length;b<e;b++)a[g++]=
c[b];a.length=g;return a},acceptData:function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType},createCallback:b,isElement:function(a){return a&&(1===a.nodeType||9===a.nodeType)},nodeName:function(a,c){return a&&a.nodeName&&a.nodeName.toLowerCase()===c.toLowerCase()},unique:function(a,c,b,g){if(!a)return[];d.isBoolean(c)&&(g=b,b=c,c=!1);void 0!==b&&(b=f(b,g));g=[];for(var s=[],m=0,n=a.length;m<n;m++){var h=a[m];if(c)m&&s===h||g.push(h),s=h;else if(b){var r=b(h,m,a);0>e(s,r)&&(s.push(r),g.push(h))}else 0>
e(g,h)&&g.push(h)}return g},sortedIndex:g,indexOf:e,property:m,matches:c,pairs:r,filter:function(a,c,e){var b=[];if(!a)return b;c=f(c,e);n(a,function(a,e,g){c(a,e,g)&&b.push(a)});return b},map:function(a,c,e){if(a){c=f(c,e);e=a.length!==+a.length&&p(a);for(var b=(e||a).length,g=Array(b),m,d=0;d<b;d++)m=e?e[d]:d,g[d]=c(a[m],m,a);return g}return[]},some:function(a,c,e){if(!a)return!1;c=f(c,e);var b=a.length!==+a.length&&b(a);e=(b||a).length;var g,m;for(g=0;g<e;g++)if(m=b?b[g]:g,c(a[m],m,a))return!0;
return!1},now:Date.now,bind:function(a,c){var e=2<arguments.length?h.call(arguments,2):[],b;"string"===typeof c&&(b=a[c],c=a,a=b);return"function"!==typeof a||c instanceof RegExp?c:e.length?function(){return arguments.length?a.apply(c||this,e.concat(h.call(arguments,0))):a.apply(c||this,e)}:function(){return arguments.length?a.apply(c||this,arguments):a.call(c||this)}},has:k,noop:function(){},extend:u,reject:function(a,c,e){for(var b=[],g=0,m=0,d=a.length;g<d;g++)g in a&&!c.call(e,a[g],g,a)&&(b[m++]=
a[g]);return b},consoleLog:function(a){"undefined"!==typeof console&&d.isHostMethod(console,"log")&&console.log(a)}}});
hAzzle.define("Core",function(){var d=window.document,l=d.documentElement,h=hAzzle.require("Support"),p=Array.prototype.indexOf,k=/^[^{]+\{\s*\[native \w/,n,b={},f={},a,c,r=function(c,b){c===b&&(a=!0);return 0},m=function(a,c){var b=c&&a,m=b&&1===a.nodeType&&1===c.nodeType&&(~c.sourceIndex||-2147483648)-(~a.sourceIndex||-2147483648);if(m)return m;if(b)for(;b=b.nextSibling;)if(b===c)return-1;return a?1:-1};b.uidX=1;b.uidK="hAzzle_id";b.expando="hAzzle-"+String(Math.random()).replace(/\D/g,"");b.isXML=
function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1};b.xmlID=function(a){var c=a.getAttribute(this.uidK);c||(c=this.uidX++,a.setAttribute(this.uidK,c));return c};b.htmlID=function(a){return a.uniqueNumber||(a.uniqueNumber=this.uidX++)};b["native"]=k.test(l.compareDocumentPosition);b.setDocument=function(e){var g=e.nodeType,u=e?e.ownerDocument||e:d;if(9!==g)if(g)u=e.ownerDocument;else if(e.navigator)u=e.document;else return;if(this.document!==u){this.document=e=u;var g=
e.documentElement,q=this.xmlID(g),t=f[q],w;if(!t){t=f[q]={};t.root=g;t.isXMLDocument=this.isXML(e);t.detectDuplicates=!!a;t.sortStable=b.expando.split("").sort(r).join("")===b.expando;h.assert(function(a){a.innerHTML='<a id="hAzzle_id"></a>';t.isHTMLDocument=!!e.getElementById("hAzzle_id")});if(!b.isXML(g)){t.getElementsByTagName=h.assert(function(a){a.appendChild(u.createComment(""));return!a.getElementsByTagName("*").length});t.getById=h.assert(function(a){a.innerHTML='<a name="hAzzle_id"></a><b id="hAzzle_id"></b>';
return e.getElementById("hAzzle_id")===a.firstChild});var g=b.rbuggyMatches=[],v=b.rbuggyQSA=[];(h.qsa=k.test(u.querySelectorAll))&&h.assert(function(a){a.innerHTML="<select msallowcapture=''><option selected=''></option></select>";a.querySelectorAll(":checked").length||v.push(":checked")});(t.matchesSelector=k.test(n=l.matches||l.webkitMatchesSelector||l.mozMatchesSelector||l.oMatchesSelector||l.msMatchesSelector))&&h.assert(function(a){b.disconnectedMatch=n.call(a,"div")});v=v.length&&new RegExp(v.join("|"));
g=g.length&&new RegExp(g.join("|"))}t.contains=b["native"]||b["native"].test(l.contains)?function(a,c){var b=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(b.contains?b.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};b.sortOrder=b["native"]?function(e,g){if(e===g)return a=!0,0;var m=!e.compareDocumentPosition-!g.compareDocumentPosition;if(m)return m;m=(e.ownerDocument||
e)===(g.ownerDocument||g)?e.compareDocumentPosition(g):1;return m&1||!h.sortDetached&&g.compareDocumentPosition(e)===m?e===u||e.ownerDocument===d&&b.contains(d,e)?-1:g===u||g.ownerDocument===d&&b.contains(d,g)?1:c?p.call(c,e)-p.call(c,g):0:m&4?-1:1}:function(b,e){if(b===e)return a=!0,0;var g,f=0;g=b.parentNode;var q=e.parentNode,h=[b],n=[e];if(!g||!q)return b===u?-1:e===u?1:g?-1:q?1:c?p.call(c,b)-p.call(c,e):0;if(g===q)return m(b,e);for(g=b;g=g.parentNode;)h.unshift(g);for(g=e;g=g.parentNode;)n.unshift(g);
for(;h[f]===n[f];)f++;return f?m(h[f],n[f]):h[f]===d?-1:n[f]===d?1:0};g=null}for(w in t)this[w]=t[w]}};r=b.sortOrder;b.setDocument(d);return{root:b.root,isXML:b.isXML,isHTML:!b.isXML(d),expando:b.expando,uniqueSort:function(e){var g,m=[],f=0,d=0;a=!b.detectDuplicates;c=!b.sortStable&&e.slice(0);e.sort(r);if(a){for(;g=e[d++];)g===e[d]&&(f=m.push(d));for(;f--;)e.splice(m[f],1)}c=null;return e},contains:b.contains,rbuggyQSA:b.rbuggyQSA}});
hAzzle.define("Collection",function(){var d=hAzzle.require("Util"),l=hAzzle.require("Types"),h=Array.prototype,p=Object.keys,k=h.concat,n=h.push,b=function(a,c,b,m){a||(a=[]);c=d.createCallback(c,m,4);var e=a.length!==+a.length&&p(a),g=(e||a).length,f=0,h;3>arguments.length&&(g||hAzzle.err(!0,7," no collection length exist in collection.reduce()"),b=a[e?e[f++]:f++]);for(;f<g;f++)h=e?e[f]:f,b=c(b,a[h],h,a);return b},f=function(a,c,b){"undefined"===typeof c&&(c=0);"undefined"===typeof b&&(b=a?a.length:
0);var m=-1;b=b-c||0;for(var e=Array(0>b?0:b);++m<b;)e[m]=a[c+m];return e};this.toJqueryZepto=function(){for(var a=this.length,c=this.elements;a--;)this[a]=c[a];return this};this.get=function(a){return void 0===a?f(this.elements,0):0>a?this.elements[this.length+a]:this.elements[a]};this.eq=function(a){return-1===a?hAzzle(f(this.elements,this.length-1)):hAzzle(f(this.elements,a,a+1))};this.reduce=function(a,c,f){return b(this.elements,a,c,f)};this.indexOf=function(a,c,b){return null==c?-1:h.indexOf.call(c,
a,b)};this.map=function(a,c){return hAzzle(d.map(this.elements,a,c))};this.each=function(a,c,b){d.each(this.elements,a,c,b);return this};this.slice=function(a,c){return new hAzzle(f(this.elements,a,c))};this.concat=function(){var a=d.map(f(arguments),function(a){return a instanceof hAzzle?a.elements:a});return hAzzle(k.apply(this.elements,a))};this.is=function(a){return 0<this.length&&0<this.filter(a).length};this.not=function(a){return this.filter(a,!0)};this.index=function(a){var c=this.elements;
return a?"string"===typeof a?d.indexOf(hAzzle(a).elements,c[0]):d.indexOf(c,a instanceof hAzzle?a.elements[0]:a):c[0]&&c[0].parentElement?this.first().prevAll().length:-1};this.add=function(a,c){var b=a;"string"===typeof a&&(b=hAzzle(a,c).elements);return this.concat(b)};this.first=function(a){return a?this.slice(0,a):this.eq(0)};this.last=function(a){return a?this.slice(this.length-a):this.eq(-1)};this.even=function(){return this.filter(function(a){return 0!==a%2})};this.odd=function(){return this.filter(function(a){return 0===
a%2})};d.each({next:"nextElementSibling",prev:"previousElementSibling"},function(a,c){this[c]=function(c){return this.map(function(c){return c[a]}).filter(c)}}.bind(this));d.each({prevAll:"previousElementSibling",nextAll:"nextElementSibling"},function(a,c){this[c]=function(){var c=[];this.each(function(b){for(;(b=b[a])&&9!==b.nodeType;)c.push(b)});return hAzzle(c)}}.bind(this));return{makeArray:function(a,c){var b=c||[];void 0!==a&&(l.isArrayLike(Object(a))?d.merge(b,l.isString(a)?[a]:a):n.call(b,
a));return b},slice:f,reduce:b,inArray:function(a,c,b){return void 0===c?-1:h.indexOf.call(c,a,b)}}});
hAzzle.define("Jiesa",function(){var d=hAzzle.require("Util"),l=hAzzle.require("Core"),h=hAzzle.require("Collection"),p=hAzzle.require("Support"),k=/^\s*[+~]/,n=/[\n\t\r]/g,b=/^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,f=/^(\w+)(?:#([\w-]+)|)(?:\.([\w-]+)|)$/,a=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,c=RegExp("=[\\x20\\t\\r\\n\\f]*([^\\]'\"]*?)[\\x20\\t\\r\\n\\f]*\\]","g"),r=window.document.documentElement,m={},e=r.matches||r.webkitMatchesSelector||r.mozMatchesSelector||r.oMatchesSelector||r.msMatchesSelector,
g=function(b,c,e){var g=b,m=b.getAttribute("id"),f=m||"__hAzzle__",d=b.parentNode,h=k.test(c);if(h&&!d)return[];m?f=f.replace(/'/g,"\\$&"):b.setAttribute("id",f);h&&d&&(b=b.parentNode);c=c.match(a);for(d=0;d<c.length;d++)c[d]="[id='"+f+"'] "+c[d];c=c.join(",");try{return e.call(b,c)}finally{m||g.removeAttribute("id")}},u=function(a,c,b){return b&&9!==b.nodeType?g(b,c,function(c){return e(a,c)}):e.call(a,c)},q=function(a,c){var e,m,t,k=[];c=c||document;if(!a||"string"!==typeof a)return k;if(1!==(m=
c.nodeType)&&9!==m&&11!==m)return[];if(-1!==d.indexOf(a,",")&&(e=a.split(",")))return d.each(e,function(a){d.each(q(a),function(a){l.contains(k,a)||k.push(a)})}),k;if(l.isHTML)if(e=b.exec(a))if(a=e[1])if(9===m)if((t=c.getElementById(a))&&t.parentNode){if(t.id===a)return[t]}else return[];else{if(c.ownerDocument&&(t=c.ownerDocument.getElementById(a))&&l.contains(c,t)&&t.id===e)return[t]}else{if(a=e[2])return h.slice(c.getElementsByClassName(a));if(a=e[3])return h.slice(c.getElementsByTagName(a))}else{if(e=
f.exec(a)){m=c.getElementsByTagName(e[1]);var u=e[2],r=e[3];d.each(m,function(a){var c;(c=a.id===u)||(c=p.classList?a.classList.contains(r):0<=(" "+a.className+" ").replace(n," ").indexOf(r));c&&k.push(a)});return k}if(p.qsa&&!l.rbuggyQSA.length)return 1===c.nodeType&&"object"!==c.nodeName.toLowerCase()?h.slice(g(c,a,c.querySelectorAll)):h.slice(c.querySelectorAll(a))}},t=function(a,b){if(b.nodeType)return a===b;(a.ownerDocument||a)!==document&&l.setDocument(a);b="string"===typeof b?b.replace(c,"='$1']"):
b;if(b instanceof hAzzle)return d.some(b.elements,function(c){return t(a,c)});if(a===document)return!1;if(l&&l.isHTML){if(m[b])return m[b](a);try{var e=u(a,b);if(e||l.disconnectedMatch||a.document&&11!==a.document.nodeType)return e}catch(g){}}};this.find=function(a,c,b){if(b)return q(a,c);if("string"===typeof a)return 1===this.length?hAzzle(q(a,this.elements[0])):h.reduce(this.elements,function(c,b){return hAzzle(c.concat(h.slice(q(a,b))))},[]);var e,g=this.length,m=this.elements;return hAzzle(d.filter(hAzzle(a).elements,
function(a){for(e=0;e<g;e++)if(l.contains(m[e],a))return!0}))};this.filter=function(a,c){if(void 0===a)return this;var b=this.elements,e=[];if("function"===typeof a)this.each(function(c,b){a.call(c,b,c)&&e.push(c)});else if("string"===typeof a){if(1===this.length&&1===b[0].nodeType)return hAzzle(u(b[0],a));d.each(b,function(b){t(b,a)!==(c||!1)&&1===b.nodeType&&e.push(b)});return hAzzle(e)}};return{matchesSelector:u,matches:t,pseudos:m,find:q}});
hAzzle.define("pseudos",function(){function d(d){return function(b){return"input"===b.nodeName.toLowerCase()&&b.type===d.toLowerCase()}}function l(d){return function(b){var f=b.nodeName.toLowerCase();return("input"===f||"button"===f)&&b.type===d.toLowerCase()}}function h(d){return function(b){return(d||"label"in b||b.href)&&b.disabled===d||"form"in b&&!1===b.disabled&&(b.isDisabled===d||b.isDisabled!==!d&&"label"in b!==d)}}var p=hAzzle.require("Util"),k=hAzzle.require("Jiesa");p.mixin(k.pseudos,{":hidden":function(d){var b=
d.style;return!b||"none"!==b.display&&"hidden"!==b.visibility?"hidden"===d.type:!0},":visible":function(d){return!k.pseudos[":hidden"](d)},":active":function(d){return d===document.activeElement},":empty":function(d){for(var b=d.childNodes,f=d.childNodes.length-1;0<=f;f--)if(d=b[f].nodeType,1===d||3===d)return!1;return!0},":text":function(d){var b;return"input"===d.nodeName.toLowerCase()&&"text"===d.type&&(null===(b=d.getAttribute("type"))||"text"===b.toLowerCase())},":button":function(d){var b=d.nodeName.toLowerCase();
return"input"===b&&"button"===d.type||"button"===b},":input":function(d){return/^(?:input|select|textarea|button)$/i.test(d.nodeName)},":selected":function(d){d.parentNode&&d.parentNode.selectedIndex;return!0===d.selected}});p.each({radio:!0,checkbox:!0,file:!0,password:!0,image:!0},function(h,b){k.pseudos[":"+b]=d(b)});p.each({submit:!0,reset:!0},function(d,b){k.pseudos[":"+b]=l(b)});k.pseudos[":enabled"]=h(!1);k.pseudos[":disabled"]=h(!0);return{}});
hAzzle.define("Strings",function(){var d=String.prototype.trim,l=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,h=/[A-Z]/g,p=/\b[a-z]/g,k=/^#x([\da-fA-F]+)$/,n=/^#(\d+)$/,b=/[&<>"']/g,f=/^-ms-/,a=/-([\da-z])/gi,c=[],r={lt:"<",gt:">",quot:'"',apos:"'",amp:"&"},m={},e=function(a){return a.toUpperCase()},g=function(a,c){return c.toUpperCase()},u=function(a){return"-"+a.charAt(0).toLowerCase()},q;for(q in r)m[r[q]]=q;m["'"]="#39";return{capitalize:function(a){return a?a.replace(p,e):a},hyphenate:function(a){return"string"===
typeof a?a?a.replace(h,u):a:(a="number"===typeof a?""+a:"")?"data-"+a.toLowerCase():a},camelize:function(b){return b&&"string"===typeof b?c[b]?c[b]:c[b]=b.replace(f,"ms-").replace(a,g):"number"===typeof b||"boolean"===typeof b?""+b:b},trim:function(a){return null==a?"":d?"string"===typeof a?a.trim():a:(a+"").replace(l,"")},escapeHTML:function(a){return a.replace(b,function(a){return"&"+m[a]+";"})},unescapeHTML:function(a){return a.replace(/\&([^;]+);/g,function(a,b){var c;return b in r?r[b]:(c=b.match(k))?
String.fromCharCode(parseInt(c[1],16)):(c=b.match(n))?String.fromCharCode(~~c[1]):a})},truncate:function(a,b,c){if(!a)return"";a=String(a);c=c||"...";b=~~b;return a.length>b?a.slice(0,b)+c:a}}});
hAzzle.define("Storage",function(){function d(){this.expando=n.expando+Math.random()}function l(a,c,g){if(void 0===g&&1===a.nodeType)if(g="data-"+c.replace(f,"-$1").toLowerCase(),g=a.getAttribute(g),"string"===typeof g){try{g="true"===g?!0:"false"===g?!1:"null"===g?null:+g+""===g?+g:b.test(g)?JSON.parse(g+""):g}catch(d){}r.set(a,c,g)}else g=void 0;return g}var h=hAzzle.require("Util"),p=hAzzle.require("Strings"),k=hAzzle.require("Types"),n=hAzzle.require("Core"),b=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
f=/([A-Z])/g,a=/\S+/g;d.accepts=h.acceptData;d.prototype={register:function(a,c){var b={};b[this.expando]={value:c||{},writable:!0,configurable:!0};a.nodeType?a[this.expando]={value:c||{}}:Object.defineProperties(a,b);return a[this.expando]},cache:function(a,c){if(!d.accepts(a))return{};var b=a[this.expando];return b?b:this.register(a,c)},set:function(a,c,b){if(a){var d;a=this.cache(a);if("string"===typeof c)a[c]=b;else if(k.isEmptyObject(a))h.mixin(a,c);else for(d in c)a[d]=c[d];return a}},access:function(a,
c,b){if(void 0===c||c&&"string"===typeof c&&void 0===b)return b=this.get(a,c),void 0!==b?b:this.get(a,p.camelize(c));this.set(a,c,b);return void 0!==b?b:c},get:function(a,c){var b=this.cache(a);return void 0!==b&&void 0===c?b:b[c]},release:function(c,b){var g,d,f=this.cache(c);if(void 0===b)this.register(c);else for(k.isArray(b)?d=b.concat(b.map(p.camelize)):(g=p.camelize(b),b in f?d=[b,g]:(d=g,d=f[d]?[d]:d.match(a)||[])),g=d.length;g--;)delete f[d[g]]},hasData:function(a){return!k.isEmptyObject(a[this.expando]||
{})},flush:function(a){a[this.expando]&&delete a[this.expando]}};var c=new d,r=new d;this.data=function(a,b){var d,f,h,k=this.elements[0],n=k&&k.attributes;if(void 0===a){if(this.length&&(h=r.get(k),1===k.nodeType&&!c.get(k,"hasDataAttrs"))){for(d=n.length;d--;)n[d]&&(f=n[d].name,0===f.indexOf("data-")&&(f=p.camelize(f.slice(5)),l(k,f,h[f])));c.set(k,"hasDataAttrs",!0)}return h}if("object"===typeof a)return this.each(function(b){r.set(b,a)});var v=p.camelize(a);if(k&&void 0===b){h=r.get(k,a);if(void 0!==
h)return h;h=r.get(k,v);var s=c.get(this,"hasDataAttrs"),z=-1!==a.indexOf("-");if(void 0!==h)return h;h=l(k,v,void 0);if(void 0!==h)return h}else this.each(function(c){var d=r.get(c,v);r.set(c,v,b);z&&void 0!==d&&r.set(c,a,b);z&&void 0===s&&r.set(c,a,b)})};this.removeData=function(a){return this.each(function(b){r.release(b,a)})};return{"private":c,data:r}});
hAzzle.define("curCSS",function(){var d=hAzzle.require("has"),l=hAzzle.require("Core"),h=hAzzle.require("Types"),p=hAzzle.require("Util"),k=hAzzle.require("Support"),n=hAzzle.require("Storage"),b=window.document.documentElement,f=!!document.defaultView.getComputedStyle,a=k.computedStyle&&d.has("webkit")?function(a){var b;if(1===a.nodeType){var c=a.ownerDocument.defaultView;b=c.getComputedStyle(a,null);!b&&a.style&&(a.style.display="",b=c.getComputedStyle(a,null))}return b||{}}:function(a){var b=!1;
return a&&a!==window?(void 0!==a.ownerDocument&&(b=a.ownerDocument.defaultView),k.cS?b&&f?b.opener?b.getComputedStyle(a,null):window.getComputedStyle(a,null):a.style:a.style):null},c=function(a){if(a)return void 0===n["private"].get(a,"computed")&&n["private"].access(a,"computed",{computedStyle:null}),n["private"].get(a,"computed")},r=function(b){return null===c(b).computedStyle?c(b).computedStyle=a(b):c(b).computedStyle},m=function(a,b,c){"object"===typeof a&&a instanceof hAzzle&&(a=a.elements[0]);
var f=0;if(!c){if("height"===b&&"border-box"!==m(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-(parseFloat(m(a,"borderTopWidth"))||0)-(parseFloat(m(a,"borderBottomWidth"))||0)-(parseFloat(m(a,"paddingTop"))||0)-(parseFloat(m(a,"paddingBottom"))||0);if("width"===b&&"border-box"!==m(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-(parseFloat(m(a,"borderLeftWidth"))||0)-(parseFloat(m(a,"borderRightWidth"))||0)-(parseFloat(m(a,"paddingLeft"))||0)-(parseFloat(m(a,"paddingRight"))||
0)}if(f=r(a)){(d.ie||d.has("firefox"))&&"borderColor"===b&&(b="borderTopColor");f=9===d.ie&&"filter"===b?f.getPropertyValue(b):f[b];if(""===f||null===f)f=a.style[b];"auto"!==f||"top"!==b&&"right"!==b&&"bottom"!==b&&"left"!==b||(c=m(a,"position"),"fixed"!==c&&("absolute"!==c||"left"!==b&&"top"!==b))||(f=hAzzle(a).position()[b]+"px");return f}};this.offset=function(a){if(arguments.length)return void 0===a?this.elements:this.each(function(b,c){var d=a,f,g,k,l=m(b,"position"),p=hAzzle(b),n={};"static"===
l&&(b.style.position="relative");k=p.offset();g=m(b,"top");f=m(b,"left");("absolute"===l||"fixed"===l)&&-1<(g+f).indexOf("auto")?(f=p.position(),g=f.top,f=f.left):(g=parseFloat(g)||0,f=parseFloat(f)||0);h.isType("function")(d)&&(d=d.call(b,c,k));null!=d.top&&(n.top=d.top-k.top+g);null!=d.left&&(n.left=d.left-k.left+f);"using"in d?d.using.call(b,n):p.css(n)});var b,c;c=this.elements[0];var d={top:0,left:0},f=c&&c.ownerDocument;if(f){b=f.documentElement;if(!l.contains(b,c))return d;c.getBoundingClientRect&&
(d=c.getBoundingClientRect());c=h.isWindow(f)?f:9===f.nodeType&&f.defaultView;return{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}}};this.position=function(){if(this.elements[0]){var a,b,c=this.elements[0],d={top:0,left:0};"fixed"===m(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),p.nodeName(a.elements[0],"html")||(d=a.offset()),d.top+=parseFloat(m(a.elements[0],"borderTopWidth",!0)),d.left+=parseFloat(m(a.elements[0],"borderLeftWidth",
!0)));d.top-=a.scrollTop();d.left-=a.scrollLeft();return{top:b.top-d.top-parseFloat(m(c,"marginTop",!0)),left:b.left-d.left-parseFloat(m(c,"marginLeft",!0))}}};this.offsetParent=function(){return this.map(function(){for(var a=this.offsetParent||b;a&&!p.nodeName(a,"html")&&"static"===m(a,"position");)a=a.offsetParent;return a||b})};return{computed:c,getStyles:r,css:m}});
hAzzle.define("Units",function(){var d=hAzzle.require("curCSS"),l=hAzzle.require("Support"),h=/^(left$|right$|margin|padding)/,p=/^(relative|absolute|fixed)$/,k=/^(top|bottom)$/,n=function(b,f,a,c){if(""===f||"px"===f)return b;if("%"===f){h.test(c)?c="width":k.test(c)&&(c="height");if(a=p.test(d.css(a,"position"))?a.offsetParent:a.parentNode)if(c=parseFloat(d.css(a,c)),0!==c)return b/c*100;return 0}if("em"===f)return b/parseFloat(d.css(a,"fontSize"));if(void 0===n.unity){var r=n.unity={};l.assert(function(a){a.style.width=
"100cm";document.body.appendChild(a);r.mm=a.offsetWidth/1E3});r.cm=10*r.mm;r["in"]=2.54*r.cm;r.pt=1*r["in"]/72;r.pc=12*r.pt}return(f=n.unity[f])?b/f:b};return{units:n}});
hAzzle.define("Setters",function(){var d=hAzzle.require("Util"),l=hAzzle.require("Core"),h=hAzzle.require("Types"),p=hAzzle.require("has"),k=hAzzle.require("Strings"),n=Array.prototype.concat,b="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2",f=/\S+/g,a=/\r/g,c=/^[\[\s]+|\s+|[\]\s]+$/g,r=/\s*[\s\,]+\s*/,m=/\\*\./g,e="multiple selected checked disabled readonly required async autofocus compact nowrap declare noshade hreflang onload srcnoresize defaultChecked autoplay controls defer autocomplete hidden tabindex readonly type accesskey dropzone spellcheck ismap loop scoped open".split(" "),g=
{},u={},q={"class":"className","for":"htmlFor"},t={innerHTML:1,textContent:1,className:1,htmlFor:p.has("ie"),value:1},w={get:{},set:{}},v={get:{},set:{}},s={get:{},set:{}},z={get:{},set:{}},A={get:{},set:{}},B=function(a){return a instanceof hAzzle?a.elements:a},D=function(a,b){var c=g[b.toLowerCase()];return c&&u[a.nodeName]&&c},C=function(a,b){a=B(a);for(var c,d,e=0,g="string"===typeof b?b.match(f):n(b),h=g.length;e<h;e++)c=g[e],d=q[c]||c,D(a,c)?a[d]=!1:a.removeAttribute(c)},y=function(a,b,c){var d=
(a=B(a))?a.nodeType:void 0,f,e,g=t[b];if(!d||3===d||8===d||2===d)return"";if("undefined"===typeof a.getAttribute)return x(a,b,c);1===d&&l.isXML(a)||(b=b.toLowerCase(),f=w["undefined"===c?"get":"set"][b]||D(a,b)?z["undefined"===c?"get":"set"][b]:s["undefined"===c?"get":"set"][b]);if(void 0===c){if(f&&(e=f.get(a,b))&&null!==e)return e;if("textContent"==b)return x(a,b);e=a.getAttribute(b,2);return null==e?void 0:e}if(c){if(f&&void 0!==(e=f.set(a,c,b)))return e;if(g||"boolean"==typeof c||h.isFunction(c))return x(a,
b,c);a.setAttribute(b,c+"")}else C(a,b)},x=function(a,b,c){var d=(a=B(a))?a.nodeType:void 0,f,e;if(!d||3===d||8===d||2===d)return"";if(1!==d||l.isHTML)b=q[b]||b,f="undefined"===c?v.get[b]:v.set[b];return"undefined"!==typeof c?f&&void 0!==(e=f.set(a,c,b))?e:a[b]=c:f&&null!==(e=f(a,b))?e:a[b]};this.val=function(b){var c,f,e;f=this.elements[0];if(arguments.length)return e=h.isFunction(b),this.each(function(a,f){var g;1===a.nodeType&&(g=e?b.call(a,f,hAzzle(a).val()):b,null==g?g="":"number"===typeof g?
g+="":h.isArray(g)&&(g=d.map(g,function(a){return null==a?"":a+""})),c=A.set[a.type]||A.set[a.nodeName.toLowerCase()],c&&void 0!==c(a,g,"value")||(a.value=g))});if(f){if(c=A.get[f.type]||A.get[f.nodeName.toLowerCase()])return c(f,"value");f=f.value;return"string"===typeof f?f.replace(a,""):null==f?"":f}};this.hasAttr=function(a){return a&&"undefined"!==typeof this.attr(a)};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.prop=function(a,b){var c=this.elements;
if("object"===typeof a)return this.each(function(b){d.each(a,function(a,c){x(b,c,a)})});if("undefined"===typeof b)return x(c[0],a);this.each(c,function(c){x(c,a,b)})};this.toggleProp=function(a){return this.each(function(b){return b.prop(a,!b.prop(a))})};this.removeProp=function(a){return this.each(function(){delete this[q[a]||a]})};this.removeAttr=function(a){return this.each(function(b){C(b,a)})};this.attr=function(a,b){var c=this.elements;return"object"===typeof a?this.each(function(b){d.each(a,
function(a,c){y(b,c,a)})}):"undefined"===typeof b?y(c[0],a):this.each(function(c){y(c,a,b)})};this.hasAttr=function(a){return a&&"undefined"!==typeof this.attr(a)};d.each(e,function(a){g[e[a]]=e[a]});d.each("input select option textarea button form details".split(" "),function(a){u[a.toUpperCase()]=!0});d.each("cellPadding cellSpacing maxLength rowSpan colSpan useMap frameBorder contentEditable textContent valueType tabIndex readOnly type accessKey tabIndex dropZone spellCheck hrefLang isMap srcDoc mediaGroup autoComplete noValidate radioGroup".split(" "),
function(a){q[a.toLowerCase()]=a});return{attrHooks:w,propHooks:v,boolHooks:z,nodeHooks:s,valHooks:A,propMap:q,boolAttr:g,boolElem:u,attr:y,prop:x,removeAttr:C,toggleAttr:function(a,b,c){a=B(a);"boolean"==typeof c||(c=null==y(a,b)===!1);var d=!c;c?y(a,b,""):C(a,b);return a[b]===d?a[b]=c:c},toAttrSelector:function(a,b,d){var f,e,g=0,h=0,l=[];b=!0===b;a="string"==typeof a?a.split(r):"number"==typeof a?""+a:a;for(f=a.length;g<f;)e=a[g++],(e=b?k.hyphenate(e):e.replace(c,""))&&(l[h++]=e);return!1===d?
l:h?"["+l.join("],[").replace(m,"\\\\.")+"]":""},getBooleanAttrName:D,SVGAttribute:function(a){if(p.ie||p.has("android")&&!p.has("chrome"))b+="|transform";return(new RegExp("^("+b+")$","i")).test(a)}}});hAzzle.define("attrHooks",function(){var d=hAzzle.require("Util"),l=hAzzle.require("Support"),h=hAzzle.require("Setters");d.mixin(h.attrHooks.set,{type:function(h,k){if(!l.radioValue&&"radio"===k&&d.nodeName(h,"input")){var n=h.value;h.setAttribute("type",k);n&&(h.value=n);return k}}});return{}});
hAzzle.define("propHooks",function(){var d=hAzzle.require("Util"),l=hAzzle.require("Support"),h=hAzzle.require("Setters");d.mixin(h.propHooks.get,{tabIndex:function(d){return d.hasAttribute("tabindex")||/^(?:input|select|textarea|button)$/i.test(d.nodeName)||d.href?d.tabIndex:-1}});l.optSelected||(h.propHooks.get.selected=function(d){(d=d.parentNode)&&d.parentNode&&d.parentNode.selectedIndex;return null});return{}});
hAzzle.define("boolHooks",function(){var d=hAzzle.require("Setters");d.boolHooks.set=function(l,h,p){!1===h?d.removeAttr(l,p):l.setAttribute(p,p);return p};return{}});
hAzzle.define("valHooks",function(){var d=hAzzle.require("Util"),l=hAzzle.require("Strings"),h=hAzzle.require("Text"),p=hAzzle.require("Types"),k=hAzzle.require("Collection"),n=hAzzle.require("Support"),b=hAzzle.require("Setters");d.mixin(b.valHooks.set,{select:function(b,a){for(var c,d,h=b.options,e=k.makeArray(a),g=h.length;g--;)if(d=h[g],d.selected=0<=k.inArray(d.value,e))c=!0;c||(b.selectedIndex=-1);return e}});d.mixin(b.valHooks.get,{option:function(b){var a=b.getAttribute(name,2);return null!==
a?a:l.trim(h.getText(b))},select:function(b){var a=b.selectedIndex,c="select-one"===b.type;b=b.options;var d=[],h,e,g;if(0>a)return"";g=c?a:0;for(e=c?a+1:b.length;g<e;g++)if(h=b[g],h.selected&&(n.optDisabled?!h.disabled:null===h.getAttribute("disabled"))&&(!h.parentElement.disabled||"OPTGROUP"!==h.parentElement.tagName)){h=hAzzle(h).val();if(c)return h;d.push(h)}return c&&!d.length&&b.length?b[a].value:d}});d.each(["radio","checkbox"],function(d){b.valHooks.set[d]=function(a,b){if(p.isArray(b))return a.checked=
0<=k.inArray(hAzzle(a).val(),b)}})});
(function(d){function l(b){return"string"===typeof b?d.document.createTextNode(b):b}function h(b){var a=d.document.createDocumentFragment(),c=p.call(b,0),h=0,k=b.length;if(1===b.length)return l(b[0]);for(;h<k;h++)try{a.appendChild(l(c[h]))}catch(e){}return a}for(var p=Array.prototype.slice,k=(d.Element||d.Node||d.HTMLElement).prototype,n=["append",function(){this.appendChild(h(arguments))},"prepend",function(){this.firstChild?this.insertBefore(h(arguments),this.firstChild):this.appendChild(h(arguments))},
"before",function(){var b=this.parentElement;b&&b.insertBefore(h(arguments),this)},"after",function(){this.parentElement&&(this.nextSibling?this.parentElement.insertBefore(h(arguments),this.nextSibling):this.parentElement.appendChild(h(arguments)))},"replace",function(){this.parentElement&&this.parentElement.replaceChild(h(arguments),this)},"remove",function(){this.parentElement&&this.parentElement.removeChild(this)},"matches",k.matchesSelector||k.webkitMatchesSelector||k.mozMatchesSelector||k.msMatchesSelector||
function(b){var a=this.parentElement;return!!a&&-1<indexOf.call(a.querySelectorAll(b),this)}],b=n.length;b;b-=2)n[b-2]in k||(k[n[b-2]]=n[b-1])})(window);