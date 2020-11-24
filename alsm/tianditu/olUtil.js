ol.Class = function () {
    var a = arguments.length, b = arguments[0], c = arguments[a - 1],
        d = "function" == typeof c.initialize ? c.initialize : function () {
            b.prototype.initialize.apply(this, arguments)
        };
    1 < a ? (a = [d, b].concat(Array.prototype.slice.call(arguments).slice(1, a - 1), c), ol.inherit.apply(null, a)) : d.prototype = c;
    return d
};
ol.inherit = function (a, b) {
    var c = function () {
    };
    c.prototype = b.prototype;
    a.prototype = new c;
    var d, e, c = 2;
    for (d = arguments.length; c < d; c++) e = arguments[c], "function" === typeof e && (e = e.prototype), ol.Util.extend(a.prototype, e)
};
ol.Util = ol.Util || {};
ol.Util.extend = function (a, b) {
    a = a || {};
    if (b) {
        for (var c in b) {
            var d = b[c];
            void 0 !== d && (a[c] = d)
        }
        "function" == typeof window.Event && b instanceof window.Event || (!b.hasOwnProperty || !b.hasOwnProperty("toString")) || (a.toString = b.toString)
    }
    return a
};
