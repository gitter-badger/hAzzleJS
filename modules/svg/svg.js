// svg.js
hAzzle.define('svg', function() {

    // SVG ( Scalable Vector Graphics ) support

    var // Dependencies
        features = hAzzle.require('has'),
        core = hAzzle.require('core'),
        style = hAzzle.require('style'),
        types = hAzzle.require('types'),

        // SVG prefix regEx

        svgPrefix = /^svg.*/,

        // SVG namespace

        svgNS = 'http://www.w3.org/2000/svg',

        // Xml namespace

        xmlNS = 'http://www.w3.org/2000/xmlns/',

        // XLink namespace

        xlinkNS = 'http://www.w3.org/1999/xlink';

    //# FEATURE DETECTION

    // SVG support test

    features.add('SVG', !!document.createElementNS &&
        !!document.createElementNS(svgNS, 'svg').createSVGRect
    );

    // Method for creating a SVG element

    var create = function(name) {
            return document.createElementNS(svgNS, name);
        };

    // Extend isXML function check in the Core.js module

    core.isXML = function(origIsXml) {
        return function(elem) {
            return types.isSVGElem(elem) || origIsXml(elem);
        };
    }(core.isXML);

    //#CSS

    this.css = function(origCSS) {
        return function(elem, name, value) {
            var val = name ? (name.match(svgPrefix) ? hAzzle(elem).attr(style.cssProps[name] || name) : '') : false;
            return val || origCSS(elem, name, value);
        };
    }(this.css);
   
    return {
        svgNS: svgNS,
        xmlNS: xmlNS,
        xlinkNS: xlinkNS,
        support: features.has('SVG'),
        create: create,
    };
});