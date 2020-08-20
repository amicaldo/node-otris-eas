"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLParams = void 0;
var url_1 = require("url");
var URLParams = /** @class */ (function () {
    function URLParams() {
    }
    URLParams.getParamsString = function (query) {
        var params = new url_1.URLSearchParams();
        Object.entries(query).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return params.set(key, value);
        });
        return params.toString();
    };
    return URLParams;
}());
exports.URLParams = URLParams;
