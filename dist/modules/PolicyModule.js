"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyModule = void 0;
var xmlbuilder2 = __importStar(require("xmlbuilder2"));
var form_data_1 = __importDefault(require("form-data"));
var tmp_1 = __importDefault(require("tmp"));
var fs_1 = __importDefault(require("fs"));
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
            .get("eas/archives/" + store.name + "/retentionpolicy/" + policyId)
            .then(function (res) { return res; });
    };
    /**
     * Creates a new retention policy.
     *
     * @param store - Store to create the retention policy in
     * @param retentionPolicy - Object of the retention policy to create (optional)
     */
    PolicyModule.prototype.createRetentionPolicy = function (store, retentionPolicy) {
        if (retentionPolicy === void 0) { retentionPolicy = {}; }
        var form = this.generateRetentionPolicyCreateForm(retentionPolicy);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/retentionpolicy", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res; });
    };
    /**
     * Updates an existing retention policy.
     *
     * @param store - Store to update the retention policy in
     * @param policyId - ID of the existing retention policy
     * @param retentionPolicy - Object of the new retention policy (optional)
     */
    PolicyModule.prototype.updateRetentionPolicy = function (store, policyId, retentionPolicy) {
        if (retentionPolicy === void 0) { retentionPolicy = {}; }
        var form = this.generateRetentionPolicyCreateForm(retentionPolicy);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/retentionpolicy/" + policyId, {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res; });
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
            .delete("eas/archives/" + store.name + "/retentionpolicy/" + policyId);
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
            .get("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId)
            .then(function (res) { return res; });
    };
    /**
     * Creates a new access control policy.
     *
     * @param store - Store to create the retention policy in
     * @param accessControlPolicy - Object of the access control policy to create
     * @returns Created access control policy
     */
    PolicyModule.prototype.createAccessControlPolicy = function (store, accessControlPolicy) {
        var form = this.generateAccessControlPolicyCreateForm(accessControlPolicy);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/accesscontrolpolicy", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res; });
    };
    /**
     * Updates an existing access control policy.
     *
     * @param store - Store to update the retention policy in
     * @param policyId - ID of the existing access control policy
     * @param accessControlPolicy - Object of the new access control policy
     * @returns Updated access control policy
     */
    PolicyModule.prototype.updateAccessControlPolicy = function (store, policyId, accessControlPolicy) {
        var form = this.generateAccessControlPolicyCreateForm(accessControlPolicy);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId, {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res; });
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
    /**
     * Generates FormData to create or update a retention policy.
     *
     * @param retentionPolicy - Object of the retention policy to create (optional)
     * @returns Generated FormData
     */
    PolicyModule.prototype.generateRetentionPolicyCreateForm = function (retentionPolicy) {
        if (retentionPolicy === void 0) { retentionPolicy = {}; }
        var form = new form_data_1.default();
        var xmlFile = tmp_1.default.fileSync({ postfix: '.xml' });
        var xmlData = this.generateRetentionPolicyXml(retentionPolicy);
        fs_1.default.writeFileSync(xmlFile.name, xmlData);
        form.append('policy', fs_1.default.createReadStream(xmlFile.name));
        return form;
    };
    /**
     * Generates XML to create or update a retention policy.
     *
     * @param retentionPolicy - Object of the retention policy to create
     * @returns Generated retention policy XML
     */
    PolicyModule.prototype.generateRetentionPolicyXml = function (retentionPolicy) {
        var xmlRetentionPolicy = xmlbuilder2
            .create({ version: '1.0' })
            .ele('retentionPolicy', { xmlns: 'http://namespace.otris.de/2010/01/localhost', 'xmlns:xlink': 'http://www.w3.org/1999/xlink' });
        if (retentionPolicy.minimalDuration) {
            xmlRetentionPolicy.ele('minimalDuration').txt(retentionPolicy.minimalDuration);
        }
        if (retentionPolicy.maximalDuration) {
            xmlRetentionPolicy.ele('maximalDuration').txt(retentionPolicy.maximalDuration);
        }
        return xmlRetentionPolicy.end({ prettyPrint: true });
    };
    /**
     * Generates FormData to create or update an access control policy.
     *
     * @param accessControlPolicy - Object of the access control policy to create
     * @returns Generated FormData
     */
    PolicyModule.prototype.generateAccessControlPolicyCreateForm = function (accessControlPolicy) {
        var form = new form_data_1.default();
        var xmlFile = tmp_1.default.fileSync({ postfix: '.xml' });
        var xmlData = this.generateAccessControlPolicyXml(accessControlPolicy);
        fs_1.default.writeFileSync(xmlFile.name, xmlData);
        form.append('policy', fs_1.default.createReadStream(xmlFile.name));
        return form;
    };
    /**
     * Generates XML to create or update an access control policy.
     *
     * @param accessControlPolicy - Object of the access control policy to create
     * @returns Generated access control policy XML
     */
    PolicyModule.prototype.generateAccessControlPolicyXml = function (accessControlPolicy) {
        var xmlAccessControlPolicy = xmlbuilder2
            .create({ version: '1.0' })
            .ele('accessControlPolicy')
            .ele('rules');
        var _loop_1 = function (rule) {
            // Create XML rule element
            var xmlRule = xmlAccessControlPolicy.ele('rule');
            // Add identity element
            xmlRule.ele('identity').txt(rule.identity);
            if (rule.permissions) {
                // Create permissions element
                var xmlPermissions_1 = xmlRule.ele('permissions');
                // Add permission elements
                Object.entries(rule.permissions).forEach(function (_a) {
                    var permission = _a[0], value = _a[1];
                    if (value) {
                        xmlPermissions_1.ele(permission).txt('allow');
                    }
                });
            }
        };
        for (var _i = 0, accessControlPolicy_1 = accessControlPolicy; _i < accessControlPolicy_1.length; _i++) {
            var rule = accessControlPolicy_1[_i];
            _loop_1(rule);
        }
        return xmlAccessControlPolicy.end({ prettyPrint: true });
    };
    return PolicyModule;
}());
exports.PolicyModule = PolicyModule;
