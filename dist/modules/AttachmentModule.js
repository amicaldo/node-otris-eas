"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentModule = void 0;
var AttachmentModule = /** @class */ (function () {
    function AttachmentModule(apiClient) {
        this.apiStore = apiClient;
    }
    /**
     * Requests an attachment.
     *
     * @param store - The store to request the attachment from
     * @param recordId - The ID of the record containing the attachment
     * @param attachmentId - The ID of the attachment to retrieve
     * @returns The requested attachment
     */
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
