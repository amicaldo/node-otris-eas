import { EasApi } from '../EasApi';
import { RetentionList, Spool, Store, StoreConfiguration, StoreTermListQuery } from '../models/models';
import { URLParams } from '../helpers/URLParams';
import { ReadStream } from 'fs';
import FormData from 'form-data';

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

  /**
   * Gets all existing stores.
   *
   * @returns Array of all existing stores with name and URL
   */
  public getAll(): Promise<Store[]> {
    return this.apiStore.getApiJsonClient()
      .get('eas/archives')
      .then((res: any) => res.stores);
  }

  /**
   * Creates a store.
   *
   * @param storeName - Name of the new store
   * @param iniData - Configuration of the new store as INI
   * @returns Whether the store was created
   */
  public create(storeName: string, iniData: string): Promise<boolean> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${storeName}`, {
        body: iniData
      })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Deletes a store.
   *
   * @param store - Store to be deleted
   * @returns Whether the store was deleted
   */
  public delete(store: Store): Promise<boolean> {
    return this.apiStore.getApiClient()
      .delete(`eas/archives/${store.name}`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Activates a store.
   *
   * @param store - Store to activate
   * @returns Whether the store was activated
   */
  public activate(store: Store): Promise<boolean> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${store.name}/active`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Deactivates a store.
   *
   * @param store - Store to deactivate
   * @returns Whether the store was deactivated
   */
  public deactivate(store: Store): Promise<boolean> {
    return this.apiStore.getApiClient()
      .delete(`eas/archives/${store.name}/active`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Requests a stores configuration.
   *
   * @param store - The store to request the configuration from
   * @returns Configuration object of the store
   */
  public getConfiguration(store: Store): Promise<StoreConfiguration> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/configuration`)
      .then((res: any) => res.configuration);
  }

  /**
   * Changes the configuration of a store.
   *
   * @param store - The store to update the configuration of
   * @param iniData - The updated configuration of the store as INI
   * @returns Whether the configuration was updated
   */
  public updateConfiguration(store: Store, iniData: string): Promise<boolean> {
    return this.apiStore.getApiClient()
      .put(`eas/archives/${store.name}/configuration`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Spools a file to later attach it to a record.
   *
   * @param store - The store to spool the file in
   * @param files - The file to spool as ReadStream
   * @returns List of the spooled files
   */
  public spoolFiles(store: Store, files: ReadStream[]): Promise<Spool[]> {
    const form: FormData = new FormData();

    for (let i: number = 0; i < files.length; i++) {
      form.append(
        (i > 0) ? `attachment${i}` : 'attachment',
        files[i]
      );
    }

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/spool`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res.spool);
  }

  /**
   * Retrieves the references to the list of deletable records.
   *
   * @param store - Store to search for deletable
   * @returns List of deletable records
   */
  public getRetentions(store: Store): Promise<RetentionList[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retention`)
      .then((res: any) => res.list);
  }

  /**
   * Retrieves a list of terms from the index that start with a certain character string (prefix)
   * and for which the number of entries in the index exceeds the specified threshold.
   *
   * @param store - Store to query the index of
   * @param query - Data to query
   * @returns List of queried terms
   */
  public getTermList(store: Store, query: StoreTermListQuery): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/termlist?${URLParams.getParamsString(query)}`);
  }

}
