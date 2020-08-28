import { EasApi } from '../EasApi';

/**
 * Module to handle archive status and version queries
 */
export class ArchiveModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  /**
   * Retrieves status information of the archive.
   *
   * - Count of all entries of folders and attachments in the registry
   * - Count of all entries in the index
   * - Display whether the loaded search index is current (true) or obsolete (false)
   * - Display whether the index contains deleted entries (true) or not (false)
   *
   * @returns Status information
   */
  public getStatus(): Promise<unknown> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/status`);
  }

  /**
   * Retrieves information about the EAS version of the respective archive instance.
   *
   * @returns Version information
   */
  public getVersion(): Promise<unknown> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/version`);
  }

}
