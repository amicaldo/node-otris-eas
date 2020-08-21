import {
  Record, RecordCreate,
  RecordFlags,
  RecordFragment,
  RecordQuery,
  RecordSearchDetails,
  RecordSearchExplanation,
  RecordVerification,
  RecordVersion,
  Store
} from '../models/models';
import { EasApi } from '../EasApi';
import { URLParams } from '../helpers/URLParams';
import FormData from 'form-data';
import fs from 'fs';
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

  public get(store: Store, recordId: string): Promise<Record> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}`)
      .then((res: any) => res);
  }

  public getAll(store: Store): Promise<Record[]> {
    return this.search(store, {
      query: 'record',
      itemsPerPage: Math.pow(2, 32) / 2 - 1 // Max int value
    });
  }

  public getRecordsMarkedDeleted(store: Store): Promise<any[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/marked-deleted`)
      .then((res: any) => res.list);
  }

  public getRecordsExpiredMin(store: Store): Promise<any[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/expired-min`)
      .then((res: any) => res.list);
  }

  public deleteRecordsExpiredMin(store: Store): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/retention/expired-min`);
  }

  public getRecordsExpiredMax(store: Store): Promise<any[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/expired-max`)
      .then((res: any) => res.list);
  }

  public deleteRecordsExpiredMax(store: Store): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention/expired-max`);
  }

  public create(
    store: Store,
    record: RecordCreate = { },
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = this.generateRecordCreateForm(record, recordIndexMode, attachmentIndexMode);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/record`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res.records);
  }

  public update(
    store: Store,
    recordId: string,
    record: RecordCreate = { },
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = this.generateRecordCreateForm(record, recordIndexMode, attachmentIndexMode);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/record/${recordId}`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res.records);
  }

  public delete(store: Store, recordId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/record/${recordId}`);
  }

  public search(store: Store, query: RecordQuery): Promise<Record[]> {
    return this.searchDetails(store, query)
      .then((res: RecordSearchDetails) => res.result);
  }

  public searchDetails(store: Store, query: RecordQuery): Promise<RecordSearchDetails> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/?${URLParams.getParamsString(query)}`)
      .then((res: any) => res);
  }

  public getVersion(store: Store, recordId: string): Promise<RecordVersion> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/version`)
      .then((res: any) => res);
  }

  public verify(store: Store, recordId: string): Promise<RecordVerification> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/verify`)
      .then((res: any) => res);
  }

  public getSearchExplanation(store: Store, recordId: string, query: string): Promise<RecordSearchExplanation> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/explain?query=${query}`)
      .then((res: any) => res);
  }

  public getFlags(store: Store, recordId: string): Promise<RecordFlags> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/flags`)
      .then((res: any) => res);
  }

  public setProtectedFlag(store: Store, recordId: string): Promise<any> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${store.name}/record/${recordId}/flags/protect`);
  }

  public removeProtectedFlag(store: Store, recordId: string): Promise<any> {
    return this.apiStore.getApiClient()
      .delete(`eas/archives/${store.name}/record/${recordId}/flags/protect`);
  }

  public generateRecordCreateForm(
    record: RecordCreate = { },
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
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
