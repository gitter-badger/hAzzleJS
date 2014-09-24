/*! hazzle v0.9.3a - MIT license */
(function(win) {
    function moduleDefinition() {
        return win.hAzzle;
    }
    var path = 'modules/',
        hazzleModules = [
            path + 'hazzle.js',
            path + 'booleans.js',
            path + 'doml4.js',
            path + 'query.js',
            path + 'types.js',
            path + 'ready.js',
            path + 'text.js',
            path + 'core.js',
            path + 'cache.js',			
            path + 'setter.js',			
            path + 'storage.js',
            path + 'jiesa.js',
            path + 'cl3.js',
			path + 'cl4.js',
            path + 'matchesselector.js',
            path + 'raf.js',
            path + 'html.js',
            path + 'shims/classlist.js',
            path + 'classes.js',
            path + 'manipulation.js',
            path + 'attributes.js',
            path + 'removeable.js',
            path + 'units.js',
            path + 'curcss.js',
            path + 'styles.js',
            path + 'position.js',
            path + 'offset.js',
            path + 'showhide.js',
            path + 'detection.js',
            path + 'events.js',
            path + 'trigger.js',
            path + 'aliases.js',
            path + 'eventhooks.js',
            path + 'ajax.js',
            path + 'clone.js',
            path + 'jsonxml.js'
        ];
    if (typeof exports === 'object') {
        // node export
        module.exports = moduleDefinition();
    } else if (typeof define === 'function' && define.amd) {
        // amd anonymous module registration
        define(hazzleModules, moduleDefinition);
    } else {
        // browser global
        win.hAzzle = moduleDefinition();
    }
}(this));