import { EasApi } from '../EasApi';
import { Annotation, Store } from '../models/models';
import * as xmlbuilder2 from 'xmlbuilder2';

/**
 * Module to handle annotations on records
 */
export class AnnotationModule {

  private readonly apiStore: EasApi;

  constructor(apiClient: EasApi) {
    this.apiStore = apiClient;
  }

  /**
   * Retrieves all annotations of the current user of a record.
   *
   * @param store - Store containing the record
   * @param recordId - Record to retrieve the annotations from
   * @returns List of annotations
   */
  public getAll(store: Store, recordId: string): Promise<Annotation[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/annotations`)
      .then((res: any) => res.recordAnnotations);
  }

  /**
   * Sets the annotations for a given record for the current user.
   * All existing annotations of the current user are overwritten.
   *
   * @param store - Store containing the record
   * @param recordId - Record to set the annotations of
   * @param annotations - List of annotations
   * @returns Whether the annotations have been set
   */
  public setAll(store: Store, recordId: string, annotations: Annotation[]): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .put(`eas/archives/${store.name}/record/${recordId}/annotations`, {
        body: this.generateAnnotationsXml(annotations),
        headers: {
          'Content-Type': 'application/xml'
        }
      })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Deletes all annotations of the current user for the given record.
   *
   * @param store - Store containing the record
   * @param recordId - Record to delete the annotations of
   * @returns Whether the annotations have been removed
   */
  public deleteAll(store: Store, recordId: string): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/record/${recordId}/annotations`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Retrieves all annotations of the current user of a record by their type.
   *
   * @param store - Store containing the record
   * @param recordId - Record to retrieve the annotations from
   * @param type - Type to query for
   * @returns List of annotations with the given type
   */
  public getAllByType(store: Store, recordId: string, type: string): Promise<Annotation[]> {
    return this.apiStore.getApiJsonClient()
      .get(`eas/archives/${store.name}/record/${recordId}/annotations/${type}`)
      .then((res: any) => res.annotations);
  }

  /**
   * Sets the annotations for a given type and record for the current user.
   * All existing annotations of the given type and current user are overwritten.
   *
   * @param store - Store containing the record
   * @param recordId - Record to set the annotations of
   * @param type - The type of annotations
   * @param annotations - List of annotations
   * @returns Whether the annotations have been set
   */
  public setAllByType(store: Store, recordId: string, type: string, annotations: Annotation[]): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .put(`eas/archives/${store.name}/record/${recordId}/annotations/${type}`, {
        body: this.generateAnnotationsXml(annotations),
        headers: {
          'Content-Type': 'application/xml'
        }
      })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Deletes all annotations of the current user for the given type and record.
   *
   * @param store - Store containing the record
   * @param recordId - Record to delete the annotations of
   * @param type - Type of annotations to delete
   * @returns Whether the annotations have been removed
   */
  public deleteAllByType(store: Store, recordId: string, type: string): Promise<boolean> {
    return this.apiStore.getApiJsonClient()
      .delete(`eas/archives/${store.name}/record/${recordId}/annotations/${type}`)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Generates XML to create or update an annotation.
   *
   * @param annotations - Object of the annotation to create
   * @returns Generated annotation XML
   */
  public generateAnnotationsXml(annotations: Annotation[]): string {
    const xmlAnnotations = xmlbuilder2
      .create({ version: '1.0', encoding: 'UTF-8' })
      .ele('recordAnnotations');

    for (const annotation of annotations) {
      xmlAnnotations
        .ele('annotation')
        .ele('type').txt(annotation.type)
        .up()
        .ele('value').txt(annotation.value);
    }

    return xmlAnnotations.end({ prettyPrint: true });
  }

}
