import { Store, StoreConfiguration } from '../models/models';
import { EasApi } from '../EasApi';

/**
 * Module to handle stores
 *
 * Each store can contain records.
 */
export class StoreModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  public getAll(): Promise<Store[]> {
    return this.apiStore.getApiJsonClient()
      .get('eas/archives')
      .then((res: any) => res.stores);
  }

  public create(storeName: string, iniData: string): Promise<any> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${storeName}`, {
        body: iniData
      });
  }

  public delete(store: Store): Promise<any> {
    return this.apiStore.getApiClient()
      .delete(`eas/archives/${store.name}`);
  }

  public activate(store: Store): Promise<any> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${store.name}/active`);
  }

  public deactivate(store: Store): Promise<any> {
    return this.apiStore.getApiClient()
      .delete(`eas/archives/${store.name}/active`);
  }

  public getConfiguration(store: Store): Promise<StoreConfiguration> {
    return this.apiStore.getApiClient()
      .get(`eas/archives/${store.name}/configuration`)
      .then((res: any) => res.configuration);
  }

  public updateConfiguration(store: Store, iniData: string): Promise<any> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${store.name}/configuration`);
  }

}
