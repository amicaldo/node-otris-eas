import { EasApi } from '../EasApi';
import {
  DeleteFlagParams,
  Record,
  RecordCreate,
  RecordFlags,
  RecordFragment,
  RecordQuery,
  RecordSearchDetails,
  RecordSearchExplanation,
  RecordVerification,
  RecordVersion,
  Store
} from '../models/models';
import { IndexMode } from '../models/types';
import { URLParams } from '../helpers/URLParams';
import fs from 'fs';
import FormData from 'form-data';
import tmp, { FileResult } from 'tmp';
import * as xmlbuilder2 from 'xmlbuilder2';

/**
 * Module to handle records
 *
 * Each record can contain fields and attachments.
 */
export class RecordModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  /**
   * Retrieves a record.
   *
   * @param store - Store the record is located in
   * @param recordId - ID of the record to retrieve
   * @returns Requested record
   */
  public get(store: Store, recordId: string): Promise<Record> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}`)
      .then((res: any) => res);
  }

  /**
   * Retrieves all records in a store.
   *
   * @param store - Store to retrieve all records from
   * @returns List of all records in the store
   */
  public getAll(store: Store): Promise<Record[]> {
    return this.search(store, {
      query: 'record',
      itemsPerPage: Math.pow(2, 32) / 2 - 1 // Max int value
    });
  }

  /**
   * Retrieves all records in a store which are marked as deleted.
   *
   * @param store - Store to retrieve the records from
   * @returns Records marked as deleted
   */
  public getRecordsMarkedDeleted(store: Store): Promise<Record[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/marked-deleted`)
      .then((res: any) => res.list);
  }

  /**
   * Retrieves all records in a store whose minimum retention period has expired.
   *
   * @param store - Store to retrieve the records from
   * @returns List of records
   */
  public getRecordsExpiredMin(store: Store): Promise<Record[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/expired-min`)
      .then((res: any) => res.list);
  }

  /**
   * Deletes all records in a store whose minimum retention period has expired.
   *
   * @param store - Store to remove the records from
   * @returns Empty
   */
  public deleteRecordsExpiredMin(store: Store): Promise<Record[]> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/retention/expired-min`)
      .then((res: any) => res.list);
  }

  /**
   * Gets all records in a store whose maximum retention period has expired.
   *
   * @param store - Store to retrieve the records from
   * @returns List of records
   */
  public getRecordsExpiredMax(store: Store): Promise<Record[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/expired-max`)
      .then((res: any) => res.list);
  }

  /**
   * Deletes all records in a store whose maximum retention period has expired.
   *
   * @param store - Store to remove the records from
   * @returns Empty
   */
  public deleteRecordsExpiredMax(store: Store): Promise<Record[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/expired-max`)
      .then((res: any) => res.list);
  }

  /**
   * Creates (archives) a record in a store.
   *
   * @param store - Store to create the record in
   * @param record - Object of the record to create (optional)
   * @param recordIndexMode - Index mode of the record (optional)
   * @param attachmentIndexMode - Index mode of the attachment (optional)
   * @returns Reference to the archived record
   */
  public create(
    store: Store,
    record: RecordCreate = {},
    recordIndexMode: IndexMode = 0,
    attachmentIndexMode: IndexMode = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = this.generateRecordCreateForm(record, recordIndexMode, attachmentIndexMode);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/record`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res.records);
  }

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
  public update(
    store: Store,
    recordId: string,
    record: RecordCreate = {},
    recordIndexMode: IndexMode = 0,
    attachmentIndexMode: IndexMode = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = this.generateRecordCreateForm(record, recordIndexMode, attachmentIndexMode);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/record/${recordId}`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res.records);
  }

  /**
   * Physically deletes the specified record, if possible.
   *
   * @param store - Store which contains the record
   * @param recordId - Record to delete
   * @returns Whether the record was deleted
   */
  public delete(store: Store, recordId: string): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/record/${recordId}`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Searches for records in a store using a query.
   *
   * @param store - The store to search in
   * @param query - The search query
   * @returns Requested search results
   */
  public search(store: Store, query: RecordQuery): Promise<Record[]> {
    return this.searchDetails(store, query)
      .then((res: RecordSearchDetails) => res.result);
  }

  /**
   * Searches for records in a store using a query.
   *
   * @param store - The store to search in
   * @param query - The search query
   * @returns Requested search results with additional statistical data
   */
  public searchDetails(store: Store, query: RecordQuery): Promise<RecordSearchDetails> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/?${URLParams.getParamsString(query)}`)
      .then((res: any) => res);
  }

  /**
   * Queries whether a record has subsequent versions.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to query
   * @returns Version information
   */
  public getVersion(store: Store, recordId: string): Promise<RecordVersion> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/version`)
      .then((res: any) => res);
  }

  /**
   * Returns an integrity flag of a record.
   * This flag indicates whether the record has been manipulated or not.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to verify
   * @returns Verification response
   */
  public verify(store: Store, recordId: string): Promise<RecordVerification> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/verify`)
      .then((res: any) => res);
  }

  /**
   * Returns an explanation for how the search rating for the passed search query is obtained.
   * Serves mainly to support troubleshooting and development.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to explain the search rating of
   * @param query - Search query of which the specific rating should be explained
   * @returns Explanation of the search rating
   */
  public getSearchExplanation(store: Store, recordId: string, query: string): Promise<RecordSearchExplanation> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/explain?query=${query}`)
      .then((res: any) => res);
  }

  /**
   * Returns a list of available flags and their URI for the record.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record whose available flags are queried
   * @returns Available flags for the record
   */
  public getFlags(store: Store, recordId: string): Promise<RecordFlags> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/flags`)
      .then((res: any) => res);
  }

  /**
   * Queries whether a "protected" flag is set.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to query
   * @returns Boolean of whether a "protected" flag is set
   */
  public getProtectedFlag(store: Store, recordId: string): Promise<boolean> {
    return this.apiStore.getApiClient()
      .get(`eas/archives/${store.name}/record/${recordId}/flags/protect`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Sets a "protected" flag on a record.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to set the flag on
   * @returns Whether the flag was set
   */
  public setProtectedFlag(store: Store, recordId: string): Promise<boolean> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${store.name}/record/${recordId}/flags/protect`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Removes the "protected" flag of a record.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to remove the flag of
   * @returns Whether the flag was removed
   */
  public removeProtectedFlag(store: Store, recordId: string): Promise<boolean> {
    return this.apiStore.getApiClient()
      .delete(`eas/archives/${store.name}/record/${recordId}/flags/protect`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Sets a "delete" flag on a record.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to set the flag on
   * @param parameters - Parameters for the flag
   * @returns Whether the flag was set
   */
  public setDeleteFlag(store: Store, recordId: string, parameters: DeleteFlagParams): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .put(`eas/archives/${store.name}/record/${recordId}/flags/delete?${URLParams.getParamsString(parameters)}`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Removes the "delete" flag of a record.
   *
   * @param store - Store containing the record
   * @param recordId - ID of the record to remove the flag of
   * @returns Whether the flag was removed
   */
  public removeDeleteFlag(store: Store, recordId: string): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/record/${recordId}/flags/delete`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Generates FormData to create or update a record.
   *
   * @param record - Object of the record to create (optional)
   * @param recordIndexMode - Index mode of the record (optional)
   * @param attachmentIndexMode - Index mode of the attachment (optional)
   * @returns Generated FormData
   */
  public generateRecordCreateForm(
    record: RecordCreate = {},
    recordIndexMode: IndexMode = 0,
    attachmentIndexMode: IndexMode = 0
  ): FormData {
    const form: FormData = new FormData();

    const xmlFile: FileResult = tmp.fileSync({ postfix: '.xml' });
    const xmlData: string = this.generateRecordXml(record);

    fs.writeFileSync(xmlFile.name, xmlData);

    form.append('record', fs.createReadStream(xmlFile.name));
    form.append('recordIndexMode', recordIndexMode);
    form.append('attachmentIndexMode', attachmentIndexMode);

    return form;
  }

  /**
   * Generates XML to create or update a record.
   *
   * @param record - Object of the record to create
   * @returns Generated record XML
   */
  public generateRecordXml(record: RecordCreate): string {
    const xmlRecord = xmlbuilder2
      .create({ version: '1.0' })
      .ele('records', { xmlns: 'http://namespace.otris.de/2010/09/archive/recordIntern' })
      .ele('record');

    if (record.title) {
      xmlRecord.ele('title').txt(record.title);
    }

    if (record.attachments) {
      for (const attachment of record.attachments) {
        xmlRecord
          .ele('attachment')
          .ele('name').txt(attachment.name)
          .up()
          .ele('path').txt(attachment.path);
      }
    }

    return xmlRecord.end({ prettyPrint: true });
  }

}
