import got from 'got';
import FormData from 'form-data';
import { ReadStream } from 'fs';

import { Store, Spool, StoreConfiguration } from './models/models';

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

    this.apiJsonClient = got.extend({
      prefixUrl: base,
      headers: {
        'x-otris-eas-user': 'manager',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      },
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
}
