import DigestClient from 'digest-fetch';
import { Store } from './models/store';

export class Eas {
  private base: string;
  private api: DigestClient;
  private defaultHeaders = {
    'x-otris-eas-user': 'manager',
    'accept': 'application/json'
  };

  constructor(base: string, username: string, password: string) {
    this.base = base;
    this.api = new DigestClient(username, password, { algorithm: 'MD5' });
  }

  /**
   * Stores
   */
  public getStores(): Promise<Store[]> {
    return this.get('/eas/archives')
      .then((res: any) => res.json())
      .then((res: any) => res.stores);
  }

  public createStore(storeName: string, iniData: string): Promise<any> {
    return this.put(`/eas/archives/${storeName}`, iniData, {
      'Content-Type': 'plain/text'
    });
  }

  public deleteStore(store: Store): Promise<any> {
    return this.delete(`/eas/archives/${store.name}`)
      .then((res: any) => res.text());
  }

  public getStoreConfiguration(store: Store): Promise<any> {
    return this.get(`/eas/archives/${store.name}/configuration`)
      .then((res: any) => res.json())
      .then((res: any) => res.configuration);
  }

  public activateStore(store: Store): Promise<any> {
    return this.put(`/eas/archives/${store.name}/active`)
      .then((res: any) => res.text());
  }

  public deactivateStore(store: Store): Promise<any> {
    return this.delete(`/eas/archives/${store.name}/active`)
      .then((res: any) => res.text());
  }

  private post(endpoint, body: string = '', headers: object = { }): Promise<any> {
    return this.api.fetch(`${this.base}${endpoint}`, {
      method: 'post',
      headers: { ...this.defaultHeaders, ...headers },
      body: body
    });
  }

  private get(endpoint, headers: object = { }): Promise<any> {
    return this.api.fetch(`${this.base}${endpoint}`, {
      method: 'get',
      headers: { ...this.defaultHeaders, ...headers }
    });
  }

  private put(endpoint, body: string = '', headers: object = { }): Promise<any> {
    return this.api.fetch(`${this.base}${endpoint}`, {
      method: 'put',
      headers: { ...this.defaultHeaders, ...headers },
      body: body
    });
  }

  private delete(endpoint, headers: object = { }): Promise<any> {
    return this.api.fetch(`${this.base}${endpoint}`, {
      method: 'delete',
      headers: { ...this.defaultHeaders, ...headers }
    });
  }
}
