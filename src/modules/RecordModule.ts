import { Record, RecordCreate, RecordFragment, RecordQuery, RecordSearchDetails, RecordVerification, RecordVersion, Store } from '../models/models';
import { ReadStream } from 'fs';
import { EasApi } from '../EasApi';
import { URLSearchParams } from 'url';
import * as xmlbuilder2 from 'xmlbuilder2';
import tmp from 'tmp';
import fs from 'fs';
import FormData from 'form-data';

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

  public create(
    store: Store,
    record: RecordCreate = { },
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = new FormData();

    const xmlFile: any = tmp.fileSync({ postfix: '.xml' });
    const xmlData: string = this.generateRecordXml(record);

    fs.writeFileSync(xmlFile.name, xmlData);

    form.append('record', fs.createReadStream(xmlFile.name));
    form.append('recordIndexMode', recordIndexMode);
    form.append('attachmentIndexMode', attachmentIndexMode);

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
    const form: FormData = new FormData();

    const xmlFile: any = tmp.fileSync({ postfix: '.xml' });
    const xmlData: string = this.generateRecordXml(record);

    fs.writeFileSync(xmlFile.name, xmlData);

    form.append('record', fs.createReadStream(xmlFile.name));
    form.append('recordIndexMode', recordIndexMode);
    form.append('attachmentIndexMode', attachmentIndexMode);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/record/${recordId}`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res.records);
  }

  public search(store: Store, query: RecordQuery): Promise<Record[]> {
    return this.searchDetails(store, query)
      .then((res: RecordSearchDetails) => res.result);
  }

  public searchDetails(store: Store, query: RecordQuery): Promise<RecordSearchDetails> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => params.set(key, value));

    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/?${params.toString()}`)
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

  public generateRecordXml(record: RecordCreate): string {
    const xmlRecord = xmlbuilder2
      .create({ version: '1.0' })
      .ele('records', { xmlns: 'http://namespace.otris.de/2010/09/archive/recordIntern '})
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
