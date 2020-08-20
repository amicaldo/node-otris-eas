import { EasApi } from "../EasApi";
import { Store } from "../models/models";

export class PoliciesModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  public get(store: Store, policyId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`);
  }

  public delete(store: Store, policyId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`);
  }

}
