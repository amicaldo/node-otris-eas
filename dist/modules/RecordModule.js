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
exports.RecordModule = void 0;
var URLParams_1 = require("../helpers/URLParams");
var fs_1 = __importDefault(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
var tmp_1 = __importDefault(require("tmp"));
var xmlbuilder2 = __importStar(require("xmlbuilder2"));
/**
 * Module to handle records
 *
 * Each record can contain fields and attachments.
 */
var RecordModule = /** @class */ (function () {
    function RecordModule(apiClient) {
        this.apiStore = apiClient;
    }
    /**
     * Retrieves a record.
     *
     * @param store - Store the record is located in
     * @param recordId - ID of the record to retrieve
     * @returns Requested record
     */
    RecordModule.prototype.get = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId)
            .then(function (res) { return res; });
    };
    /**
     * Retrieves all records in a store.
     *
     * @param store - Store to retrieve all records from
     * @returns List of all records in the store
     */
    RecordModule.prototype.getAll = function (store) {
        return this.search(store, {
            query: 'record',
            itemsPerPage: Math.pow(2, 32) / 2 - 1 // Max int value
        });
    };
    /**
     * Retrieves all records in a store which are marked as deleted.
     *
     * @param store - Store to retrieve the records from
     * @returns Records marked as deleted
     */
    RecordModule.prototype.getRecordsMarkedDeleted = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/marked-deleted")
            .then(function (res) { return res.list; });
    };
    /**
     * Retrieves all records in a store whose minimum retention period has expired.
     *
     * @param store - Store to retrieve the records from
     * @returns List of records
     */
    RecordModule.prototype.getRecordsExpiredMin = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/expired-min")
            .then(function (res) { return res.list; });
    };
    /**
     * Deletes all records in a store whose minimum retention period has expired.
     *
     * @param store - Store to remove the records from
     * @returns Empty
     */
    RecordModule.prototype.deleteRecordsExpiredMin = function (store) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/retention/expired-min");
    };
    /**
     * Gets all records in a store whose maximum retention period has expired.
     *
     * @param store - Store to retrieve the records from
     * @returns List of records
     */
    RecordModule.prototype.getRecordsExpiredMax = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/expired-max")
            .then(function (res) { return res.list; });
    };
    /**
     * Deletes all records in a store whose maximum retention period has expired.
     *
     * @param store - Store to remove the records from
     * @returns Empty
     */
    RecordModule.prototype.deleteRecordsExpiredMax = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/expired-max");
    };
    /**
     * Creates (archives) a record in a store.
     *
     * @param store - Store to create the record in
     * @param record - Object of the record to create (optional)
     * @param recordIndexMode - Index mode of the record (optional)
     * @param attachmentIndexMode - Index mode of the attachment (optional)
     * @returns Reference to the archived record
     */
    RecordModule.prototype.create = function (store, record, recordIndexMode, attachmentIndexMode) {
        if (record === void 0) { record = {}; }
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = this.generateRecordCreateForm(record, recordIndexMode, attachmentIndexMode);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/record", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.records; });
    };
    /**
     * Creates a new version of an existing record.
     *
     * @param store - Store to create the record in
     * @param recordId - ID of the record to update
     * @param record - Object of the record to create (optional)
     * @param recordIndexMode - Index mode of the record (optional)
     * @param attachmentIndexMode - Index mode of the attachment (optional)
     * @returns Reference to the archived record
     */
    RecordModule.prototype.update = function (store, recordId, record, recordIndexMode, attachmentIndexMode) {
        if (record === void 0) { record = {}; }
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = this.generateRecordCreateForm(record, recordIndexMode, attachmentIndexMode);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/record/" + recordId, {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.records; });
    };
    /**
     * Physically deletes the specified record, if possible.
     *
     * @param store - Store which contains the record
     * @param recordId - Record to delete
     * @returns Empty
     */
    RecordModule.prototype.delete = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/record/" + recordId);
    };
    /**
     * Searches for records in a store using a query.
     *
     * @param store - The store to search in
     * @param query - The search query
     * @returns Requested search results
     */
    RecordModule.prototype.search = function (store, query) {
        return this.searchDetails(store, query)
            .then(function (res) { return res.result; });
    };
    /**
     * Searches for records in a store using a query.
     *
     * @param store - The store to search in
     * @param query - The search query
     * @returns Requested search results with additional statistical data
     */
    RecordModule.prototype.searchDetails = function (store, query) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/?" + URLParams_1.URLParams.getParamsString(query))
            .then(function (res) { return res; });
    };
    /**
     * Queries whether a record has subsequent versions.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record to query
     * @returns Version information
     */
    RecordModule.prototype.getVersion = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/version")
            .then(function (res) { return res; });
    };
    /**
     * Returns an integrity flag of a record.
     * This flag indicates whether the record has been manipulated or not.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record to verify
     * @returns Verification response
     */
    RecordModule.prototype.verify = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/verify")
            .then(function (res) { return res; });
    };
    /**
     * Returns an explanation for how the search rating for the passed search query is obtained.
     * Serves mainly to support troubleshooting and development.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record to explain the search rating of
     * @param query - Search query of which the specific rating should be explained
     * @returns Explanation of the search rating
     */
    RecordModule.prototype.getSearchExplanation = function (store, recordId, query) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/explain?query=" + query)
            .then(function (res) { return res; });
    };
    /**
     * Returns a list of available flags and their URI for the record.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record whose available flags are queried
     * @returns Available flags for the record
     */
    RecordModule.prototype.getFlags = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/flags")
            .then(function (res) { return res; });
    };
    /**
     * Queries whether a "protected" flag is set.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record to query
     * @returns Boolean of whether a "protected" flag is set
     */
    RecordModule.prototype.getProtectedFlag = function (store, recordId) {
        return this.apiStore.getApiClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/flags/protect")
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    /**
     * Sets a "protected" flag on a record.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record to set the flag on
     * @returns Empty
     */
    RecordModule.prototype.setProtectedFlag = function (store, recordId) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + store.name + "/record/" + recordId + "/flags/protect");
    };
    /**
     * Removes the "protected" flag of a record.
     *
     * @param store - Store containing the record
     * @param recordId - ID of the record to remove the flag of
     * @returns Empty
     */
    RecordModule.prototype.removeProtectedFlag = function (store, recordId) {
        return this.apiStore.getApiClient()
            .delete("eas/archives/" + store.name + "/record/" + recordId + "/flags/protect");
    };
    /**
     * Generates FormData to create or update a record.
     *
     * @param record - Object of the record to create (optional)
     * @param recordIndexMode - Index mode of the record (optional)
     * @param attachmentIndexMode - Index mode of the attachment (optional)
     * @returns Generated FormData
     */
    RecordModule.prototype.generateRecordCreateForm = function (record, recordIndexMode, attachmentIndexMode) {
        if (record === void 0) { record = {}; }
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        var xmlFile = tmp_1.default.fileSync({ postfix: '.xml' });
        var xmlData = this.generateRecordXml(record);
        fs_1.default.writeFileSync(xmlFile.name, xmlData);
        form.append('record', fs_1.default.createReadStream(xmlFile.name));
        form.append('recordIndexMode', recordIndexMode);
        form.append('attachmentIndexMode', attachmentIndexMode);
        return form;
    };
    /**
     * Generates XML to create or update a record.
     *
     * @param record - Object of the record to create
     * @returns Generated record XML
     */
    RecordModule.prototype.generateRecordXml = function (record) {
        var xmlRecord = xmlbuilder2
            .create({ version: '1.0' })
            .ele('records', { xmlns: 'http://namespace.otris.de/2010/09/archive/recordIntern' })
            .ele('record');
        if (record.title) {
            xmlRecord.ele('title').txt(record.title);
        }
        if (record.attachments) {
            for (var _i = 0, _a = record.attachments; _i < _a.length; _i++) {
                var attachment = _a[_i];
                xmlRecord
                    .ele('attachment')
                    .ele('name').txt(attachment.name)
                    .up()
                    .ele('path').txt(attachment.path);
            }
        }
        return xmlRecord.end({ prettyPrint: true });
    };
    return RecordModule;
}());
exports.RecordModule = RecordModule;
