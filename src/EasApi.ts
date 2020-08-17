import got, { Got } from 'got';
import { RecordModule } from './modules/RecordModule';
import { StoreModule } from './modules/StoreModule';
import { AttachmentModule } from './modules/AttachmentModule';

export class EasApi {

  // API clients
  private readonly apiClient: Got;
  private readonly apiJsonClient: Got;

  // API modules
  private readonly recordModule: RecordModule;
  private readonly storeModule: StoreModule;
  private readonly attachmentModule: AttachmentModule;

  constructor(base: string, username: string, password: string) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    this.apiClient = got.extend({
      prefixUrl: base,
      headers: {
        'X-Otris-Eas-User': 'manager',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      }
    });

    this.apiJsonClient = this.apiClient.extend({
      responseType: 'json',
      resolveBodyOnly: true
    });

    this.recordModule = new RecordModule(this);
    this.storeModule = new StoreModule(this);
    this.attachmentModule = new AttachmentModule(this);
  }

  // Get API clients
  public getApiClient(): Got {
    return this.apiClient;
  }

  public getApiJsonClient(): Got {
    return this.apiJsonClient;
  }

  // Get API modules
  public records(): RecordModule {
    return this.recordModule;
  }

  public stores(): StoreModule {
    return this.storeModule;
  }

  public attachments(): AttachmentModule {
    return this.attachmentModule;
  }
}
