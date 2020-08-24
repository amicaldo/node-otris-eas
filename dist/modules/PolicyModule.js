"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyModule = void 0;
var PolicyModule = /** @class */ (function () {
    function PolicyModule(apiClient) {
        this.apiStore = apiClient;
    }
    /**
     * Requests a retention policy.
     *
     * @param store - Store to request the policy from
     * @param policyId - ID of the policy to retrieve
     * @returns Requested retention policy
     */
    PolicyModule.prototype.getRetentionPolicy = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retentionPolicy/" + policyId);
    };
    /**
     * Deletes a retention policy.
     *
     * @param store - Store to remove the policy from
     * @param policyId - ID of the policy to remove
     * @returns Empty
     */
    PolicyModule.prototype.deleteRetentionPolicy = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/retentionPolicy/" + policyId);
    };
    /**
     * Requests an access control policy.
     *
     * @param store - Store to request the policy from
     * @param policyId - ID of the policy to retrieve
     * @returns Requested access control policy
     */
    PolicyModule.prototype.getAccessControlPolicy = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId);
    };
    /**
     * Deletes an access control policy.
     *
     * @param store - The store to remove the policy from
     * @param policyId - The ID of the policy to remove
     * @returns Empty
     */
    PolicyModule.prototype.deleteAccessControlPolicy = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId);
    };
    return PolicyModule;
}());
exports.PolicyModule = PolicyModule;
