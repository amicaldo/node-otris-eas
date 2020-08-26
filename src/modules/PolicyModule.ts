import { EasApi } from '../EasApi';
import { AccessControlPolicy, AccessControlPolicyRule, Policy, RetentionPolicy, RetentionPolicyCreate, Store } from '../models/models';
import * as xmlbuilder2 from 'xmlbuilder2';
import FormData from 'form-data';
import tmp, { FileResult } from 'tmp';
import fs from 'fs';

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
  public getRetentionPolicy(store: Store, policyId: string): Promise<RetentionPolicy> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/retentionpolicy/${policyId}`)
      .then((res: any) => res);
  }

  /**
   * Creates a new retention policy.
   *
   * @param store - Store to create the retention policy in
   * @param retentionPolicy - Object of the retention policy to create (optional)
   */
  public createRetentionPolicy(store: Store, retentionPolicy: RetentionPolicyCreate = {}): Promise<Policy> {
    const form: FormData = this.generateRetentionPolicyCreateForm(retentionPolicy);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/retentionpolicy`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res);
  }

  /**
   * Updates an existing retention policy.
   *
   * @param store - Store to update the retention policy in
   * @param policyId - ID of the existing retention policy
   * @param retentionPolicy - Object of the new retention policy (optional)
   */
  public updateRetentionPolicy(store: Store, policyId: string, retentionPolicy: RetentionPolicyCreate = {}): Promise<Policy> {
    const form: FormData = this.generateRetentionPolicyCreateForm(retentionPolicy);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/retentionpolicy/${policyId}`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res);
  }

  /**
   * Deletes a retention policy.
   *
   * @param store - Store to remove the policy from
   * @param policyId - ID of the policy to remove
   * @returns Empty
   */
  public deleteRetentionPolicy(store: Store, policyId: string): Promise<unknown> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/retentionpolicy/${policyId}`);
  }

  /**
   * Requests an access control policy.
   *
   * @param store - Store to request the policy from
   * @param policyId - ID of the policy to retrieve
   * @returns Requested access control policy
   */
  public getAccessControlPolicy(store: Store, policyId: string): Promise<AccessControlPolicy> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`)
      .then((res: any) => res);
  }

  /**
   * Creates a new access control policy.
   *
   * @param store - Store to create the retention policy in
   * @param accessControlPolicy - Object of the access control policy to create
   * @returns Created access control policy
   */
  public createAccessControlPolicy(store: Store, accessControlPolicy: AccessControlPolicyRule[]): Promise<Policy> {
    const form: FormData = this.generateAccessControlPolicyCreateForm(accessControlPolicy);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/accesscontrolpolicy`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res);
  }

  /**
   * Updates an existing access control policy.
   *
   * @param store - Store to update the retention policy in
   * @param policyId - ID of the existing access control policy
   * @param accessControlPolicy - Object of the new access control policy
   * @returns Updated access control policy
   */
  public updateAccessControlPolicy(store: Store, policyId: string, accessControlPolicy: AccessControlPolicyRule[]): Promise<Policy> {
    const form: FormData = this.generateAccessControlPolicyCreateForm(accessControlPolicy);

    return this.apiStore.getApiJsonClient()
      .post(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`, {
        body: form,
        headers: form.getHeaders()
      })
      .then((res: any) => res);
  }

  /**
   * Deletes an access control policy.
   *
   * @param store - The store to remove the policy from
   * @param policyId - The ID of the policy to remove
   * @returns Empty
   */
  public deleteAccessControlPolicy(store: Store, policyId: string): Promise<unknown> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/accesscontrolpolicy/${policyId}`);
  }

  /**
   * Generates FormData to create or update a retention policy.
   *
   * @param retentionPolicy - Object of the retention policy to create (optional)
   * @returns Generated FormData
   */
  public generateRetentionPolicyCreateForm(retentionPolicy: RetentionPolicyCreate = {}): FormData {
    const form: FormData = new FormData();

    const xmlFile: FileResult = tmp.fileSync({ postfix: '.xml' });
    const xmlData: string = this.generateRetentionPolicyXml(retentionPolicy);

    fs.writeFileSync(xmlFile.name, xmlData);

    form.append('policy', fs.createReadStream(xmlFile.name));

    return form;
  }

  /**
   * Generates XML to create or update a retention policy.
   *
   * @param retentionPolicy - Object of the retention policy to create
   * @returns Generated retention policy XML
   */
  public generateRetentionPolicyXml(retentionPolicy: RetentionPolicyCreate): string {
    const xmlRetentionPolicy = xmlbuilder2
      .create({ version: '1.0' })
      .ele('retentionPolicy',
        { xmlns: 'http://namespace.otris.de/2010/01/localhost', 'xmlns:xlink': 'http://www.w3.org/1999/xlink' }
      );

    if (retentionPolicy.minimalDuration) {
      xmlRetentionPolicy.ele('minimalDuration').txt(retentionPolicy.minimalDuration);
    }

    if (retentionPolicy.maximalDuration) {
      xmlRetentionPolicy.ele('maximalDuration').txt(retentionPolicy.maximalDuration);
    }

    return xmlRetentionPolicy.end({ prettyPrint: true });
  }

  /**
   * Generates FormData to create or update an access control policy.
   *
   * @param accessControlPolicy - Object of the access control policy to create
   * @returns Generated FormData
   */
  public generateAccessControlPolicyCreateForm(accessControlPolicy: AccessControlPolicyRule[]): FormData {
    const form: FormData = new FormData();

    const xmlFile: FileResult = tmp.fileSync({ postfix: '.xml' });
    const xmlData: string = this.generateAccessControlPolicyXml(accessControlPolicy);

    fs.writeFileSync(xmlFile.name, xmlData);

    form.append('policy', fs.createReadStream(xmlFile.name));

    return form;
  }

  /**
   * Generates XML to create or update an access control policy.
   *
   * @param accessControlPolicy - Object of the access control policy to create
   * @returns Generated access control policy XML
   */
  public generateAccessControlPolicyXml(accessControlPolicy: AccessControlPolicyRule[]): string {
    const xmlAccessControlPolicy = xmlbuilder2
      .create({ version: '1.0' })
      .ele('accessControlPolicy')
      .ele('rules');

    for (const rule of accessControlPolicy) {
      // Create XML rule element
      const xmlRule = xmlAccessControlPolicy.ele('rule');

      // Add identity element
      xmlRule.ele('identity').txt(rule.identity);

      if (rule.permissions) {
        // Create permissions element
        const xmlPermissions = xmlRule.ele('permissions');

        // Add permission elements
        Object.entries(rule.permissions).forEach(([permission, value]) => {
          if (value) {
            xmlPermissions.ele(permission).txt('allow');
          }
        });
      }
    }

    return xmlAccessControlPolicy.end({ prettyPrint: true });
  }

}
