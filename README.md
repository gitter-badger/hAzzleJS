hAzzle
======

[![Build Status](https://travis-ci.org/hazzlejs/hAzzleJS.svg?branch=master)](https://travis-ci.org/hazzlejs/hAzzleJS) [![Code Climate](https://codeclimate.com/github/hazzlejs/hAzzleJS.png)](https://codeclimate.com/github/hazzlejs/hAzzleJS) [![Coverage Status](https://coveralls.io/repos/mehranhatami/hAzzleJS/badge.png?branch=master)](https://coveralls.io/r/mehranhatami/hAzzleJS?branch=master)

**hAzzle** is a modular javascript library licensed under the terms of the MIT License written from the ground-up with modern browsers in mind. It is an attempt to bring together the best from all familiar libraries such as **jQuery**, **Underscore**, **Loadash**, and **Zepto**, borrowing from both browser and node.js code patterns.

It's biggest design goal is to be as minimal as possible, and give the controll back to you in form of modules, and this is the main reason why **hAzzle** is built as a collection of modules. 

The Core contains only the basic code needed for the modules to work. On top of the Core is the module layer. You can use it whole, or just import specific modules you need. The API should be familiar to everyone who has worked with some of the libraries mentioned above.

One important thing to note is that **hAzzle** doesn't try to subclass Array in any way. A **hAzzle instance** is just a standard object, with the current elements selection stored in the **.elements array**. This gives you option to use all **ES5** / **ES6** functions methods, or deal with the **.elements array** with the same methods you find in libraries such as **Underscore** and **Loadash**.

This alone gives you over 100 different ways to deal with the **.elements array**, and you are not restricted to a few methods as you find in **jQuery** / **Zepto**. 

The **util.js module** ( part of the Core) uses some of this native functions. And a couple of other functions such as **odd()** and **even()**.

**hAzzle** also provide some of the same **DOM traversing methods** you might know from **jQuery** / **Zepto** like **.siblings()**, **.has()**, **.children()**, etc. in the **traversing.js module**.

You will also find similar methods like **.eq()**, **.prev()**, **.nextAll()*, **.next()** e.g. in the **collection.js module** ( part of the Core) to traverse through the **.elements array**

Other methodds such as **.addClass()**, **.prepend()**, **.text()**, **.html()** e.g. are all included in the **module folder**.

jQuery / Zepto
---------------
**hAzzle** are **not** compatible with **jQuery** / **Zepto**, but if you use only this modules:

* hazzle.js
* support.js
* core.js
* jiesa.js
 
and use this command on the set of elements:

**.toJqueryZepto()**

the **.elements array** will be converted to **jQuery / Zepto style** and you can develop your own functions in the same way as you do for this libraries.

**Note! hazzle will work as before, so you can actually use both hAzzle and jQuery / Zepto methods together**

jQuery  similarities
---------------------

As most of the developers are accustomed to using jQuery, hAzzle supports some of the same features, although the API is different.  This function names are identical:

* attr () 
* prop () 
* val () 
* css () 

**and**

* valHooks () 
* propHooks () 
* attrHooks () 
* cssHooks ()

Your modules
--------------

You can develop your own modules for **hAzzle**. If you do so, upload them to the **public folder** with a sub-directory that has the same name as your plugin.

**Important!!** Don't forget to add a **dependency list** document in the root of your directory so other developers know what **hAzzle modules** to include together with the **Core** to get your module to work.

DOM Level 4 (DL4)
------------------

 **hAzzle** has a build in polify in the Core supporting the most common features. And also fixes a couple of cross-browser issues (e.g. IE9 and IE10's customEvent() are not usable as a constructor. The polify can't be removed, and needed for some of the modules (not part of the Core) to work. 

* prepend
* append
* before
* after
* replace
* remove
* matches
* customEvent

ECMA 7
-------

ECMA 7 are still experimental, and no browsers supports it except Firefox v. 35. This browser includes support for the 'contains' method of ECMA 7, and because the main goal with hAzzle are to create all browsers equal, hAzzle supports this in the Core. 

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/contains

Example of usage:

```javascript
[1, 2, 3].contains(2);     // true
[1, 2, 3].contains(4);     // false
[1, 2, 3].contains(3, 3);  // false
[1, 2, 3].contains(3, -1); // true
[1, 2, NaN].contains(NaN); // true
```
**hAzzle** also supports other **ECMA 7** specs through the **ecma7.js** module in the **/modules folder**. 

  * entries
 * escape
 * compare
 * getPropertyNames
 * getOwnPropertyDescriptors
 * getPropertyDescriptor

The **ecma7.js** module only contains functions that most likely will not change in the future. 

Why is the Core so big?
---------------------
The hAzzle Core are not so big comparing to other libraries, and contains a lot more then the Javascript library. It take care of cross-browser issues, browsers bugs, setting the right document (HTML / XML), feature detection and more.

One example are the **customEvent**. This method are not usable as a constructor in **IE9** / **IE10**. With **hAzzle Core** this is fixed! Ref: https://developer.mozilla.org/en/docs/Web/API/CustomEvent

Another quick example on the benefits using the **hAzzle Core** comparing to jQuery library.

Let's say you want to append() some content. With hAzzle and DL4, you do it like this:

```javascript
<div id="d">Hello! </div>
document.getElementById('d').append('new content');
```

**2 lines of code**, and pure, native Javascript is all it takes to append content.

Comparing to **jQuery**, to archive the same you have to add over **60 lines of code**:

https://github.com/jquery/jquery/blob/master/src/manipulation.js#L194

and you are stricted to use **jQuery** for this methods.

How to use
-------------
You can use all functions internally in the same way as you do in **jQuery** / **Zepto**. 

```javascript
hAzzle('#id').eq(1).append('new content');
```
or a each example:

```javascript
this.each(function(elem) {
});
```
**NOTE!** From v. 1.01a the **this** keyword in the **each()** and **map()** methods are no longer pointing to the window object, but to the element itself. They are now working the same way as you are used to from **jQuery** / **Zepto** / **Mootools** and **Prototype**.

You can still bind the elements to the Window Object as before.

```javascript
this.each(function(elem) {
this['hello'] = function() { console.log('Hello!'); });
}.bind(this));

Then you can access it like this:

hAzzle('p').hello();

and it will show you 'Hello!' in the console log
```
For the methods **find()**, **filter()**, **reduce()** , the  **this** keyword are still a reference to the Window object.

**hAzzle** are more powerfull then this, and you can choose to include and use only the modules you want ( Core need to be loaded on the page first)

In the each() example above, we can also do it like this:

```javascript
var _util = hAzzle.require('Util');
var obj = {a:'1', b:'2'};

_util.each(obj, function(a, b) {}) 
```
**Note!** Mostly all functions can be used this way. There are a few exceptions, and this is restricted for internal uage with the **. elements array**

```javascript

// Get the elements array
var _arr  = hAzzle('p')

The array can be used like this:

console.log(_arr.elements)
```

Natives **ES5** / **ES6** on the **.elements array** are easy as well.

```javascript

// Get the elements array
var _arr  = hAzzle('p').elements

and then some natives:

_arr.reverse()
_arr.sort()
_arr.find()
_arr.filter()

```
Adding / removing classes can be done same way:

```javascript

hAzzle('p').addClass('test')
or
var _cls = hAzzle.require('Classes');

// hAzzle 
_cls.addClass(hAzzle('p'), 'test')

// native
_cls.addClass(document.getElementById('example'), 'test')

```
**Note!** If you include all modules you have a complete library like **jQuery** / **Zepto**, and you have mostly the same methods with a **big** exception. Everything are done the native way with hAzzle, so nothing are compatible with the mentioned libraries. Meaning you can't copy a function from **hAzzle** and hope it works for **jQuery**, because it won't.

However. You can make jQuery work on hAzzle.

```javascript

// Make jQuery / Zepto work
var _arr  = hAzzle('p').toJqueryZepto();

the created _arr would look like

_arr[0] elem
_arr[1] elem
_arr[2] elem

```
Now you can use **jQuery / Zepto** methods as you are used too. But you can also use **hAzzle** methods together
with this functions.

**UnderscoreJS** and **Loadash** can be used as well. 

```javascript

// Get the elements array
var _arr  = hAzzle('p').elements;

// Include the library you want, and then use the methods like this:

_arr {method}

and you are dealing with the array.
```
It's also easy to create your own methods. No examples given, but with the **. elements array** as illustrated below you can use all native methods or **UnderscoreJS** // **Loadash** and create your own methods with the array.

Jiesa
-----

**hAzzle** have a build in selector engine - **jiesa**. **Jiesa** are using the native **querySelectorAll (QSA)** if no other selector engines are installed. 

The main selector engine for **hAzzle** are a stand-alone module - **selector.js** - and can be replaced with your own selector engine.

To get your engine to work with **hAzzle**, you need to include this piece of code: 

```javascript

hAzzle.define('selector', function() {

 return { find: { YOUR NAME HERE }  };

});

```
**find { YOUR NAME HERE };** are important because **Jiesa** will check if the **selector.js** are installed and use that selector engine over **QSA** if installed.

**hAzzle** also have a quick way to detect browsers features / bugs, if you choose to develop your own selector engine. 

Example:

```javascript

// Use addFeature() to add a feature / bug check

_core.addFeature('supportAttributes', !div.getAttribute('className'));

// Output the result

console.log(_core.environment.supportAttributes); // boolean true / false

```
You can get unique ID for current document like this:

```javascript

console.log(_core.environment.id);

```

And if you want to check if current document is HTML or XML, you do:

```javascript

// HTML doc
console.log(_core.isHTML);

// XML doc
console.log(_core.isXML);

```
**Note!** hAzzle's selector engine has a few similarites with other selector engines regarding the **core.js** module. It can't be avoid, for if you
look at **Prototype**, **Slick** or even **Sizzle** they are almost the same when it comes to sorting DOM nodes e.g.
Based on this **hAzzle** supports similarities with Sizzle when it comes to **QSA** and **matchesSelector** bug tests. 

**Sizzle**
 
* rbuggyQSA     
*  rbuggyMatches 

**hAzzle**
 
* QSABugs
* matchesBugs

Core
---------------------

<table>
<thead><tr>
  <th>module</th>  <th>description</th>
</tr></thead>
<tbody>
   <tr>
    <th><a href="core/hazzle.js#files">hazzle</a></th>
        <td>Main functions such as the module system</td>
  </tr>
  <tr>
    <th><a href="core/has.js#files">has</a></th>
        <td>Feature and browser detection methods. All browsers are detected with feature detection and not UserAgent (ua) for better security</td>
  </tr>
  <tr>
    <th><a href="core/core.js#files">core</a></th>
        <td>Core functions for the library. Dealing with correct documents - XML and HTML e.g.</td>
  </tr>
  <tr>
    <th><a href="core/types.js#files">types</a></th>
        <td>Provides a collection of <code>'is-methods'</code> e.g. <code>isString</code> and <code>isObject</code></td>
  </tr>
  <tr>
    <th><a href="core/util.js#files">util</a></th>
        <td>Ultility belt functions faithfull to native Javascript and browser features</td>
  </tr>
  <tr>
    <th><a href="core/text.js#files">text</a></th>
        <td></td>
  </tr>
  <tr>
    <th><a href="core/collection.js#files">collection</a></th>
     <td>
      Internal function for dealing with the <code>.elements array</code></td>
  </tr>
  <tr>
    <th><a href="core/jiesa.js#files">jiesa</a></th>
     <td>
      <code>Jiesa</code> basic selector. Also includes <code>find()</code>, <code>filter()</code> methods. <code>DOM Level 4 - matches()</code> are used for some of this methods.
    </td>
  </tr>
  <tr>
    <th><a href="core/strings.js#files">strings</a></th>
    <td><code>Provides methods for dealing with string such as <code>trim()</code> and <code>camelize()</code> </td>
  </tr>
  <tr>
    <th><a href="core/storage.js#files">storage</a></th>
    <td>
      Data / element storage methods. Store private and public data on object or <code>HTML5</code>.
    </td>
  </tr>
  <tr>
    <th><a href="core/curcss.js#files">curcss</a></th>
     <td>
      Provides basic getter / setter function for <code>CSS styles</code>, and return correct native values in the <code>px</code> unit
    </td>
  </tr>
 <tr>
    <th><a href="core/setters.js#files">setters</a></th>
     <td> Provide methods for setting / getting <code>attributes</code>, <code>properties</code> and <code>values</code></td>
  </tr>
 <tr>
    <th><a href="core/attrhooks.js#files">attrhooks</a></th>
     <td>
      Provides basic getter / setter function for the <code>attr()</code> method <code>setters.js</code> module.
    </td>
  </tr>
 <tr>
    <th><a href="core/prophooks.js#files">prophooks</a></th>
     <td>
      Provides basic getter / setter function for the <code>prop()</code> method <code>setters.js</code> module.
    </td>
  </tr>
 
 <tr>
    <th><a href="core/valhooks.js#files">valhooks</a></th>
     <td>
      Provides basic getter / setter function for the <code>val()</code> method <code>setters.js</code> module.
    </td>
  </tr>
 <tr>
    <th><a href="core/boolhooks.js#files">boolhooks</a></th>
     <td>
      Provides basic getter / setter function for methods in <code>setters.js</code> module.
    </td>
  </tr>
  <tr>
    <th><a href="core/doml4.js#files">doml4</a></th>
     <td>
      DOM Level 4 pollify. See the <code>DOM Level 4 section</code>
    </td>
  </tr>
  <tr>
    <th><a href="core/contains.js#files">contains</a></th>
     <td>
      ECMA 7 pollify function for contains() methods for browsers who don't support it. See the <code>ECMA 7 section</code>
    </td>
  </tr>
</tbody>
</table>

Modules
-------

<table>
<thead><tr>
  <th>module</th>  <th>description</th>
</tr></thead>
<tbody>
   <tr>
    <th><a href="modules/attributes.js#files">attributes</a></th>
        <td><code>HTML5</code> attribute functions</td>
  </tr>
  <tr>
    <th><a href="modules/style.js#files">style</a></th>
        <td>Setter and getter for CSS styles</td>
  </tr>
  <tr>
    <th><a href="modules/csshook.js#files">csshooks</a></th>
        <td>cssHooks for the style.js module</td>
  </tr>
  <tr>
    <th><a href="modules/dimensions.js#files">dimensions</a></th>
        <td>Provides various features for deling with width, and height, viewport, positions e.g.</td>
  </tr>
  <tr>
    <th><a href="modules/xhr.js#files">xhr</a></th>
        <td>XHR v. 2 with native promises support</td>
  </tr>
  <tr>
    <th><a href="modules/ready.js#files">ready</a></th>
        <td>Document ready method</td>
  </tr>
  <tr>
    <th><a href="modules/classes.js#files">classes</a></th>
     <td>
      <code>Add</code>, <code>remove</code> and <code>toggle</code> classes. Uses <code>classList</code> if browser supports it</td>
  </tr>
  <tr>
    <th><a href="modules/traversing.js#files">traversing</a></th>
     <td>
      Most common DOM traversion methods such as <code>up()</code>, <code>down()</code>, <code>next()<code>, <code>prev()</code> and similar methods know from jQuery / Zepto
    </td>
  </tr>
  <tr>
    <th><a href="modules/visibility.js#files">visibility</a></th>
    <td>
       <code>Add</code>, <code>remove</code> and <code>toggle</code> DOM elements     
    </td>
  </tr>
  <tr>
    <th><a href="modules/jsonxml.js#files">jsonxml</a></th>
    <td>
      <code>JSON</code> and <code>XML</code> support / parsing
    </td>
  </tr>
  <tr>
    <th><a href="modules/manipulation.js#files">manipulation</a></th>
     <td>
      Provides <code>append</code>, <code>prepend</code>, <code>text</code> and other familiar methods known from from jQuery / Zepto. <code>DOM Level 4</code> are used for some of this methods, and <code>insertAdjutantHTML</code>.
    </td>
  </tr>
 <tr>
    <th><a href="modules/ecma7.js#files">ecma7</a></th>
     <td>
      Provides a few <code>ECMA 7 (ecma262)</code> methids. This is experimentell and not supported by browsers!
    </td>
  </tr>
</tbody>
</table>

Browser compatiblity
--------------------

<table>
<thead>
<tr>
<th id="browser" style="text-align:left;"> Browser </th>
<th id="version" style="text-align:left;"> Version </th>
</tr>
</thead>

<tbody>
<tr>
<td style="text-align:left;"> Chrome  </td>
<td style="text-align:left;">20+       </td>
</tr>

<tr>
<td style="text-align:left;"> Safari  </td>
<td style="text-align:left;">6       </td>
</tr>

<tr>
<td style="text-align:left;"> Firefox </td>
<td style="text-align:left;">22+       </td>
</tr>

<tr>
<td style="text-align:left;"> IE      </td>
<td style="text-align:left;">9+       </td>
</tr>

<tr>
<td style="text-align:left;"> Opera   </td>
<td style="text-align:left;">15+    </td>
</tr>

</tbody>
</table>

<table>
<thead>
<tr>
<th id="browser" style="text-align:left;"> Browser           </th>
<th id="version" style="text-align:left;"> Version      </th>
</tr>
</thead>

<tbody>
<tr>
<td style="text-align:left;"> iOS               </td>
<td style="text-align:left;"> 6.0.1 </td>
</tr>

<tr>
<td style="text-align:left;"> Android           </td>
<td style="text-align:left;"> 4.0+         </td>
</tr>

<tr>
<td style="text-align:left;"> Blackberry        </td>
<td style="text-align:left;"> 9.0+          </td>
</tr>

<tr>
<td style="text-align:left;"> Opera Mobile      </td>
<td style="text-align:left;"> 13.1+  </td>
</tr>

<tr>
<td style="text-align:left;"> Chrome (Android)  </td>
<td style="text-align:left;"> 22+      </td>
</tr>

<tr>
<td style="text-align:left;"> Firefox (Android) </td>
<td style="text-align:left;"> 24+      </td>
</tr>

</tbody>
</table>



