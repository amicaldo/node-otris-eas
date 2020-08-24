import got, { Got } from 'got';
import { ArchiveModule } from './modules/ArchiveModule';
import { AttachmentModule } from './modules/AttachmentModule';
import { PolicyModule } from './modules/PolicyModule';
import { RecordModule } from './modules/RecordModule';
import { StoreModule } from './modules/StoreModule';

export class EasApi {

  // API clients
  private readonly apiClient: Got;
  private readonly apiJsonClient: Got;

  // API modules
  private readonly archiveModule: ArchiveModule;
  private readonly attachmentModule: AttachmentModule;
  private readonly policyModule: PolicyModule;
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

    this.archiveModule = new ArchiveModule(this);
    this.attachmentModule = new AttachmentModule(this);
    this.policyModule = new PolicyModule(this);
    this.recordModule = new RecordModule(this);
    this.storeModule = new StoreModule(this);
  }

  // Get API clients

  /**
   * Gets the regular API client.
   */
  public getApiClient(): Got {
    return this.apiClient;
  }

  /**
   * Gets the API client that resolves JSON
   */
  public getApiJsonClient(): Got {
    return this.apiJsonClient;
  }

  // Get API modules

  /**
   * Gets the module to handle archives.
   */
  public archives(): ArchiveModule {
    return this.archiveModule;
  }

  /**
   * Gets the module to handle attachments.
   */
  public attachments(): AttachmentModule {
    return this.attachmentModule;
  }

  /**
   * Gets the module to handle policies.
   */
  public policies(): PolicyModule {
    return this.policyModule;
  }

  /**
   * Gets the module to handle records.
   */
  public records(): RecordModule {
    return this.recordModule;
  }

  /**
   * Gets the module to handle stores.
   */
  public stores(): StoreModule {
    return this.storeModule;
  }

}
