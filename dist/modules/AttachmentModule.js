"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentModule = void 0;
var AttachmentModule = /** @class */ (function () {
    function AttachmentModule(apiClient) {
        this.apiStore = apiClient;
    }
    AttachmentModule.prototype.get = function (store, recordId, attachmentId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/attachment/" + attachmentId)
            .then(function (res) { return res; });
    };
    return AttachmentModule;
}());
exports.AttachmentModule = AttachmentModule;