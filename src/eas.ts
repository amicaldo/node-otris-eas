import got from 'got';
import FormData from 'form-data';
import { ReadStream } from 'fs';
import { Store, Spool, Record, RecordFragment, StoreConfiguration } from './models/models';

export class Eas {
  private apiClient: any;
  private apiJsonClient: any;

  constructor(base: string, username: string, password: string) {
    const token = Buffer.from(`${username}:${password}`).toString('base64')

    this.apiClient = got.extend({
      prefixUrl: base,
      headers: {
        'x-otris-eas-user': 'manager',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      }
    });

    this.apiJsonClient = this.apiClient.extend({
      responseType: 'json',
      resolveBodyOnly: true
    });
  }

  /**
   * Stores
   */
  public getStores(): Promise<Store[]> {
    return this.apiJsonClient.get('eas/archives');
  }

  public createStore(storeName: string, iniData: string): Promise<any> {
    return this.apiClient.put(`eas/archives/${storeName}`, {
      body: iniData
    })
  }

  public deleteStore(store: Store): Promise<any> {
    return this.apiClient.delete(`eas/archives/${store.name}`);
  }

  public activateStore(store: Store): Promise<any> {
    return this.apiClient.put(`eas/archives/${store.name}/active`);
  }

  public deactivateStore(store: Store): Promise<any> {
    return this.apiClient.delete(`eas/archives/${store.name}/active`);
  }

  public getStoreConfiguration(store: Store): Promise<StoreConfiguration> {
    return this.apiJsonClient.get(`eas/archives/${store.name}/configuration`)
      .then((res: any) => res.configuration);
  }

  public updateStoreConfiguration(store: Store, iniData: string): Promise<any> {
    return this.apiClient.put(`eas/archives/${store.name}/configuration`);
  }

  /**
   * Spool
   */
  public spoolFiles(store: Store, files: ReadStream[]): Promise<Spool[]> {
    const form: FormData = new FormData();

    for (let i: number = 0; i < files.length; i++) {
      form.append(
        (i > 0) ? `attachment${i}` : 'attachment',
        files[i]
      );
    }

    return this.apiJsonClient.post(`eas/archives/${store.name}/spool`, {
      body: form,
      headers: form.getHeaders()
    }).then((res: any) => res.spool);
  }

  public createRecords(
    store: Store,
    recordFile: ReadStream,
    recordIndexMode: number = 0,
    attachmentIndexMode: number = 0
  ): Promise<RecordFragment[]> {
    const form: FormData = new FormData();

    form.append('record', recordFile);
    form.append('recordIndexMode', recordIndexMode);
    form.append('attachmentIndexMode', attachmentIndexMode);

    return this.apiJsonClient.post(`eas/archives/${store.name}/record`, {
      body: form,
      headers: form.getHeaders()
    }).then((res: any) => res.records);
  }

  public updateRecords(
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

    return this.apiJsonClient
      .post(`eas/archives/${store.name}/record/${recordId}`, {
        body: form,
        headers: form.getHeaders()
      }).then((res: any) => res.records);
  }

  public getRecords(store: Store, recordId: string): Promise<Record[]> {
    return this.apiJsonClient
      .get(`eas/archives/${store.name}/record/${recordId}`);
  }
}
