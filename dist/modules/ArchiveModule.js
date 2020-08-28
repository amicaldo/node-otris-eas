"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveModule = void 0;
/**
 * Module to handle archive status and version queries
 */
var ArchiveModule = /** @class */ (function () {
    function ArchiveModule(apiClient) {
        this.apiStore = apiClient;
    }
    /**
     * Retrieves status information of the archive.
     *
     * - Count of all entries of folders and attachments in the registry
     * - Count of all entries in the index
     * - Display whether the loaded search index is current (true) or obsolete (false)
     * - Display whether the index contains deleted entries (true) or not (false)
     *
     * @returns Status information
     */
    ArchiveModule.prototype.getStatus = function () {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/status");
    };
    /**
     * Retrieves information about the EAS version of the respective archive instance.
     *
     * @returns Version information
     */
    ArchiveModule.prototype.getVersion = function () {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/version");
    };
    return ArchiveModule;
}());
exports.ArchiveModule = ArchiveModule;
