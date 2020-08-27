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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationModule = void 0;
var xmlbuilder2 = __importStar(require("xmlbuilder2"));
var AnnotationModule = /** @class */ (function () {
    function AnnotationModule(apiClient) {
        this.apiStore = apiClient;
    }
    /**
     * Retrieves all annotations of the current user of a record.
     *
     * @param store - Store containing the record
     * @param recordId - Record to retrieve the annotations from
     * @returns List of annotations
     */
    AnnotationModule.prototype.getAll = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/annotations")
            .then(function (res) { return res.recordAnnotations; });
    };
    /**
     * Sets the annotations for a given record for the current user.
     * All existing annotations of the current user are overwritten.
     *
     * @param store - Store containing the record
     * @param recordId - Record to set the annotations of
     * @param annotations - List of annotations
     * @returns Whether the annotations have been set
     */
    AnnotationModule.prototype.setAll = function (store, recordId, annotations) {
        return this.apiStore.getApiJsonClient()
            .put("eas/archives/" + store.name + "/record/" + recordId + "/annotations", {
            body: this.generateAnnotationsXml(annotations),
            headers: {
                'Content-Type': 'application/xml'
            }
        })
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    /**
     * Deletes all annotations of the current user for the given record.
     *
     * @param store - Store containing the record
     * @param recordId - Record to delete the annotations of
     * @returns Whether the annotations have been removed
     */
    AnnotationModule.prototype.deleteAll = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/record/" + recordId + "/annotations")
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    /**
     * Retrieves all annotations of the current user of a record by their type.
     *
     * @param store - Store containing the record
     * @param recordId - Record to retrieve the annotations from
     * @param type - Type to query for
     * @returns List of annotations with the given type
     */
    AnnotationModule.prototype.getAllByType = function (store, recordId, type) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/annotations/" + type)
            .then(function (res) { return res.annotations; });
    };
    /**
     * Sets the annotations for a given type and record for the current user.
     * All existing annotations of the given type and current user are overwritten.
     *
     * @param store - Store containing the record
     * @param recordId - Record to set the annotations of
     * @param type - The type of annotations
     * @param annotations - List of annotations
     * @returns Whether the annotations have been set
     */
    AnnotationModule.prototype.setAllByType = function (store, recordId, type, annotations) {
        return this.apiStore.getApiJsonClient()
            .put("eas/archives/" + store.name + "/record/" + recordId + "/annotations/" + type, {
            body: this.generateAnnotationsXml(annotations),
            headers: {
                'Content-Type': 'application/xml'
            }
        })
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    /**
     * Deletes all annotations of the current user for the given type and record.
     *
     * @param store - Store containing the record
     * @param recordId - Record to delete the annotations of
     * @param type - Type of annotations to delete
     * @returns Whether the annotations have been removed
     */
    AnnotationModule.prototype.deleteAllByType = function (store, recordId, type) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/record/" + recordId + "/annotations/" + type)
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    /**
     * Generates XML to create or update an annotation.
     *
     * @param annotations - Object of the annotation to create
     * @returns Generated annotation XML
     */
    AnnotationModule.prototype.generateAnnotationsXml = function (annotations) {
        var xmlAnnotations = xmlbuilder2
            .create({ version: '1.0', encoding: 'UTF-8' })
            .ele('recordAnnotations');
        for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
            var annotation = annotations_1[_i];
            xmlAnnotations
                .ele('annotation')
                .ele('type').txt(annotation.type)
                .up()
                .ele('value').txt(annotation.value);
        }
        return xmlAnnotations.end({ prettyPrint: true });
    };
    return AnnotationModule;
}());
exports.AnnotationModule = AnnotationModule;
