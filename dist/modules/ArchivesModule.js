"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivesModule = void 0;
var ArchivesModule = /** @class */ (function () {
    function ArchivesModule(apiClient) {
        this.apiStore = apiClient;
    }
    ArchivesModule.prototype.getStatus = function () {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/status");
    };
    ArchivesModule.prototype.getVersion = function () {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/version");
    };
    return ArchivesModule;
}());
exports.ArchivesModule = ArchivesModule;
