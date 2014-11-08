// create.js

var hAzzle = window.hAzzle || (window.hAzzle = {});

hAzzle.define('create', function() {

    var
    // Modules

        _util = hAzzle.require('Util'),
        _types = hAzzle.require('Types'),
        _collection = hAzzle.require('Collection'),
        _has = hAzzle.require('has');
        
        var tagCache =  {"": ""};
        
        
    var format = function(tmpl, varMap) {
        if (typeof tmpl !== "string") tmpl = String(tmpl);

        if (!varMap || typeof varMap !== "object") varMap = {};

        return tmpl.replace(/\{([\w\-]+)\}/g, function(x, name)  {return name in varMap ? String(varMap[name]) : x});
    };
    
    var operators = {"(": 1,")": 2,"^": 3,">": 4,"+": 5,"*": 6,"`": 7,"[": 8,".": 8,"#": 8};
    
    var makeTerm = function(tag)  {
            return tagCache[tag] || (tagCache[tag] = "<" + tag + "></" + tag + ">");
        };
    
    
     var injectTerm = function(term, end)  {return function(html)  {
            // find index of where to inject the term
            var index = end ? html.lastIndexOf("<") : html.indexOf(">");
            // inject the term into the HTML string
            return html.substr(0, index) + term + html.substr(index);
        }},
       makeTerm = function(tag)  {
            return tagCache[tag] || (tagCache[tag] = "<" + tag + "></" + tag + ">");
        },
        makeIndexedTerm = function(n, term)  {
            var result = Array(n), i;

            for (i = 0; i < n; ++i) {
                result[i] = term.replace(/(\$+)(?:@(-)?(\d+)?)?/g, function(expr, fmt, sign, base)  {
                    var index = (sign ? n - i - 1 : i) + (base ? +base : 1);
                    // handle zero-padded index values, like $$$ etc.
                    return (fmt + index).slice(-fmt.length).replace( /\$/g, "0");
                });
            }

            return result;
        };
    
    var  emmet = function(template, varMap) {
        
        var $D$0;var $D$1;var $D$2;
        
        if (typeof template !== "string") throw new errors$$StaticMethodError("emmet", arguments);

        if (varMap) template = format(template, varMap);

        if (template in tagCache) {return tagCache[template];}

        // transform template string into RPN

        var stack = [], output = [];

        $D$2 = (template.match(/`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g));
        
        $D$0 = 0;$D$1 = $D$2.length;for (var str ;$D$0 < $D$1;){str = ($D$2[$D$0++]);
        
            var op = str[0];
            var priority = operators[op];

            if (priority) {
                if (str !== "(") {
                    // for ^ operator need to skip > str.length times
                    for (var i = 0, n = (op === "^" ? str.length : 1); i < n; ++i) {
                        while (stack[0] !== op && operators[stack[0]] >= priority) {
                            var head = stack.shift();

                            output.push(head);
                            // for ^ operator stop shifting when the first > is found
                            if (op === "^" && head === ">") break;
                        }
                    }
                }

                if (str === ")") {
                    stack.shift(); // remove "(" symbol from stack
                } else {
                    // handle values inside of `...` and [...] sections
                    if (op === "[" || op === "`") {
                        output.push(str.slice(1, -1));
                    }
                    // handle multiple classes, e.g. a.one.two
                    if (op === ".") {
                        output.push(str.substr(1).replace(/\./g, " "));
                    }

                    stack.unshift(op);
                }
            } else {
                output.push(str);
            }
        };$D$0 = $D$1 = $D$2 = void 0;

        output = output.concat(stack);

        // transform RPN into html nodes

        stack = [];

        $D$0 = 0;$D$1 = output.length;for (var str$0 ;$D$0 < $D$1;){str$0 = (output[$D$0++]);
            if (str$0 in operators) {
                var value = stack.shift();
                var node = stack.shift();

                if (typeof node === "string") {
                    node = [ makeTerm(node) ];
                }

                switch(str$0) {
                case ".":
                    value = injectTerm(" class=\"" + value + "\"");
                    break;

                case "#":
                    value = injectTerm(" id=\"" + value + "\"");
                    break;

                case "[":
                    value = injectTerm(value.replace(dom$emmet$$reAttr, dom$emmet$$normalizeAttrs));
                    break;

                case "*":
                    node = makeIndexedTerm(+value, node.join(""));
                    break;

                case "`":
                    stack.unshift(node);
                    node = [ value ];
                    break;

                default: /* ">", "+", "^" */
                    value = typeof value === "string" ? makeTerm(value) : value.join("");

                    if (str$0 === ">") {
                        value = injectTerm(value, true);
                    } else {
                        node.push(value);
                    }
                }

                str$0 = typeof value === "function" ? node.map(value) : node;
            }

            stack.unshift(str$0);
        };$D$0 = $D$1 = void 0;

        if (output.length === 1) {
            // handle single tag case
            output = makeTerm(stack[0]);
        } else {
            output = stack[0].join("");
        }

        return output;
    };
    
    
    
        
  var createMethod = function(all) {return function(value, varMap) {
            var nodes, el;

            if (value && value in tagCache) {
                nodes = document.createElement(value);

                if (all) nodes = [ hAzzle(nodes) ];
            } else {
                value = value.trim();

                if (value[0] === "<" && value[value.length - 1] === ">") {
                    value = varMap ? format(value, varMap) : value;
                } else {
                    value = emmet(value, varMap);
                }

                dom$create$$sandbox.innerHTML = value; // parse input HTML string

                for (nodes = all ? [] : null; el = dom$create$$sandbox.firstChild; ) {
                    dom$create$$sandbox.removeChild(el); // detach element from the sandbox

                    if (el.nodeType === 1) {
                        if (all) {
                            nodes.push(new $Element(el));
                        } else {
                            nodes = el;

                            break; // stop early, because need only the first element
                        }
                    }
                }
            }

            return all ? nodes : $Element(nodes);
        }}
        
 console.log(createMethod())
        
    return {
    };
});