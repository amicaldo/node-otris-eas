import { EasApi } from '../EasApi';
import { Store } from '../models/models';

export class PolicyModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  /**
   * Requests a retention policy.
   *
   * @param store - Store to request the policy from
   * @param policyId - ID of the policy to retrieve
   * @returns Requested retention policy
   */
  public getRetentionPolicy(store: Store, policyId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retentionPolicy/${policyId}`);
  }

  /**
   * Deletes a retention policy.
   *
   * @param store - Store to remove the policy from
   * @param policyId - ID of the policy to remove
   * @returns Empty
   */
  public deleteRetentionPolicy(store: Store, policyId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/retentionPolicy/${policyId}`);
  }

  /**
   * Requests an access control policy.
   *
   * @param store - Store to request the policy from
   * @param policyId - ID of the policy to retrieve
   * @returns Requested access control policy
   */
  public getAccessControlPolicy(store: Store, policyId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`);
  }

  /**
   * Deletes an access control policy.
   *
   * @param store - The store to remove the policy from
   * @param policyId - The ID of the policy to remove
   * @returns Empty
   */
  public deleteAccessControlPolicy(store: Store, policyId: string): Promise<any> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`);
  }

}
