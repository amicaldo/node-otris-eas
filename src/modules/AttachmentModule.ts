import { Record, RecordFragment, Store } from '../models/models';
import { ReadStream } from 'fs';
import FormData from 'form-data';
import { EasApi } from '../EasApi';

export class AttachmentModule {
  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  public get(
    store: Store,
    recordId: string,
    attachmentId: string
  ): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/attachment/${attachmentId}`)
      .then((res: any) => res);
  }
}
