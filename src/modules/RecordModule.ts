import { Record, RecordFragment, RecordQuery, RecordSearchDetails, RecordVerification, RecordVersion, Store } from '../models/models';
import { ReadStream } from 'fs';
import FormData from 'form-data';
import { EasApi } from '../EasApi';
import { URLSearchParams } from 'url';

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

  public create(
    store: Store,
    recordFile: ReadStream,
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = new FormData();

    form.append('record', recordFile);
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
    recordFile: ReadStream,
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = new FormData();

    form.append('record', recordFile);
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

}
