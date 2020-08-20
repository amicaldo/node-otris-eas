import { EasApi } from "../EasApi";

export class ArchivesModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  public getStatus(): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/status`);
  }

  public getVersion(): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/version`);
  }

}
