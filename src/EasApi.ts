import got, { Got } from 'got';
import { ArchivesModule } from './modules/ArchivesModule';
import { AttachmentModule } from './modules/AttachmentModule';
import { PoliciesModule } from './modules/PoliciesModule';
import { RecordModule } from './modules/RecordModule';
import { StoreModule } from './modules/StoreModule';

export class EasApi {

  // API clients
  private readonly apiClient: Got;
  private readonly apiJsonClient: Got;

  // API modules
  private readonly archivesModule: ArchivesModule;
  private readonly attachmentModule: AttachmentModule;
  private readonly policiesModule: PoliciesModule;
  private readonly recordModule: RecordModule;
  private readonly storeModule: StoreModule;

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

    this.archivesModule = new ArchivesModule(this);
    this.attachmentModule = new AttachmentModule(this);
    this.policiesModule = new PoliciesModule(this);
    this.recordModule = new RecordModule(this);
    this.storeModule = new StoreModule(this);
  }

  // Get API clients
  public getApiClient(): Got {
    return this.apiClient;
  }

  public getApiJsonClient(): Got {
    return this.apiJsonClient;
  }

  // Get API modules
  public archives(): ArchivesModule {
    return this.archivesModule;
  }

  public attachments(): AttachmentModule {
    return this.attachmentModule;
  }

  public policies(): PoliciesModule {
    return this.policiesModule;
  }

  public records(): RecordModule {
    return this.recordModule;
  }

  public stores(): StoreModule {
    return this.storeModule;
  }

}
