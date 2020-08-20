"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentModule = void 0;
var AttachmentModule = /** @class */ (function () {
    function AttachmentModule(apiClient) {
        this.apiStore = apiClient;
    }
    AttachmentModule.prototype.fetch = function (store, recordId, attachmentId) {
        return this.apiStore.getApiClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/attachment/" + attachmentId, {
            headers: { 'Accept': '*/*' }
        })
            .then(function (res) { return res.body; });
    };
    return AttachmentModule;
}());
exports.AttachmentModule = AttachmentModule;
