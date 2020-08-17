"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpoolModule = void 0;
var form_data_1 = __importDefault(require("form-data"));
/**
 * Module to handle spooling of attachment files
 */
var SpoolModule = /** @class */ (function () {
    function SpoolModule(apiClient) {
        this.apiStore = apiClient;
    }
    SpoolModule.prototype.spoolFiles = function (store, files) {
        var form = new form_data_1.default();
        for (var i = 0; i < files.length; i++) {
            form.append((i > 0) ? "attachment" + i : 'attachment', files[i]);
        }
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/spool", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.spool; });
    };
    return SpoolModule;
}());
exports.SpoolModule = SpoolModule;
