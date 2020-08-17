import { Store } from '../models/models';
import { ReadStream } from 'fs';
import FormData from 'form-data';
import { EasApi } from '../EasApi';

/**
 * Module to handle spooling of attachment files
 */
export class SpoolModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  public spoolFiles(store: Store, files: ReadStream[]): Promise<SpoolModule[]> {
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

}
