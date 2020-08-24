import { EasApi } from '../EasApi';
import { Store } from '../models/models';

export class AttachmentModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  /**
   * Requests an attachment.
   *
   * @param store - The store to request the attachment from
   * @param recordId - The ID of the record containing the attachment
   * @param attachmentId - The ID of the attachment to retrieve
   * @returns The requested attachment
   */
  public fetch(
    store: Store,
    recordId: string,
    attachmentId: string
  ): Promise<any> {
    return this.apiStore.getApiClient()
      .get(`eas/archives/${store.name}/record/${recordId}/attachment/${attachmentId}`, {
        headers: { 'Accept': '*/*' }
      })
      .then((res: any) => res.body);
  }

}
